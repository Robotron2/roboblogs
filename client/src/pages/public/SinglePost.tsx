import { Heart, Share2, Bookmark, MessageSquare } from 'lucide-react';
import Button from '../../components/Button';

export default function SinglePost() {
  return (
    <article className="w-full max-w-3xl mx-auto pb-16">
      
      {/* Header */}
      <header className="mb-8 pt-4">
        <span className="text-[10px] font-bold tracking-widest text-primary-600 uppercase mb-4 block bg-primary-50 dark:bg-primary-900/20 w-fit px-2 py-1 rounded">
          DEEP LEARNING <span className="text-gray-400 ml-2">• 8 min read</span>
        </span>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-8">
          The Cognitive Dawn: Why Large Language Models Are Just the Beginning
        </h1>

        <div className="flex items-center justify-between border-y border-gray-100 dark:border-gray-800 py-4">
          <div className="flex items-center gap-3">
             <img src="https://i.pravatar.cc/150?img=11" alt="Julian" className="w-12 h-12 rounded-full" />
             <div>
               <p className="text-sm font-bold text-gray-900 dark:text-white">Julian Vane</p>
               <p className="text-xs text-gray-500">Lead AI Researcher • Oct 24, 2024</p>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-full transition-colors">
              <Heart className="w-4 h-4 fill-current" /> 1.2k
            </button>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <figure className="mb-10 w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <img 
          src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" 
          alt="Cover" 
          className="w-full h-auto max-h-[450px] object-cover"
        />
      </figure>

      {/* Content Body */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p className="text-xl italic text-gray-600 dark:text-gray-400 font-serif leading-relaxed mb-8">
          As we stand at the precipice of a new era in computational intelligence, the rapid evolution
          of Large Language Models (LLMs) prompts us to re-evaluate what it means to "think."
        </p>

        <p>
          For decades, the goal of artificial intelligence was narrow. We built systems that could play chess
          better than grandmasters, or recognize faces in a crowd. But these were islands of competence in
          a sea of ignorance. Today, the islands are merging. The emergence of transformers has provided a
          unified architecture for processing the complexity of human language, code, and even biology.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4">The Architecture of Reasoning</h3>
        
        <p>
          Unlike the deterministic software of the past, modern LLMs operate on a probabilistic landscape.
          When you ask a question, the model isn't searching a database; it is navigating a high-dimensional
          space of relationships it learned during training.
        </p>

        <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-mono text-gray-800 dark:text-gray-300">
          This snippet reflects the foundational shift. We are moving from hard-coded logic to learned<br/>
          context. However, the true breakthrough isn't just in the scale of parameters, but in the<br/>
          <strong className="text-primary-600 dark:text-primary-400">reinforcement learning from human feedback (RLHF)</strong> that aligns these statistical giants with<br/>
          human values.
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Looking Forward</h3>
        
        <p>
          The next decade will likely be defined by "agentic workflows" — systems that don't just answer
          queries but execute multi-step tasks across different environments. This brings us closer to the
          vision of a digital collaborator that truly understands intent.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-10 mb-16">
        {['Artificial Intelligence', 'Future Tech', 'Transformers', 'Ethics'].map(tag => (
           <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold">
             {tag}
           </span>
        ))}
      </div>

      {/* Separator */}
      <hr className="border-gray-200 dark:border-gray-800 mb-12" />

      {/* Comments Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">Comments (24)</h3>

        {/* Join CTA */}
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl mb-10 text-center">
           <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-3" />
           <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Join the conversation</p>
           <p className="text-xs text-gray-500 mb-4">Please log in or register to share your thoughts on this article.</p>
           <div className="flex gap-3">
             <Button size="sm" className="rounded-full">Login</Button>
             <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-transparent">Sign Up</Button>
           </div>
        </div>

        {/* List of comments */}
        <div className="space-y-8">
           {[ 
             { name: 'Sarah Miller', time: '2 hours ago', text: 'This is a fantastic breakdown of where LLMs fit in the broader history of AI. The distinction between "islands of competence" and the unified architecture we see now is a great metaphor.', likes: 12 },
             { name: 'Marcus Chen', time: '5 hours ago', text: 'I\'m curious about the agentic workflow part. How do we ensure safety when LLMs start taking actions in the real world? That feels like the next big ethical hurdle.', likes: 5 }
           ].map((comment, i) => (
              <div key={i} className="flex gap-4">
                 <img src={`https://i.pravatar.cc/150?img=${i+5}`} alt={comment.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.name}</span>
                       <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                       <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                         <Heart className="w-3.5 h-3.5" /> {comment.likes}
                       </button>
                       <button className="hover:text-primary-600 transition-colors">Reply</button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>

    </article>
  );
}
