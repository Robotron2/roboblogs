import { useState, useEffect } from 'react';
import { Tag, Edit2, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { categoriesApi } from '../../api/categories.api';
import type { Category } from '../../types';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory._id, data.name);
        toast.success('Category updated');
      } else {
        await categoriesApi.create(data.name);
        toast.success('Category created');
      }
      setIsModalOpen(false);
      reset();
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoriesApi.delete(categoryToDelete._id);
      toast.success('Category deleted');
      setCategories(categories.filter(c => c._id !== categoryToDelete._id));
      setCategoryToDelete(null);
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Categories</h1>
          <p className="text-body text-sm">Organize your content with global tags and topics.</p>
        </div>
        <Button 
          size="sm" 
          className="rounded-full" 
          onClick={() => {
            setEditingCategory(null);
            reset();
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <EmptyState 
          icon={<Tag className="h-8 w-8" />}
          title="No categories yet" 
          description="Create your first category to group your stories together."
        />
      ) : (
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-3 justify-end items-center">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-2 text-gray-400 hover:text-error transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        width="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input 
            label="Category Name"
            placeholder="e.g. Artificial Intelligence"
            error={errors.name?.message}
            {...register('name')}
            autoFocus
          />
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="secondary" 
              className="flex-1 rounded-full" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 rounded-full" 
              isLoading={isSubmitting}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Delete Category"
        width="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-error">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold mb-2">Are you sure?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Deleting <span className="font-semibold text-gray-900 dark:text-gray-100">"{categoryToDelete?.name}"</span> will remove it from all tagged articles.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => setCategoryToDelete(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1 rounded-full" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
