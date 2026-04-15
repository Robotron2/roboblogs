import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Bold, Italic, Heading1, Heading2, List, Code } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { createPostSchema } from '../../utils/schemas';
import { postsApi } from '../../api/posts.api';
import { uploadImage } from '../../utils/cloudinary';
import type { CreatePostFormData } from '../../utils/schemas';

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setValue('coverImage', url);
      setCoverPreview(url);
      toast.success('Cover image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await postsApi.create(data);
      toast.success('Post published successfully');
      navigate('/admin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto pb-24">
      {/* Cover Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-80 bg-gray-50 dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-12 relative overflow-hidden group"
      >
        {coverPreview ? (
          <img src={coverPreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <ImagePlus className={`w-8 h-8 mb-3 ${isUploading ? 'animate-pulse' : ''}`} />
            <p className="text-sm font-medium text-gray-500">
              {isUploading ? 'Uploading...' : 'Add a cover image'}
            </p>
          </>
        )}
      </div>

      {/* Title */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Article Title"
          className="w-full text-5xl font-bold bg-transparent border-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-0 p-0 mb-1 tracking-tight"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-error mt-1">{errors.title.message}</p>}
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-2 flex items-center justify-between mb-8">
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Bold className="w-4 h-4" /></button>
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Italic className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Heading1 className="w-4 h-4" /></button>
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Heading2 className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><List className="w-4 h-4" /></button>
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Code className="w-4 h-4" /></button>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="sm" className="rounded-full">Save Draft</Button>
          <Button type="submit" size="sm" className="rounded-full px-6" isLoading={isSubmitting}>Publish</Button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        <textarea
          placeholder="Tell your story..."
          className="w-full text-lg leading-relaxed bg-transparent border-none focus:ring-0 focus:outline-none min-h-[400px] resize-none p-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-700 dark:text-gray-300"
          {...register('content')}
        />
        {errors.content && <p className="text-sm text-error mt-1">{errors.content.message}</p>}
      </div>
    </form>
  );
}
