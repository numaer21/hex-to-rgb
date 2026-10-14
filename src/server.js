/**
 * @file server.js
 * Starts the Express server for local API requests.
 */
import { app } from './app.js';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Hex-to-RGB API listening on http://localhost:${port}`);
});
