import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8">
        <h1 className="text-9xl font-black text-gray-100 dark:text-gray-800/50 mb-0 leading-none select-none">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white -mt-12 mb-4 tracking-tight">
          Lost in the matrix?
        </h2>
        <p className="text-body max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button className="rounded-full px-8 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-8 h-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>

      {/* Subtle Illustration or background effect */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
