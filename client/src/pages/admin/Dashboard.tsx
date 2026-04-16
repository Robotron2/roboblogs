import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../../components/Card';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { postsApi } from '../../api/posts.api';
import type { Post } from '../../types';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postsApi.getAll({ page, limit: 10 });
        const data = res.data.data;
        setPosts(data.posts);
        setTotalPages(Math.ceil(data.total / data.limit));
      } catch {
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const confirmDelete = (post: Post) => {
    setPostToDelete(post);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await postsApi.delete(postToDelete._id);
      toast.success('Article deleted');
      setPosts(posts.filter(p => p._id !== postToDelete._id));
      setPostToDelete(null);
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-body">Manage your articles and content.</p>
        </div>
        <Link to="/admin/posts/new" className="hidden sm:block">
          <button className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors">
            Write an article
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent>
            <p className="text-sm font-medium text-body mb-1">Total Views</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
            <span className="text-xs font-semibold text-success mt-2 block">Analytics coming soon</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-medium text-body mb-1">Published Articles</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-medium text-body mb-1">Total Subscribers</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
            <span className="text-xs font-semibold text-body mt-2 block">Coming soon</span>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Recent Articles</h2>

        {isLoading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Start writing your first article to see it here."
            action={
              <Link to="/admin/posts/new">
                <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors">
                  Write an article
                </button>
              </Link>
            }
          />
        ) : (
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                   <th className="px-6 py-4">Title</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-center">Likes</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-success text-xs font-semibold rounded-full">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-primary">
                      {post.likesCount}
                    </td>
                    <td className="px-6 py-4 text-body">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right flex gap-3 justify-end">
                      <Link to={`/admin/posts/${post._id}/edit`} className="text-primary hover:text-primary-700 font-bold transition-colors text-xs uppercase tracking-wider">Edit</Link>
                      <button 
                         onClick={() => confirmDelete(post)}
                         className="text-error hover:text-red-700 font-bold transition-colors text-xs uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        title="Delete Article"
        width="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-error">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-bold mb-2">Are you absolutely sure?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            This will permanently delete <span className="font-semibold text-gray-900 dark:text-gray-100">"{postToDelete?.title}"</span>. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1 rounded-full" 
              onClick={() => setPostToDelete(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="flex-1 rounded-full" 
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
