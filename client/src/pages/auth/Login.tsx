import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">RoboBlogs</h1>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">Sign in</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Use your RoboBlogs Account</p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Input 
          type="email" 
          placeholder="Email" 
        />
        <Input 
          type="password" 
          placeholder="Password" 
        />

        <div className="pt-1">
          <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <div className="pt-6 flex items-center justify-between">
          <Link to="/register" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Create account
          </Link>
          <Button type="button" className="min-w-[100px] rounded-full">
            Next
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Not your computer? Use Guest mode to sign in privately.
            <br />
            <a href="#" className="font-medium text-primary-600 hover:underline">Learn more</a>
          </p>
        </div>
      </form>
    </div>
  );
}
