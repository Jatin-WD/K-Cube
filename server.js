const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.API_PREFIX = process.env.API_PREFIX || '/api/v1';
process.env.KCUBE_SERVE_FRONTEND = process.env.KCUBE_SERVE_FRONTEND || 'true';

const next = require('next');
const backendModule = require('./backend/dist/app.js');
const app = backendModule.default || backendModule.app;

const frontendDir = path.join(__dirname, 'frontend');
const nextApp = next({ dev: false, dir: frontendDir });
const handle = nextApp.getRequestHandler();
const port = Number(process.env.PORT || 4000);

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

nextApp.prepare().then(() => {
  app.all(/.*/, (req, res) => handle(req, res));

  app.listen(port, () => {
    console.log(`K-CUBE single-domain app running on port ${port}`);
    console.log(`Frontend: /`);
    console.log(`API: ${process.env.API_PREFIX}`);
  });
}).catch((error) => {
  console.error('Failed to start K-CUBE app:', error);
  process.exit(1);
});
