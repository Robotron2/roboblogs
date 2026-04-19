import { Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Skeleton from './Skeleton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from './Input';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, isLoading, logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Articles', path: '/blogs' },
  ];

  // Sync with URL when it changes externally
  useEffect(() => {
    const fromUrl = searchParams.get('search') || '';
    if (fromUrl !== searchQuery) {
      setSearchQuery(fromUrl);
    }
  }, [searchParams]);

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

  // Handle Mobile Menu Escape & Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      
      // Simple focus trap
      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Wait for layout then focus the first focusable element inside (the close button usually)
      setTimeout(() => {
        const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>('button');
        firstFocusable?.focus();
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav aria-label="Main Navigation" className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-bold tracking-tight text-main-light dark:text-main-dark">
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
                      : 'border-transparent text-gray-500 hover:text-main-light dark:text-gray-400 dark:hover:text-main-dark'
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" aria-hidden="true" />
            <Input 
              type="text" 
              placeholder="Search..." 
              aria-label="Search articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-48 pl-9 pr-4 rounded-lg"
            />
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>

          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton circle width="2rem" height="2rem" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="sr-only">Go to profile</span>
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

        <button 
          ref={menuButtonRef}
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Open main menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div 
          ref={mobileMenuRef}
          className={`relative flex w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-background-dark shadow-xl h-full transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex px-4 pb-2 pt-4 justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <Link 
              to="/" 
              className="text-lg font-bold tracking-tight text-main-light dark:text-main-dark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              RoboBlogs
            </Link>
            <button 
              type="button" 
              className="-m-2 p-2 text-gray-400 hover:text-gray-500 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menus"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-1 px-4 py-6 flex-1 text-base">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="pt-6 relative">
              <Search className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" aria-hidden="true" />
              <Input 
                type="text" 
                placeholder="Search..." 
                aria-label="Search articles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 rounded-lg"
              />
            </div>
            
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 mt-4 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              {isDark ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
          
          <div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-4">
             {isAuthenticated ? (
               <div className="space-y-3 flex flex-col">
                 {isAdmin && (
                   <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button className="w-full" variant="outline" size="md">Admin Dashboard</Button>
                   </Link>
                 )}
                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button className="w-full" variant="secondary" size="md">My Profile</Button>
                 </Link>
                 <Button 
                   variant="ghost" 
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     logout();
                     navigate('/login');
                   }}
                   className="w-full text-red-500 hover:text-red-600 justify-start px-4"
                 >
                   <LogOut className="w-4 h-4 mr-2" aria-hidden="true" /> Logout
                 </Button>
               </div>
             ) : (
               <div className="space-y-3">
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">Login</Button>
                 </Link>
                 <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                 </Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
}
