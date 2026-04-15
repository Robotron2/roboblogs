import { Heart, Share2, Bookmark, MessageSquare } from 'lucide-react';
import Button from '../../components/Button';

export default function SinglePost() {
  return (
    <article className="w-full max-w-3xl mx-auto pb-16">
      
      {/* Category + Read Time */}
      <header className="pt-4 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold tracking-widest text-primary-600 uppercase bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded">
            FEATURED
          </span>
          <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
            8 min read
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
          The Cognitive Dawn: Why Large Language Models Are Just the Beginning
        </h1>

        {/* Author row + actions */}
        <div className="flex items-center justify-between py-4 border-y border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=11" alt="Julian Vane" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Julian Vane</p>
              <p className="text-xs text-gray-400">Lead AI Researcher &bull; Oct 24, 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-full transition-colors">
              <Heart className="w-4 h-4 fill-current" /> 1.2k
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <figure className="mb-10 w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
        <img 
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
          alt="Cover" 
          className="w-full h-auto max-h-[400px] object-cover"
        />
      </figure>

      {/* Article Body */}
      <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
        <p className="text-lg italic text-gray-500 dark:text-gray-400 leading-relaxed">
          As we stand at the precipice of a new era in computational intelligence, the rapid evolution
          of Large Language Models (LLMs) prompts us to re-evaluate what it means to "think."
        </p>

        <p>
          For decades, the goal of artificial intelligence was narrow. We built systems that could play chess
          better than grandmasters, or recognize faces in a crowd. But these were islands of competence in
          a sea of ignorance. Today, the islands are merging. The emergence of transformers has provided a
          unified architecture for processing the complexity of human language, code, and even biology.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white pt-4">The Architecture of Reasoning</h3>
        
        <p>
          Unlike the deterministic software of the past, modern LLMs operate on a probabilistic landscape.
          When you ask a question, the model isn't searching a database; it is navigating a high-dimensional
          space of relationships it learned during training.
        </p>

        {/* Inline image */}
        <figure className="my-8 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <img 
            src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&q=80"
            alt="Neural network visualization"
            className="w-full h-auto max-h-[350px] object-cover"
          />
        </figure>

        <p>
          This snippet reflects the foundational shift. We are moving from hard-coded logic to learned
          context. However, the true breakthrough isn't just in the scale of parameters, but in the
          reinforcement learning from human feedback (RLHF) that aligns these statistical giants with
          human values.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Looking Forward</h3>
        
        <p>
          The next decade will likely be defined by "agentic workflows" -- systems that don't just answer
          queries but execute multi-step tasks across different environments. This brings us closer to the
          vision of a digital collaborator that truly understands intent.
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-10 mb-16">
        {['Artificial Intelligence', 'Future Tech', 'Transformers', 'Ethics'].map(tag => (
          <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
            {tag}
          </span>
        ))}
      </div>

      <hr className="border-gray-200 dark:border-gray-800 mb-10" />

      {/* Comments */}
      <section>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">Comments (24)</h3>

        {/* Join CTA */}
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl mb-10 text-center">
          <MessageSquare className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-white mb-1">Join the conversation</p>
          <p className="text-xs text-gray-400 mb-4">Please log in or register to share your thoughts on this article.</p>
          <div className="flex gap-3">
            <Button size="sm">Login</Button>
            <Button variant="outline" size="sm">Sign Up</Button>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-8">
          {[
            { name: 'Sarah Miller', time: '2 hours ago', text: 'This is a fantastic breakdown of where LLMs fit in the broader history of AI. The distinction between "islands of competence" and the unified architecture we see now is a great metaphor.', likes: 12 },
            { name: 'Marcus Chen', time: '5 hours ago', text: 'I\'m curious about the agentic workflow part. How do we ensure safety when LLMs start taking actions in the real world? That feels like the next big ethical hurdle.', likes: 5 },
          ].map((comment, i) => (
            <div key={i} className="flex gap-4">
              <img src={`https://i.pravatar.cc/150?img=${i + 5}`} alt={comment.name} className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{comment.name}</span>
                  <span className="text-xs text-gray-400">{comment.time}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
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
