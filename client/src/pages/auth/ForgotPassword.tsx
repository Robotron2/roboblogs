import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { forgotPasswordSchema } from '../../utils/schemas';
import { authApi } from '../../api/auth.api';
import type { ForgotPasswordFormData } from '../../utils/schemas';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data.email);
      toast.success('Reset link sent to your email');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="w-full">
      <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Sign in
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">RoboBlogs</h1>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">Forgot Password</h2>
        <p className="text-sm text-body">Enter your email to receive a reset link</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="Email address"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full rounded-full" isLoading={isSubmitting}>
            Send Reset Link
          </Button>
        </div>
      </form>
    </div>
  );
}
