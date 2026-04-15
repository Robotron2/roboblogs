import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Register() {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">RoboBlogs</h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">Create account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Join the intelligent storytelling platform</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input 
          type="text" 
          placeholder="Display Name" 
          className="bg-gray-50/50 dark:bg-gray-800/50"
        />
        <Input 
          type="email" 
          placeholder="Email address" 
          className="bg-gray-50/50 dark:bg-gray-800/50"
        />
        <Input 
          type="password" 
          placeholder="New Password" 
          className="bg-gray-50/50 dark:bg-gray-800/50"
        />

        <div className="pt-8 flex items-center justify-between">
          <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Sign in instead
          </Link>
          <Button type="button" className="min-w-[100px] rounded-full">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
