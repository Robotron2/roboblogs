import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window`
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 auth requests per hour
  message: {
    success: false,
    message: 'Too many login/register attempts from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many newsletter subscription attempts from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
