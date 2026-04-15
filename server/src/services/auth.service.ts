import crypto from 'crypto';
import { User } from '../models/user.model';
import { PasswordResetToken } from '../models/passwordResetToken.model';
import ApiError from '../utils/ApiError';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.utils';
import { sendPasswordResetEmail } from '../utils/email.utils';
import config from '../config';
import { IUser } from '../types/user.types';

export const registerUser = async (userData: Partial<IUser>) => {
  if (await User.findOne({ email: userData.email } as any)) {
    throw new ApiError(400, 'User already exists');
  }
  const user = await User.create(userData as any);
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  return user;
};

export const generateAuthTokens = (user: IUser) => {
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyToken(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    const accessToken = generateAccessToken(user.id);
    return accessToken;
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found with that email');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await PasswordResetToken.deleteMany({ user: user._id });
  await PasswordResetToken.create({
    user: user._id,
    token: resetToken,
    expiresAt,
  });

  await sendPasswordResetEmail(user.email, resetToken);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const resetTokenDoc = await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!resetTokenDoc) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  const user = await User.findById(resetTokenDoc.user);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });
};
