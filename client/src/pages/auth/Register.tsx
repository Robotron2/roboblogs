import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { registerSchema } from '../../utils/schemas';
import { authApi } from '../../api/auth.api';
import { setAuthToken } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { RegisterFormData } from '../../utils/schemas';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await authApi.register(data);
      const { user, accessToken } = res.data.data;
      setAuthToken(accessToken);
      login(user, accessToken);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed');
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
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">Create account</h2>
        <p className="text-sm text-body">Join the intelligent storytelling platform</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Display Name"
          error={errors.name?.message}
          {...registerField('name')}
        />
        <Input
          type="email"
          placeholder="Email address"
          error={errors.email?.message}
          {...registerField('email')}
        />
        <Input
          type="password"
          placeholder="New Password"
          error={errors.password?.message}
          {...registerField('password')}
        />

        <div className="pt-6 flex items-center justify-between">
          <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-700 transition-colors">
            Sign in instead
          </Link>
          <Button type="submit" className="min-w-[100px] rounded-lg" isLoading={isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
