import express from 'express';
import cors from 'cors';
import routeRoutes from './routes/route.js';
import { errorHandler } from './middlewares/error.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { config } from './config/env.js';

const app = express();
const port = config.port
const clientUrl = config.clientUrl;

app.use(cors({
  origin: clientUrl,
  methods: ['GET', 'POST'],
}));
app.use(express.json());
app.use(generalLimiter);

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
