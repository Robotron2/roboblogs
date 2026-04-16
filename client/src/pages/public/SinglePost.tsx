import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageSquare, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../api/posts.api';
import { commentsApi } from '../../api/comments.api';
import { likesApi } from '../../api/likes.api';
import { commentSchema } from '../../utils/schemas';
import type { Post, Comment, User } from '../../types';
import type { CommentFormData } from '../../utils/schemas';

export default function SinglePost() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user: currentUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const postRes = await postsApi.getBySlug(slug);
        const postData = postRes.data.data;
        setPost(postData);
        setIsLiked(postData.isLiked);
        setLikeCount(postData.likesCount);
        
        // Fetch comments
        const commentsRes = await commentsApi.getByPost(postData._id);
        const commentsData = commentsRes.data.data;
        setComments(Array.isArray(commentsData) ? commentsData : (commentsData as any).comments || []);
      } catch (err: any) {
        if (err.response?.status === 404) {
          toast.error('Article not found');
        } else {
          toast.error('Failed to load article');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const onCommentSubmit = async (data: CommentFormData) => {
    if (!post) return;
    try {
      const res = await commentsApi.create({ post: post._id, content: data.content });
      setComments([res.data.data, ...comments]);
      reset();
      toast.success('Comment posted');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like articles');
      return;
    }
    if (!post) return;

    // Optimistic Update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    
    setIsLiked(!previousIsLiked);
    setLikeCount(prev => previousIsLiked ? prev - 1 : prev + 1);

    try {
      if (previousIsLiked) {
        await likesApi.unlike(post._id);
      } else {
        await likesApi.like(post._id);
      }
    } catch {
      // Revert on failure
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error('Failed to update like status');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) return <div className="py-20"><Loader size="lg" /></div>;
  if (!post) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
      <Link to="/" className="text-primary font-medium hover:underline">Return to home</Link>
    </div>
  );

  const author = typeof post.author === 'object' ? (post.author as User) : null;

  return (
    <article className="w-full max-w-3xl mx-auto pb-16">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-gray-900 dark:hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to articles
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {post.categories?.length > 0 ? (
            post.categories.map(cat => (
              <span key={cat._id} className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded">
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded">
              UNTAGGED
            </span>
          )}
          <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
            {post.readTime} min read
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {author?.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{author?.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full transition-all text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Copy Link"
            >
              <LinkIcon className="w-4 h-4" /> Share
            </button>
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full transition-all ${
                isLiked 
                  ? 'text-white bg-error shadow-md shadow-error/20' 
                  : 'text-error hover:bg-red-50 dark:hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {likeCount}
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <figure className="mb-12 w-full overflow-hidden rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
          <img 
            src={post.coverImage}
            alt={post.title} 
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </figure>
      )}

      {/* Article Body */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-serif"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="border-gray-100 dark:border-gray-800 my-16" />

      {/* Comments Section */}
      <section id="comments">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmit(onCommentSubmit)} className="mb-12">
            <div className="p-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[120px] text-gray-800 dark:text-gray-200 resize-none"
                {...register('content')}
              />
              <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 font-medium px-2">Signed in as {currentUser?.name}</p>
                <Button type="submit" size="sm" className="rounded-full px-6" isLoading={isSubmitting}>
                  Post Comment
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-surface-dark/50 border border-gray-100 dark:border-gray-800 rounded-2xl mb-12 text-center">
            <MessageSquare className="w-8 h-8 text-gray-300 mb-4" />
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Join the conversation</p>
            <p className="text-xs text-body mb-6 max-w-[240px]">Sign in to RoboBlogs to share your thoughts and interact with our community.</p>
            <div className="flex gap-4">
              <Link to="/login"><Button size="sm" variant="outline" className="rounded-full px-6">Login</Button></Link>
              <Link to="/register"><Button size="sm" className="rounded-full px-6">Sign Up</Button></Link>
            </div>
          </div>
        )}

        {/* Comment List */}
        <div className="space-y-10">
          {comments.map((comment) => {
            const commenter = typeof comment.user === 'object' ? (comment.user as User) : null;
            return (
              <div key={comment._id} className="flex gap-5 group">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                  {commenter?.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{commenter?.name || 'Anonymous'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-5">
                    <button className="text-[11px] font-bold text-gray-400 hover:text-error transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                      <Heart className="w-3 h-3" /> Like
                    </button>
                    <button className="text-[11px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
