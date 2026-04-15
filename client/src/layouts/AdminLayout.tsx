import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Create Post', path: '/admin/posts/new' },
    { name: 'Library', path: '/admin/posts' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col">
      {/* Admin Top Navigation */}
      <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              RoboBlogs
            </Link>
            <span className="hidden sm:inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              Admin
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`pb-[17px] pt-[17px] border-b-2 transition-colors ${
                    isActive 
                      ? 'border-primary-600 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Alex Rivera</p>
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Chief Editor</p>
            </div>
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=11" alt="Admin avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto py-6 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">RoboBlogs</p>
            <p>The future of intelligent storytelling.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">RSS Feed</a>
          </div>
          <p>&copy; {new Date().getFullYear()} RoboBlogs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
