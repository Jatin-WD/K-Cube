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
import learningRoutes from './routes/learning';
import engagementRoutes from './routes/engagement';
import eventRoutes from './routes/events';
import indiaPreSelectionRoutes from './routes/indiaPreSelection';
import integrationRoutes from './routes/integrations';
import shopRoutes from './routes/shop';
import paymentRoutes from './routes/payments';
import bootstrapDatabase from './db/bootstrap';
import { API_PREFIX, APP_URL, KCUBE_SERVE_FRONTEND, NODE_ENV } from './config';

export const app = express();

const normalizeOrigin = (value: string) => {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
};

const allowedOrigins = new Set(
  [
    APP_URL,
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map(normalizeOrigin),
);

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://plus.unsplash.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'data:'],
    },
  },
}));
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(normalizedOrigin) || NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(API_PREFIX, rateLimit);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/map`, mapRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/learning`, learningRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/engagement`, engagementRoutes);
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/india-pre-selection`, indiaPreSelectionRoutes);
app.use(`${API_PREFIX}/integrations`, integrationRoutes);
app.use(`${API_PREFIX}/shop`, shopRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);

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
  bootstrapDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`K-CUBE backend running on http://localhost:${PORT}${API_PREFIX}`);
      });
    })
    .catch((error) => {
      console.error('Database bootstrap failed:', error);
      process.exit(1);
    });
}

export default app;
