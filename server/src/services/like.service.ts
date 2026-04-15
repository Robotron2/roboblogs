import { Like } from '../models/like.model';
import ApiError from '../utils/ApiError';

export const likePost = async (postId: string, userId: string) => {
  const existingLike = await Like.findOne({ post: postId, user: userId });
  if (existingLike) {
    throw new ApiError(400, 'You have already liked this post');
  }
  const like = await Like.create({ post: postId, user: userId });
  return like;
};

export const unlikePost = async (postId: string, userId: string) => {
  const like = await Like.findOne({ post: postId, user: userId });
  if (!like) {
    throw new ApiError(404, 'Like not found');
  }
  await like.deleteOne();
};
