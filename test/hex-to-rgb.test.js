/**
 * @file hex-to-rgb.test.js
 * Tests valid hex-to-RGB conversions and rejection of invalid inputs.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hexToRgb } from '../src/hex-to-rgb.js';

describe('hexToRgb', () => {
  const validCases = [
    ['000000', { r: 0, g: 0, b: 0 }],
    ['#ffffff', { r: 255, g: 255, b: 255 }],
    ['ff0000', { r: 255, g: 0, b: 0 }],
    ['00ff00', { r: 0, g: 255, b: 0 }],
    ['0000ff', { r: 0, g: 0, b: 255 }],
    ['#123456', { r: 18, g: 52, b: 86 }],
    ['AbCdEf', { r: 171, g: 205, b: 239 }],
    ['#abc', { r: 170, g: 187, b: 204 }],
    ['F0a', { r: 255, g: 0, b: 170 }],
    ['000', { r: 0, g: 0, b: 0 }],
    ['#FFF', { r: 255, g: 255, b: 255 }],
  ];

  for (const [hex, expected] of validCases) {
    it(`converts ${hex}`, () => {
      assert.deepEqual(hexToRgb(hex), expected);
    });
  }

  const invalidCases = [
    '', '#', '12', '1234', '12345', '1234567', '12345678', '#abcd',
    'ggg', '#12zz56', '##abc', '0x123456', ' abc', 'abc ', 'abc\n',
    'ab c', '-12345', null, undefined, 123456, true, {}, ['abc'],
  ];

  for (const value of invalidCases) {
    it(`rejects ${JSON.stringify(value)}`, () => {
      assert.throws(() => hexToRgb(value), {
        name: 'TypeError',
        message: 'hex must be a 3- or 6-digit hexadecimal string with an optional #',
      });
    });
  }
});
