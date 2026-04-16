export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  author: User | string;
  categories: Category[];
  readTime: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  user: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  post: string;
  user: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PostPaginatedResponse {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CommentPaginatedResponse {
  comments: Comment[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
