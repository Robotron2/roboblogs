import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BlogCard from '../../components/BlogCard';
import BlogGrid from '../../components/BlogGrid';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { postsApi } from '../../api/posts.api';
import { categoriesApi } from '../../api/categories.api';
import type { Post, Category } from '../../types';

export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postsApi.getAll({
          page,
          limit: 9,
          search: searchQuery,
          category: currentCategory,
        });
        const data = res.data.data;
        setPosts(data.posts);
        setTotalPages(Math.ceil(data.total / data.limit));
      } catch {
        toast.error('Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, currentCategory, searchQuery]);

  // Debounced search sync
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        const newParams = new URLSearchParams(searchParams);
        if (localSearch) {
          newParams.set('search', localSearch);
        } else {
          newParams.delete('search');
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, searchParams, setSearchParams]);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === currentCategory) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', p.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Explore Articles
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover deep dives into robotics, artificial intelligence, and the future of human-machine interaction curated by the RoboBlogs editorial team.
        </p>
      </header>

      {/* Search and Filters */}
      <div className="mb-12 space-y-8">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <input
            type="text"
            placeholder="Search articles, topics, or authors..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-6 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 dark:text-white"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              currentCategory === ''
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-800'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                currentCategory === cat.slug
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : posts.length > 0 ? (
        <>
          <BlogGrid columns={3}>
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </BlogGrid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 py-12 border-t border-gray-50 dark:border-gray-800">
               <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        <div className="py-24">
          <EmptyState
            title={searchQuery ? 'No results found' : 'No articles yet'}
            description={
              searchQuery
                ? `We couldn't find any articles matching "${searchQuery}". Try a different term or clear your filters.`
                : 'Our writers are busy preparing new content. Check back soon!'
            }
          />
        </div>
      )}
    </div>
  );
}
