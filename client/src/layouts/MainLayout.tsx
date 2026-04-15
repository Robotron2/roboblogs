import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer footprint mirroring design */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-4 md:mb-0">
            <p className="font-bold text-gray-900 dark:text-white mb-1">RoboBlogs</p>
            <p>&copy; {new Date().getFullYear()} RoboBlogs. All rights reserved.</p>
          </div>
          
          <div className="flex gap-16">
             <div className="flex flex-col gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Company</span>
                <a href="#" className="hover:text-primary-600 transition-colors">About Us</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
                <a href="#" className="hover:text-primary-600 transition-colors">RSS Feed</a>
             </div>
             <div className="flex flex-col gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Legal</span>
                <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
