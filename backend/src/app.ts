import dotenv from 'dotenv';
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

dotenv.config();

export const app = express();
const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(apiPrefix, rateLimit);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/map`, mapRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/search`, searchRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);
app.use(`${apiPrefix}/engagement`, engagementRoutes);

if (process.env.KCUBE_SERVE_FRONTEND !== 'true') {
  app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'k-cube-backend', health: `${apiPrefix}/health` });
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'k-cube-backend' });
});

app.get(`${apiPrefix}/health`, (req, res) => {
  res.json({ status: 'ok', service: 'k-cube-backend' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`K-CUBE backend running on http://localhost:${port}${apiPrefix}`);
  });
}

export default app;
