/**
 * @file app.js
 * Defines the Express API route for converting hex colours to RGB.
 */
import express from 'express';
import { hexToRgb } from './hex-to-rgb.js';

export const app = express();

app.get('/api/hex-to-rgb', (req, res) => {
  try {
    res.json(hexToRgb(req.query.hex));
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    res.status(400).json({ error: error.message });
  }
});
