import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { postsApi } from '../../api/posts.api';
import { categoriesApi } from '../../api/categories.api';
import type { Post as PostType, Category } from '../../types';
import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Categories on mount
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

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postsApi.getAll({ 
          page, 
          limit: 7, 
          search: searchQuery, 
          category: currentCategory 
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
  }, [page, currentCategory, searchQuery]);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const setPage = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', p.toString());
    setSearchParams(newParams);
  };

  if (isLoading) return <div className="py-20"><Loader size="lg" /></div>;
  if (posts.length === 0) return (
    <div className="py-20">
      <EmptyState 
        title="No articles yet" 
        description="Our writers are busy preparing new content. Check back soon!" 
      />
    </div>
  );

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="mb-12 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
          The Pulse of <span className="italic text-primary">Autonomous</span>
          <br />Innovation.
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
          Deep dives into robotics, artificial intelligence, and the automated systems
          shaping tomorrow's landscape. Curated by experts, designed for the curious.
        </p>
      </section>

      {/* Categories Filter */}
      <section className="mb-12 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max pb-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${
              currentCategory === ''
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${
                currentCategory === cat.slug
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !searchQuery && !currentCategory && (
        <section className="mb-12">
          <Link to={`/article/${featuredPost.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="lg:col-span-7 h-64 sm:h-72 lg:h-[400px] overflow-hidden">
                <img 
                  src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  {featuredPost.categories?.length > 0 ? (
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                      {featuredPost.categories[0].name}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                      FEATURED
                    </span>
                  )}
                  <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                    {featuredPost.readTime} Min Read
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <div 
                  className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: featuredPost.content.substring(0, 160) + '...' }}
                />
                <div className="flex flex-wrap gap-4 items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {typeof featuredPost.author === 'object' ? featuredPost.author.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      By {typeof featuredPost.author === 'object' ? featuredPost.author.name : 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                   {featuredPost.likesCount} Likes
                </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Post Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {(featuredPost && (searchQuery || currentCategory) ? [featuredPost, ...gridPosts] : gridPosts).map((post) => (
          <Link key={post._id} to={`/article/${post.slug}`} className="group flex flex-col">
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-800 relative">
              <img 
                src={post.coverImage || 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=400&q=80'} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-bold text-gray-900 dark:text-white shadow-sm uppercase tracking-tight">
                  {post.readTime} min read
                </span>
              </div>
            </div>
            <div className="flex gap-2 mb-2 flex-wrap">
              {post.categories?.length > 0 ? (
                post.categories.map(cat => (
                  <span key={cat._id} className="text-[9px] font-bold tracking-widest text-primary uppercase px-1.5 py-0.5 bg-primary/5 rounded">
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                  UNTAGGED
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <div 
              className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }}
            />
            <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {typeof post.author === 'object' ? post.author.name : 'Unknown'}
                </span>
                <span className="text-[10px]">•</span>
                <span>
                  {post.likesCount} likes
                </span>
              </div>
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Newsletter */}
      <section className="mt-20 mb-8 p-10 bg-gray-50 dark:bg-surface-dark rounded-3xl text-center max-w-3xl mx-auto border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Stay ahead of the curve.</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Get the week's most critical robotics news delivered to your inbox every Friday.</p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 h-11 rounded-full border border-gray-200 bg-white px-5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
          />
          <Button type="button" size="md" className="rounded-full px-8">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
