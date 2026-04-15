import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col">
      
      {/* Centered form area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>

      {/* Simple inline footer matching design */}
      <footer className="w-full py-6 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">RoboBlogs</p>
            <p>&copy; {new Date().getFullYear()} RoboBlogs. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">RSS Feed</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
