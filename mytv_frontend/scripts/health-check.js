#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Minimal health check: requests /healthz on localhost using PORT or 3000.
 * Exits 0 on OK, non-zero otherwise. Useful for CI readiness probes.
 * ESM-compatible (package.json has "type":"module").
 */
import http from 'http';

const port = Number(process.env.PORT || 3000);
const options = {
  hostname: '127.0.0.1',
  port,
  path: '/healthz',
  timeout: 1500,
  method: 'GET',
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.stdout.write('OK\n');
    process.exit(0);
  } else {
    process.stderr.write(`bad status ${res.statusCode}\n`);
    process.exit(2);
  }
});
req.on('error', (err) => {
  process.stderr.write(`not ready: ${err && err.message}\n`);
  process.exit(3);
});
req.end();
