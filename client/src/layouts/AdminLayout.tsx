import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Book, PenTool, Tag, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Library', path: '/admin/library', icon: Book },
    { name: 'New Post', path: '/admin/posts/new', icon: PenTool },
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Moderation', path: '/admin/moderation', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col">
      {/* Admin Top Navigation */}
      <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">R</div>
              RoboBlogs
            </Link>
            <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block border-r border-gray-100 dark:border-gray-800 pr-4 mr-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{user?.role === 'admin' ? 'Chief Editor' : 'Author'}</p>
            </div>
            
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 text-gray-400 hover:text-error transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
              <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Admin avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
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
