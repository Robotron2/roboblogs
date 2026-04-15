import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { resetPasswordSchema } from '../../utils/schemas';
import { authApi } from '../../api/auth.api';
import type { ResetPasswordFormData } from '../../utils/schemas';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    try {
      await authApi.resetPassword(token, data.password);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to reset password');
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
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">Reset Password</h2>
        <p className="text-sm text-body">Enter your new password below</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="password"
          placeholder="New Password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full rounded-full" isLoading={isSubmitting}>
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}
