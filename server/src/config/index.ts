import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoose: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/roboblogs',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'accessSecret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
    accessExpiration: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
