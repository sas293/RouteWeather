import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routeRoutes from './routes/route.js';
import { errorHandler } from './middlewares/error.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { config } from './config/env.js';

dotenv.config();

const app = express();
const port = config.port
const clientUrl = config.clientUrl;

app.use(cors({
  origin: clientUrl,
  methods: ['GET', 'POST'],
}));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

app.use('/', (req, res, next) => {
  console.log('Request generated');
  next();
});

app.use('/route', routeRoutes);

app.get('/', (req, res) => {
  res.json({ name: 'RouteWeather API', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


// Error middleware MUST be after routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
