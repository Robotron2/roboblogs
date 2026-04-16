import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { loginSchema } from '../../utils/schemas';
import { authApi } from '../../api/auth.api';
import { setAuthToken } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { LoginFormData } from '../../utils/schemas';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login(data);
      const { user, accessToken } = res.data.data;
      setAuthToken(accessToken);
      login(user, accessToken);
      toast.success('Welcome back!');
      
      const destination = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/');
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="w-full">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">RoboBlogs</h1>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">Sign in</h2>
        <p className="text-sm text-body">Use your RoboBlogs Account</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="pt-1">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-700 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <div className="pt-6 flex items-center justify-between">
          <Link to="/register" className="text-sm font-medium text-primary hover:text-primary-700 transition-colors">
            Create account
          </Link>
          <Button type="submit" className="min-w-[100px] rounded-lg" isLoading={isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
