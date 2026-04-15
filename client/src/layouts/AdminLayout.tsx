import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Create Post', path: '/admin/posts/new' },
    { name: 'Library', path: '/admin/posts' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] flex flex-col">
      {/* Admin Top Navigation */}
      <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-4">
             <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
               RoboBlogs
             </Link>
             <span className="hidden sm:inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
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
                    className={`pb-5 pt-5 border-b-2 transition-colors ${
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
               <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Chief Editor</p>
             </div>
             <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover" />
             </div>
          </div>
          
        </div>
      </nav>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="w-full mt-auto py-8 text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
           <div>
            <p className="font-bold text-gray-900 dark:text-white mb-1">RoboBlogs</p>
            <p>The future of intelligent storytelling.</p>
           </div>
           
           <div className="flex gap-6 my-4 md:my-0">
             <a href="#" className="hover:text-primary-600">Privacy Policy</a>
             <a href="#" className="hover:text-primary-600">Terms of Service</a>
             <a href="#" className="hover:text-primary-600">Contact</a>
             <a href="#" className="hover:text-primary-600">RSS Feed</a>
           </div>

           <p>&copy; {new Date().getFullYear()} RoboBlogs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
