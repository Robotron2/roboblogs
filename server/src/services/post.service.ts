import { Post, IPost } from '../models/post.model';
import { Like } from '../models/like.model';
import { Category } from '../models/category.model';
import { Comment } from '../models/comment.model';
import ApiError from '../utils/ApiError';
import mongoose from 'mongoose';

const calculateReadTime = (content: string): number => {
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};

export const createPost = async (postData: Partial<IPost>) => {
  const post = await Post.create(postData);
  return post;
};

export const updatePost = async (postId: string, updateData: Partial<IPost>) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  Object.assign(post, updateData);
  await post.save();
  return post;
};

export const deletePost = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // 1. Cascade Delete: Remove associated likes and comments
  await Promise.all([
    Like.deleteMany({ post: postId }),
    Comment.deleteMany({ post: postId })
  ]);

  // 2. Delete the post itself
  await post.deleteOne();
};

export const getAllPosts = async (query: any, currentUserId?: string, isAdmin: boolean = false) => {
  const { page = 1, limit = 10, search = '', category = '' } = query;
  
  const filter: any = {};

  if (!isAdmin) {
    filter.isPublished = true;
  }

  // 1. Category Filtering by Slug
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) {
      filter.categories = cat._id;
    } else {
      // If category requested but not found, return empty set
      return { posts: [], total: 0, page: Number(page), pages: 0 };
    }
  }

  // 2. Enhanced Search (Title, Content, Category Name)
  if (search) {
    // Find categories matching search
    const matchingCategories = await Category.find({ name: { $regex: search, $options: 'i' } });
    const catIds = matchingCategories.map(c => c._id);

    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { categories: { $in: catIds } }
    ];
  }

  const posts = await Post.find(filter)
    .populate('author', 'name email')
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const total = await Post.countDocuments(filter);

  // 3. Metadata enhancement (ReadTime, Likes)
  const enhancedPosts = await Promise.all(posts.map(async (doc: any) => {
    const post = doc as any;
    const likesCount = await Like.countDocuments({ post: post._id });
    let isLiked = false;
    if (currentUserId) {
      const like = await Like.findOne({ post: post._id, user: currentUserId });
      isLiked = !!like;
    }

    return {
      ...post,
      readTime: calculateReadTime(post.content),
      likesCount,
      isLiked
    };
  }));

  return {
    posts: enhancedPosts,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

export const getPostBySlug = async (slug: string, currentUserId?: string, isAdmin: boolean = false) => {
  const queryParts: any[] = [
    mongoose.isValidObjectId(slug) ? { _id: slug } : { slug }
  ];
  
  const postQuery = Post.findOne({ $or: queryParts });

  if (!isAdmin) {
    postQuery.where({ isPublished: true });
  }

  const post = await postQuery
    .populate('author', 'name email')
    .populate('categories', 'name slug')
    .lean();

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const likesCount = await Like.countDocuments({ post: post._id });
  let isLiked = false;
  if (currentUserId) {
    const like = await Like.findOne({ post: post._id, user: currentUserId });
    isLiked = !!like;
  }

  return {
    ...post,
    readTime: calculateReadTime(post.content),
    likesCount,
    isLiked
  };
};

export const unpublishPost = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  post.isPublished = false;
  await post.save();
  return post;
};

export const publishPost = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  post.isPublished = true;
  await post.save();
  return post;
};
