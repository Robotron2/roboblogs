import { Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Articles', path: '/blogs' },
  ];

  // Handle Search Debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        navigate(`/blogs?search=${encodeURIComponent(searchQuery)}`);
      } else if (location.pathname === '/blogs' && searchParams.get('search')) {
        navigate('/blogs');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, navigate, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            RoboBlogs
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`pb-[17px] pt-[17px] border-b-2 transition-colors ${
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-56 rounded-lg border border-gray-300 bg-white pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-gray-600 dark:text-gray-300">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
