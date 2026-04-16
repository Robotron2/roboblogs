import { Comment, IComment } from '../models/comment.model';
import ApiError from '../utils/ApiError';

export const addComment = async (commentData: Partial<IComment>) => {
  const comment = await Comment.create(commentData);
  return comment;
};

export const getPostComments = async (postId: string, query: any) => {
  const { page = 1, limit = 10 } = query;

  const comments = await Comment.find({ post: postId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Comment.countDocuments({ post: postId });

  return {
    comments,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

export const getAllComments = async (query: any) => {
  const { page = 1, limit = 10 } = query;

  const comments = await Comment.find()
    .populate('user', 'name')
    .populate('post', 'title slug')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Comment.countDocuments();

  return {
    comments,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

export const deleteComment = async (commentId: string, userId: string, role: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  // Check ownership or admin
  if (comment.user.toString() !== userId && role !== 'admin') {
    throw new ApiError(403, 'User not authorized to delete this comment');
  }

  await comment.deleteOne();
};
