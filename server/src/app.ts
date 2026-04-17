import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config';
import { globalLimiter } from './middlewares/rateLimiter.middleware';
import { errorConverter, errorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://192.168.43.166:5173',
].filter(Boolean) as string[];

app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(ao => origin.startsWith(ao))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Morgan logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Global rate limiter
app.use(globalLimiter);

// Home / health check route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'RoboBlogs API is actively running!' });
});

// API routes
app.use('/api/v1', routes);

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  const error = new Error('Not found');
  (error as any).statusCode = 404;
  next(error);
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Global error handler
app.use(errorHandler);

export default app;
