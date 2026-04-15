import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function Home() {
  const dummyPosts = [
    {
      id: 1,
      slug: 'vision-systems-seeing-the-world-in-4d',
      title: 'Vision Systems: Seeing the World in 4D',
      excerpt: 'New spatial computing algorithms allow service robots to predict obstacle movement with 99.8% accuracy in crowded environments.',
      category: 'DEEP LEARNING',
      image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      author: 'Sarah Jenkins',
      date: 'Nov 22, 2024'
    },
    {
      id: 2,
      slug: 'the-factory-of-2030',
      title: 'The Factory of 2030: No Lights Required',
      excerpt: 'Dark factories are no longer a myth. We tour the world\'s most advanced automated assembly plant where human presence is optional.',
      category: 'INDUSTRY 4.0',
      image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      author: 'Marcus Tonek',
      date: 'Nov 20, 2024'
    },
    {
       id: 3,
       slug: 'sidewalk-sovereignty',
       title: 'Sidewalk Sovereignty and Delivery Drones',
       excerpt: 'Local municipalities are racing to regulate the influx of autonomous delivery bots on city pedestrian pathways.',
       category: 'LAST MILE',
       image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
       author: 'Lila Chen',
       date: 'Nov 18, 2024'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          The Pulse of <span className="text-primary-600">Autonomous</span><br/> Innovation.
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Deep dives into robotics, artificial intelligence, and the automated systems
          shaping tomorrow's landscape. Curated by experts, designed for the curious.
        </p>
      </section>

      {/* Featured Post (Hero Layout) */}
      <section className="mb-16">
        <div className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="lg:col-span-8 h-64 sm:h-80 lg:h-[450px] overflow-hidden">
             <img 
               src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" 
               alt="Featured Post" 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
           </div>
           <div className="lg:col-span-4 p-8 lg:p-10 lg:pl-0 flex flex-col justify-center h-full">
              <span className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3 block">Featured • 10 Min Read</span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                 The Ethics of Collaborative Robotics in Modern Manufacturing
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-3">
                 As cobots move from isolated cages to side-by-side collaboration with humans, we investigate
                 the safety protocols and ethical frameworks required.
              </p>
              
              <div className="flex items-center gap-3 mt-auto">
                 <img src="https://i.pravatar.cc/150?img=11" alt="Julian" className="w-10 h-10 rounded-full" />
                 <div>
                   <p className="text-sm font-semibold text-gray-900 dark:text-white">By Dr. Julian Vane</p>
                   <p className="text-xs text-gray-500">Nov 24, 2024</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Grid Posts */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {dummyPosts.map((post) => (
            <Link key={post.id} to={`/article/${post.slug}`} className="group flex flex-col">
               <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden mb-5 border border-gray-100 dark:border-gray-800">
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               </div>
               <span className="text-[10px] font-bold tracking-widest text-primary-600 uppercase mb-2 block">{post.category}</span>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary-600 transition-colors">
                 {post.title}
               </h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                 {post.excerpt}
               </p>
               
               <div className="flex justify-between items-center text-xs text-gray-500 mt-2 font-medium">
                  <span className="text-gray-900 dark:text-gray-300">{post.author}</span>
                  <span>{post.date}</span>
               </div>
            </Link>
         ))}
      </section>

      <Pagination currentPage={1} totalPages={12} onPageChange={() => {}} />

      {/* Newsletter Block */}
      <section className="mt-24 mb-12 text-center max-w-lg mx-auto">
         <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Stay ahead of the curve.</h3>
         <p className="text-gray-500 dark:text-gray-400 mb-8">Get the week's most critical robotics news delivered to your inbox every Friday.</p>
         
         <form className="flex flex-col sm:flex-row gap-3">
            <Input type="email" placeholder="Enter your email" className="flex-1 rounded-full h-12" />
            <Button type="button" className="h-12 px-8 rounded-full">Subscribe</Button>
         </form>
      </section>

    </div>
  );
}
