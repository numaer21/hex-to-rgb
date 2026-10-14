import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, describe, it } from 'node:test';
import { app } from '../src/app.js';

describe('GET /api/hex-to-rgb (HTTP integration)', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
  });

  for (const [hex, expected] of [
    ['#123456', { r: 18, g: 52, b: 86 }],
    ['abc', { r: 170, g: 187, b: 204 }],
    ['#F0a', { r: 255, g: 0, b: 170 }],
    ['000000', { r: 0, g: 0, b: 0 }],
    ['FFFFFF', { r: 255, g: 255, b: 255 }],
  ]) {
    it(`returns 200 and RGB JSON for ${hex}`, async () => {
      const response = await fetch(`${baseUrl}/api/hex-to-rgb?${new URLSearchParams({ hex })}`);
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /^application\/json\b/);
      assert.deepEqual(await response.json(), expected);
    });
  }

  for (const [label, query] of [
    ['missing hex', ''],
    ['empty hex', '?hex='],
    ['invalid characters', '?hex=gggggg'],
    ['unsupported length', '?hex=1234'],
    ['alpha channel', '?hex=12345678'],
    ['leading whitespace', '?hex=%20abc'],
    ['trailing newline', '?hex=abc%0A'],
    ['repeated hex parameter', '?hex=abc&hex=def'],
    ['nested parameter', '?hex[value]=abc'],
  ]) {
    it(`returns 400 and an error for ${label}`, async () => {
      const response = await fetch(`${baseUrl}/api/hex-to-rgb${query}`);
      assert.equal(response.status, 400);
      assert.match(response.headers.get('content-type'), /^application\/json\b/);
      assert.deepEqual(await response.json(), {
        error: 'hex must be a 3- or 6-digit hexadecimal string with an optional #',
      });
    });
  }

  it('returns 404 for an unknown route', async () => {
    const response = await fetch(`${baseUrl}/does-not-exist`);
    assert.equal(response.status, 404);
  });

  it('returns 404 for an unsupported POST method', async () => {
    const response = await fetch(`${baseUrl}/api/hex-to-rgb?hex=abc`, { method: 'POST' });
    assert.equal(response.status, 404);
  });
});
