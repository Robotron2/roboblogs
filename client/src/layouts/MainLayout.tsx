import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer matching design: single row, links inline */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
