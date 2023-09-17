import init from '@snapshot-labs/snapshot-metrics';
import { capture } from '@snapshot-labs/snapshot-sentry';
import type { Express } from 'express';

export default function initMetrics(app: Express) {
  init(app, {
    normalizedPath: [['^/.+', '/#subgraph']],
    whitelistedPath: [/^\/$/, /^\/.*$/],
    errorHandler: capture
  });
}
