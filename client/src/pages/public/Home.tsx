import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';

export default function Home() {
  const featuredPost = {
    slug: 'ethics-of-collaborative-robotics',
    title: 'The Ethics of Collaborative Robotics in Modern Manufacturing',
    excerpt: 'As cobots move from isolated cages to side-by-side collaboration with humans, we investigate the safety protocols and ethical frameworks required.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    author: 'Dr. Julian Vane',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    date: 'Nov 24, 2024',
    category: 'FEATURED',
    readTime: '10 Min Read',
  };

  const posts = [
    {
      id: 1,
      slug: 'vision-systems-seeing-the-world-in-4d',
      title: 'Vision Systems: Seeing the World in 4D',
      excerpt: 'New spatial computing algorithms allow service robots to predict obstacle movement with 99.8% accuracy in crowded environments.',
      category: 'DEEP LEARNING',
      categoryColor: 'text-purple-600',
      image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=400&q=80',
      author: 'Sarah Jenkins',
      date: 'Nov 22, 2024',
    },
    {
      id: 2,
      slug: 'the-factory-of-2030',
      title: 'The Factory of 2030: No Lights Required',
      excerpt: 'Dark factories are no longer a myth. We tour the world\'s most advanced automated assembly plant where human presence is optional.',
      category: 'INDUSTRY 4.0',
      categoryColor: 'text-amber-600',
      image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=400&q=80',
      author: 'Marcus Tonek',
      date: 'Nov 20, 2024',
    },
    {
      id: 3,
      slug: 'sidewalk-sovereignty',
      title: 'Sidewalk Sovereignty and Delivery Drones',
      excerpt: 'Local municipalities are racing to regulate the influx of autonomous delivery bots on city pedestrian pathways.',
      category: 'LAST MILE',
      categoryColor: 'text-teal-600',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80',
      author: 'Lila Chen',
      date: 'Nov 18, 2024',
    },
    {
      id: 4,
      slug: 'beyond-silicon-neuromorphic',
      title: 'Beyond Silicon: Neuromorphic Computing',
      excerpt: 'Computing chips that mimic brain neuron combinations could make robots far more energy-efficient than modern alternatives.',
      category: 'HARDWARE',
      categoryColor: 'text-rose-600',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
      author: 'Alex Praxis',
      date: 'Nov 15, 2024',
    },
    {
      id: 5,
      slug: 'hardening-the-bot',
      title: 'Hardening the Bot: Securing Edge Devices',
      excerpt: 'From supply-chain attacks to edge-tier hardware surface attacks - how to keep robot endpoints safe and flashing.',
      category: 'CYBERSECURITY',
      categoryColor: 'text-red-600',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
      author: 'Akemi Nara',
      date: 'Nov 12, 2024',
    },
    {
      id: 6,
      slug: 'the-curriculum-of-automation',
      title: 'The Curriculum of Automation',
      excerpt: 'Education institutions globally are evolving and restructuring core curricula to prepare students for an automated workforce.',
      category: 'EDUCATION',
      categoryColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1531746790095-e5474e8ef45a?w=400&q=80',
      author: 'David Norris',
      date: 'Nov 10, 2024',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="mb-12 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
          The Pulse of <span className="italic text-primary-600">Autonomous</span>
          <br />Innovation.
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
          Deep dives into robotics, artificial intelligence, and the automated systems
          shaping tomorrow's landscape. Curated by experts, designed for the curious.
        </p>
      </section>

      {/* Featured Post */}
      <section className="mb-12">
        <Link to={`/article/${featuredPost.slug}`} className="group block">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="lg:col-span-7 h-64 sm:h-72 lg:h-[400px] overflow-hidden">
              <img 
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4 block">
                {featuredPost.category} &bull; {featuredPost.readTime}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary-600 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">By {featuredPost.author}</p>
                  <p className="text-xs text-gray-400">{featuredPost.date}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Post Grid - First Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {posts.slice(0, 3).map((post) => (
          <Link key={post.id} to={`/article/${post.slug}`} className="group flex flex-col">
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-800">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <span className={`text-[10px] font-bold tracking-widest uppercase mb-2 block ${post.categoryColor}`}>
              {post.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{post.author}</span>
              <span>{post.date}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Post Grid - Second Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(3, 6).map((post) => (
          <Link key={post.id} to={`/article/${post.slug}`} className="group flex flex-col">
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-800">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <span className={`text-[10px] font-bold tracking-widest uppercase mb-2 block ${post.categoryColor}`}>
              {post.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{post.author}</span>
              <span>{post.date}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Pagination */}
      <Pagination currentPage={1} totalPages={12} onPageChange={() => {}} />

      {/* Newsletter */}
      <section className="mt-20 mb-8 text-center max-w-lg mx-auto">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Stay ahead of the curve.</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Get the week's most critical robotics news delivered to your inbox every Friday.</p>
        
        <form className="flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
          />
          <Button type="button" size="md">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
