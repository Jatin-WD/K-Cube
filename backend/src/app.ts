import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import mapRoutes from './routes/map';
import analyticsRoutes from './routes/analytics';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';
import engagementRoutes from './routes/engagement';
import eventRoutes from './routes/events';
import integrationRoutes from './routes/integrations';
import { API_PREFIX, KCUBE_SERVE_FRONTEND } from './config';

export const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(API_PREFIX, rateLimit);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/map`, mapRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/engagement`, engagementRoutes);
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/integrations`, integrationRoutes);

if (KCUBE_SERVE_FRONTEND !== 'true') {
  app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'k-cube-backend', health: `${API_PREFIX}/health` });
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'k-cube-backend' });
});

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok', service: 'k-cube-backend' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: { code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal Server Error' } });
});

import { PORT } from './config';

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`K-CUBE backend running on http://localhost:${PORT}${API_PREFIX}`);
  });
}

export default app;
