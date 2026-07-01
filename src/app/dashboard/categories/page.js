'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategories } from '../../../hooks/useCategories';
import { categorySchema } from '../../../validators/schemas';
import { FolderTree, Plus, Trash2, Edit, X } from 'lucide-react';

export default function CategoriesManagement() {
  const { getCategoriesQuery, createCategory, updateCategory, deleteCategory } = useCategories();
  const { data: categories, isLoading, error } = getCategoriesQuery();

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const onAddSubmit = async (data) => {
    setFormError('');
    try {
      await createCategory(data);
      reset();
      setShowAddForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create category.');
    }
  };

  const onEditSubmit = async (data) => {
    setFormError('');
    try {
      await updateCategory({ id: editingId, name: data.name, description: data.description });
      reset();
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update category.');
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setShowAddForm(false);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category? This might make associated products category-less!')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Category Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Define classifications, handle taxonomies, and manage slugs.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); reset(); }}
          className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/95 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
              ))}
            </div>
          ) : error ? (
            <p className="text-xs text-destructive text-center">Failed to load categories.</p>
          ) : categories?.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <FolderTree className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No categories defined yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories?.map((cat) => (
                <div
                  key={cat._id}
                  className="flex justify-between items-start p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow text-xs text-muted-foreground bg-card"
                >
                  <div className="pr-4">
                    <h4 className="font-bold text-foreground text-sm mb-1">{cat.name}</h4>
                    <p className="text-[10px] font-mono text-muted-foreground bg-secondary px-1 py-0.5 rounded border w-fit mb-2">/{cat.slug}</p>
                    <p className="leading-relaxed truncate max-w-xs">{cat.description || 'No description provided.'}</p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="rounded p-1.5 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer bg-card"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="rounded p-1.5 border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer bg-card"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(showAddForm || editingId) && (
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); reset(); }} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Category Name</label>
                <input
                  type="text"
                  placeholder="Electronics, Fashion..."
                  {...register('name')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide category description details..."
                  {...register('description')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.description && <span className="text-xs text-destructive mt-1 block">{errors.description.message}</span>}
              </div>

              {formError && (
                <div className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive font-semibold">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
