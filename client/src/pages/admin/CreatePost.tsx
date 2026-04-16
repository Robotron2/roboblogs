import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Bold, Italic, Heading1, Heading2, List, Code, X, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { createPostSchema } from '../../utils/schemas';
import { postsApi } from '../../api/posts.api';
import { uploadImage } from '../../utils/cloudinary';
import { useDraft } from '../../hooks/useDraft';
import type { CreatePostFormData } from '../../utils/schemas';

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const { loadDraft, saveDraft, clearDraft } = useDraft();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      coverImage: '',
    }
  });

  const watchedFields = watch();

  // Check for existing draft on mount
  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft && (savedDraft.title || savedDraft.content || savedDraft.coverImage)) {
      setShowRestorePrompt(true);
    }
  }, [loadDraft]);

  // Handle Auto-save with Debounce
  useEffect(() => {
    const { title, content, coverImage } = watchedFields;
    
    // Don't auto-save if everything is empty
    if (!title && !content && !coverImage) return;

    const timeoutId = setTimeout(() => {
      saveDraft({ title, content, coverImage });
    }, 1000); // 1s debounce

    return () => clearTimeout(timeoutId);
  }, [watchedFields, saveDraft]);

  const handleRestore = () => {
    const draft = loadDraft();
    if (draft) {
      reset({
        title: draft.title,
        content: draft.content,
        coverImage: draft.coverImage,
      });
      setCoverPreview(draft.coverImage || null);
      toast.success('Draft restored');
    }
    setShowRestorePrompt(false);
  };

  const handleDiscard = () => {
    clearDraft();
    setShowRestorePrompt(false);
    toast('Draft discarded', { icon: '🗑️' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setValue('coverImage', url);
      setCoverPreview(url);
      toast.success('Cover image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await postsApi.create(data);
      clearDraft(); // Clear draft on successful publish
      toast.success('Post published successfully');
      navigate('/admin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 relative">
      {/* Restore Prompt Overlay/Banner */}
      {showRestorePrompt && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-4 flex items-center gap-6 min-w-[320px] max-w-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Restore previous draft?</h4>
              <p className="text-xs text-body">We found an unsaved story from your last session.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleDiscard}
                className="p-2 text-gray-400 hover:text-error transition-colors"
                title="Discard"
              >
                <X className="w-5 h-5" />
              </button>
              <Button size="sm" onClick={handleRestore} className="rounded-full px-4">
                Restore
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
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
            <>
              <img src={coverPreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-bold text-sm">Change cover image</p>
              </div>
            </>
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
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"><Bold className="w-4 h-4" /></button>
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"><Heading1 className="w-4 h-4" /></button>
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"><Heading2 className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"><List className="w-4 h-4" /></button>
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"><Code className="w-4 h-4" /></button>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="rounded-full"
              onClick={() => {
                const { title, content, coverImage } = watchedFields;
                saveDraft({ title, content, coverImage });
                toast.success('Draft saved manually');
              }}
            >
              Save Draft
            </Button>
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
    </div>
  );
}
