import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import type { Post } from '../types';

interface BlogCardProps {
  post: Post;
  variant?: 'large' | 'small' | 'minimal';
}

export default function BlogCard({ post, variant = 'small' }: BlogCardProps) {
  const authorName = typeof post.author === 'object' ? post.author.name : 'Unknown';
  const publishDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (variant === 'large') {
    return (
      <Link to={`/article/${post.slug}`} className="group block mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:border-gray-200 dark:hover:border-gray-700">
          <div className="lg:col-span-7 h-64 sm:h-72 lg:h-[450px] overflow-hidden">
            <LazyImage
              src={post.coverImage || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              wrapperClassName="w-full h-full"
            />
          </div>
          <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              {post.categories?.length > 0 && (
                <span className="text-[10px] font-bold tracking-[0.1em] text-primary uppercase bg-primary/5 px-2.5 py-1 rounded">
                  {post.categories[0].name}
                </span>
              )}
              <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                {post.readTime} Min Read
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <div
              className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.content.substring(0, 180) + '...' }}
            />
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                   {authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {authorName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {publishDate}
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {post.likesCount} Likes
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link to={`/article/${post.slug}`} className="group block py-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex gap-2 mb-2">
            {post.categories?.length > 0 && (
                <span className="text-[9px] font-bold tracking-widest text-primary uppercase">
                    {post.categories[0].name}
                </span>
            )}
            <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                {publishDate}
            </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h3>
      </Link>
    );
  }

  return (
    <Link to={`/article/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:border-gray-200 dark:hover:border-gray-700">
      <div className="w-full h-52 overflow-hidden relative">
        <LazyImage
          src={post.coverImage || 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=600&q=80'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          wrapperClassName="w-full h-full"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-gray-900 dark:text-white shadow-sm uppercase tracking-tight">
            {post.readTime} min read
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.categories?.length > 0 ? (
            post.categories.map((cat) => (
              <span
                key={cat._id}
                className="text-[10px] font-bold tracking-widest text-primary uppercase px-2 py-0.5 bg-primary/5 rounded"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              GENERAL
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div
          className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content.substring(0, 120) + '...' }}
        />
        <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">By {authorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{publishDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
