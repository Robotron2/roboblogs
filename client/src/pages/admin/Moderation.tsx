import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, User, Book, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { commentsApi } from '../../api/comments.api';
import type { Comment } from '../../types';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function Moderation() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await commentsApi.getAll({ page, limit: 15 });
      const data = res.data.data;
      setComments(data.comments);
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / (data.limit || 15))));
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page]);

  const handleDelete = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      await commentsApi.delete(commentToDelete._id);
      toast.success('Comment removed');
      setComments(comments.filter(c => c._id !== commentToDelete._id));
      setCommentToDelete(null);
    } catch {
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Global Moderation</h1>
        <p className="text-body text-sm">Monitor and manage user feedback across all articles.</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <EmptyState 
          icon={<MessageSquare className="h-8 w-8" />}
          title="No comments to moderate" 
          description="Everything looks clean! There are no comments across any posts at the moment."
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
             <div 
              key={comment._id} 
              className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Meta Info */}
                <div className="w-full md:w-64 shrink-0 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {comment.user && typeof comment.user === 'object' ? comment.user.name : 'Unknown User'}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reader</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm pt-3 border-t border-gray-50 dark:border-gray-800/50">
                    <Book className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">On Article</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300 text-xs line-clamp-2">
                        {comment.post && typeof comment.post === 'object' ? (comment.post as any).title : 'Post unavailable'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         {new Date(comment.createdAt).toLocaleString()}
                       </p>
                       <div className="flex gap-2">
                         {comment.post && typeof comment.post === 'object' && (comment.post as any).slug && (
                           <a 
                             href={`/article/${(comment.post as any).slug}`} 
                             target="_blank" 
                             className="p-1.5 text-gray-400 hover:text-primary transition-colors text-xs flex items-center gap-1"
                           >
                              View <ExternalLink className="w-3 h-3" />
                           </a>
                         )}
                         <button 
                           onClick={() => setCommentToDelete(comment)}
                           className="p-1.5 text-gray-400 hover:text-error transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                      "{comment.content}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title="Delete Comment"
        width="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-error">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold mb-2">Remove Comment</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Are you sure you want to delete this comment? This action will permanently remove it from the article.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => setCommentToDelete(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1 rounded-full" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
