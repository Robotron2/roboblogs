import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BlogCard from '../../components/BlogCard';
import BlogGrid from '../../components/BlogGrid';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { postsApi } from '../../api/posts.api';
import { newsletterApi } from '../../api/newsletter.api';
import type { Post as PostType } from '../../types';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchHomeContent = async () => {
      setIsLoading(true);
      try {
        const res = await postsApi.getAll({ 
          page: 1, 
          limit: 7 
        });
        setPosts(res.data.data.posts);
      } catch {
        toast.error('Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeContent();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    try {
      const res = await newsletterApi.subscribe(email);
      toast.success(res.data.message || 'Successfully subscribed!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) return <div className="py-24"><Loader size="lg" /></div>;
  if (posts.length === 0) return (
    <div className="py-24">
      <EmptyState 
        title="No articles yet" 
        description="Our writers are busy preparing new content. Check back soon!" 
      />
    </div>
  );

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);
  const tertiaryPosts = posts.slice(4, 7);

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="mb-16 pt-8 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6">
          The Pulse of <span className="text-primary italic">Autonomous</span>
          <br />Innovation.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Deep dives into robotics, artificial intelligence, and the automated systems
          shaping tomorrow's landscape. Curated by experts, designed for the curious.
        </p>
      </section>

      {/* Featured Section */}
      <section className="mb-20">
        <BlogCard post={featuredPost} variant="large" />
      </section>

      {/* Secondary Grid Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                Latest Insights
            </h2>
            <Link to="/blogs" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2">
                See all articles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
        <BlogGrid columns={3}>
          {secondaryPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </BlogGrid>
      </section>

      {/* Tertiary Section / More News */}
      {tertiaryPosts.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Deep Dives</h2>
                <div className="space-y-0">
                    {tertiaryPosts.map(post => (
                        <BlogCard key={post._id} post={post} variant="minimal" />
                    ))}
                </div>
                <div className="pt-8">
                     <Link to="/blogs">
                        <Button variant="outline" className="w-full sm:w-auto px-10 rounded-full">
                            Explore All Topics
                        </Button>
                     </Link>
                </div>
            </div>
            
            {/* Newsletter Side Panel */}
            <div className="bg-gray-50 dark:bg-surface-dark rounded-3xl p-10 flex flex-col justify-center border border-gray-100 dark:border-gray-800 self-start lg:sticky lg:top-24">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Stay ahead of the curve.</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    Get the week's most critical robotics news delivered directly to your inbox every Friday.
                </p>
                <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubscribing}
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50" 
                    />
                    <Button type="submit" size="md" className="rounded-xl w-full" isLoading={isSubscribing}>
                        Subscribe Now
                    </Button>
                </form>
                <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                    No spam. Just knowledge.
                </p>
            </div>
        </section>
      )}

      {/* Global CTA Section */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Ready to explore further?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Our library covers everything from soft robotics to autonomous systems and ethical AI frameworks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/blogs">
                <Button size="lg" className="px-10 rounded-full text-base">
                    Discover the Library
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="px-10 rounded-full text-base">
                    Join the Community
                </Button>
              </Link>
          </div>
      </section>
    </div>
  );
}
