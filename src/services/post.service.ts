import { Post, IPost } from '../models/post.model';
import ApiError from '../utils/ApiError';

export const createPost = async (postData: Partial<IPost>) => {
  const post = await Post.create(postData);
  return post;
};

export const updatePost = async (postId: string, updateData: Partial<IPost>) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Update fields
  Object.assign(post, updateData);
  
  // Save to trigger pre-save hook for slug if title changed
  await post.save();
  return post;
};

export const deletePost = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  await post.deleteOne();
};

export const getAllPosts = async (query: any) => {
  const { page = 1, limit = 10, search = '' } = query;
  
  const filter: any = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const posts = await Post.find(filter)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Post.countDocuments(filter);

  return {
    posts,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

export const getPostBySlug = async (slug: string) => {
  const post = await Post.findOne({ slug }).populate('author', 'name email');
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  return post;
};
