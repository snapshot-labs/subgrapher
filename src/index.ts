import 'dotenv/config';
import { fallbackLogger, initLogger } from '@snapshot-labs/snapshot-sentry';
import cors from 'cors';
import express from 'express';
import api from './api';
import initMetrics from './helpers/metrics';

const app = express();
const PORT = process.env.PORT || 3000;

initLogger(app);
initMetrics(app);

app.disable('x-powered-by');
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: false }));
app.use(cors({ maxAge: 86400 }));
app.use('/', api);

fallbackLogger(app);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
