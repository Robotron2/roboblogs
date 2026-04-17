import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, Edit2, Trash2, Eye, EyeOff, ExternalLink, Book } from 'lucide-react';
import toast from 'react-hot-toast';
import { postsApi } from '../../api/posts.api';
import { categoriesApi } from '../../api/categories.api';
import type { Post, Category } from '../../types';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function Library() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [postToUnpublish, setPostToUnpublish] = useState<Post | null>(null);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  
  const [postToPublish, setPostToPublish] = useState<Post | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postsApi.getAll({ 
          page, 
          limit: 15, 
          search: search || undefined, 
          category: selectedCategory || undefined,
          status: 'all'
        });
        const data = res.data.data;
        setPosts(data.posts);
        setTotalPages(Math.max(1, Math.ceil((data.total || 0) / (data.limit || 15))));
      } catch {
        toast.error('Failed to load library');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timeoutId);
  }, [page, search, selectedCategory]);

  const handleDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await postsApi.delete(postToDelete._id);
      toast.success('Article removed from library');
      setPosts(posts.filter(p => p._id !== postToDelete._id));
      setPostToDelete(null);
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!postToUnpublish) return;
    setIsUnpublishing(true);
    try {
      await postsApi.unpublish(postToUnpublish._id);
      toast.success('Article unpublished');
      setPosts(posts.map(p => p._id === postToUnpublish._id ? { ...p, isPublished: false } : p));
      setPostToUnpublish(null);
    } catch {
      toast.error('Failed to unpublish article');
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handlePublish = async () => {
    if (!postToPublish) return;
    setIsPublishing(true);
    try {
      await postsApi.publish(postToPublish._id);
      toast.success('Article published');
      setPosts(posts.map(p => p._id === postToPublish._id ? { ...p, isPublished: true } : p));
      setPostToPublish(null);
    } catch {
      toast.error('Failed to publish article');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Content Library</h1>
        <p className="text-body text-sm">Manage your entire catalog of stories and insights.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search stories by title or content..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              className="pl-10 pr-8 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm appearance-none cursor-pointer transition-all"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Link to="/admin/posts/new">
            <Button size="sm" className="rounded-xl h-full px-6">New Story</Button>
          </Link>
        </div>
      </div>

      {/* Library Grid/List */}
      {isLoading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <EmptyState 
          title="No stories found" 
          description={search || selectedCategory ? "Try adjusting your filters to find what you're looking for." : "Your library is empty. Start writing your first masterpiece!"}
          action={search || selectedCategory ? (
            <Button variant="ghost" onClick={() => { setSearch(''); setSelectedCategory(''); }}>Clear Filters</Button>
          ) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Book className="w-6 h-6" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {post.isPublished ? (
                    <span className="px-2 py-0.5 bg-green-50 dark:bg-green-500/10 text-[10px] font-bold text-success uppercase rounded-md tracking-wider">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase rounded-md tracking-wider">Unpublished</span>
                  )}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {post.readTime} min read</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1">{post.title}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-1">
                    {post.categories?.slice(0, 2).map((cat: any) => (
                      <span key={typeof cat === 'string' ? cat : cat._id} className="text-[10px] text-primary font-medium">#{typeof cat === 'string' ? cat : cat.name}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to={`/article/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" title="View article">
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link to={`/admin/posts/${post._id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" title="Edit article">
                  <Edit2 className="w-4 h-4" />
                </Link>
                {post.isPublished ? (
                  <button 
                    onClick={() => setPostToUnpublish(post)}
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg"
                    title="Unpublish"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setPostToPublish(post)}
                    className="p-2 text-gray-400 hover:text-green-500 transition-colors hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg"
                    title="Publish"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => setPostToDelete(post)}
                  className="p-2 text-gray-400 hover:text-error transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        title="Delete Article"
        width="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-error">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold mb-2">Confirm Deletion</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Are you sure you want to remove <span className="font-semibold text-gray-900 dark:text-gray-100">"{postToDelete?.title}"</span>? This action is permanent.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-lg" onClick={() => setPostToDelete(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1 rounded-lg" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* Unpublish Confirmation Modal */}
      <Modal
        isOpen={!!postToUnpublish}
        onClose={() => setPostToUnpublish(null)}
        title="Unpublish Article"
        width="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
            <EyeOff className="w-8 h-8" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold mb-2">Confirm Unpublish</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Are you sure you want to unpublish <span className="font-semibold text-gray-900 dark:text-gray-100">"{postToUnpublish?.title}"</span>? This will hide it from the public feed.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-lg" onClick={() => setPostToUnpublish(null)}>Cancel</Button>
            <Button className="flex-1 rounded-lg bg-orange-500 text-white hover:bg-orange-600" onClick={handleUnpublish} isLoading={isUnpublishing}>Unpublish</Button>
          </div>
        </div>
      </Modal>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={!!postToPublish}
        onClose={() => setPostToPublish(null)}
        title="Publish Article"
        width="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
            <Eye className="w-8 h-8" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold mb-2">Confirm Publish</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Are you sure you want to publish <span className="font-semibold text-gray-900 dark:text-gray-100">"{postToPublish?.title}"</span>? This will make it visible to the public.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-lg" onClick={() => setPostToPublish(null)}>Cancel</Button>
            <Button className="flex-1 rounded-lg bg-success text-white hover:bg-green-600" onClick={handlePublish} isLoading={isPublishing}>Publish</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
