# Hex-to-RGB library and Express API

Requires Node.js 22 or newer and npm. From this directory:

```sh
npm ci
npm test
npm run test:coverage
npm start
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.
The server defaults to port 3000; set `PORT` to override it.

## Library

[hexToRgb](./src/hex-to-rgb.js) is a standalone JavaScript function with no dependencies:

```js
import { hexToRgb } from './src/hex-to-rgb.js';

hexToRgb('#1a2b3c'); // { r: 26, g: 43, b: 60 }
hexToRgb('abc');     // { r: 170, g: 187, b: 204 }
```

Accepts exactly 3 or 6 hexadecimal digits, case-insensitively, with an optional
leading `#`. Shorthand duplicates each digit. RGB channels are integers from
0 through 255. Whitespace, alpha channels, other lengths, invalid characters,
and non-string inputs throw `TypeError`.

## REST API

`GET /api/hex-to-rgb?hex=1a2b3c`

- `200 application/json`: `{"r":26,"g":43,"b":60}`
- `400 application/json` for invalid, empty, missing, or repeated `hex`:
  `{"error":"hex must be a 3- or 6-digit hexadecimal string with an optional #"}`
- Unknown routes and unsupported POST requests return Express's default `404`.

Encode `#` as `%23` when entering it in a request URL.
A raw `#` starts a URL fragment and is not sent to the server.

## Tests

The suite uses Node's built-in test runner and strict assertions:

- [Unit tests](./test/hex-to-rgb.test.js): 34 cases covering black and white,
  individual RGB channels, channel ordering, letter casing, shorthand, optional
  prefixes, malformed strings, whitespace, and non-string inputs.
- [Integration tests](./test/api.test.js): 16 cases exercising the real Express
  app over HTTP using `fetch`, asserting response status, JSON content type,
  and exact response bodies for valid and invalid inputs. Also checks unknown
  routes and unsupported methods. Tests start their own server on an available
  loopback port and close it afterward; no separately running server is needed.

Verified: **50 tests passed, 0 failed**. Coverage reports 100% lines, branches,
and functions for the converter; the Express app has 100% line/function coverage
and 75% branch coverage. Its unexpected-error rethrow path is not exercised.
The server startup entry point is not included in automated coverage.

## Live testing with Postman

1. Run `npm start` (or `npm.cmd start` in Windows PowerShell) and leave the server running.
2. Open the Postman desktop app and create an HTTP request.
3. Select **GET**, paste one of the URLs below, and click **Send**. No request
   body or authentication is required.
4. Check the response status and JSON body against the expected results.

### Valid hex value

Request URL: `http://localhost:3000/api/hex-to-rgb?hex=%231a2b3c`

Here `%23` represents the optional `#` prefix. Expected status: **200 OK**.

```json
{ "r": 26, "g": 43, "b": 60 }
```

### Invalid hex value

Request URL: `http://localhost:3000/api/hex-to-rgb?hex=invalid`

Expected status: **400 Bad Request**.

```json
{ "error": "hex must be a 3- or 6-digit hexadecimal string with an optional #" }
```

### Missing hex value

Request URL: `http://localhost:3000/api/hex-to-rgb`

Expected status: **400 Bad Request**, with the same error JSON as the invalid
value test. All three responses should have a `Content-Type` header containing
`application/json`.

These are instructions and expected results for manual Postman testing; a
Postman run has not been recorded for this project.
