import jwt from 'jsonwebtoken';
import config from '../config';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiration as any,
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiration as any,
  });
};

export const verifyToken = (token: string, secret: string): any => {
  return jwt.verify(token, secret);
};
