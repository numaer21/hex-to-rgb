/**
 * @file hex-to-rgb.js
 * Provides hexadecimal colour conversion to RGB.
 */

/**
 * Converts a 3- or 6-digit hex string, with an optional #, to RGB.
 * @param {string} hex - Hex colour, such as "#abc" or "123456".
 * @returns {{r: number, g: number, b: number}} RGB components from 0 to 255.
 * @throws {TypeError} If the input type or colour format is invalid.
 */
export function hexToRgb(hex) {
  if (typeof hex !== 'string' || !/^#?(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex)) {
    throw new TypeError('hex must be a 3- or 6-digit hexadecimal string with an optional #');
  }

  let digits = hex.replace(/^#/, '');
  if (digits.length === 3) {
    digits = [...digits].map((digit) => digit + digit).join('');
  }

  return {
    r: Number.parseInt(digits.slice(0, 2), 16),
    g: Number.parseInt(digits.slice(2, 4), 16),
    b: Number.parseInt(digits.slice(4, 6), 16),
  };
}
