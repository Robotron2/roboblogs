import { User } from '../models/user.model';
import ApiError from '../utils/ApiError';

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
