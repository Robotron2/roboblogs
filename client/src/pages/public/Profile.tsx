import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { setAuthToken } from '../../api/axios';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setAuthToken(null);
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">Profile</h1>

      <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-body">{user.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-body rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-body uppercase tracking-wider">Member since</label>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
