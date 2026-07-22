'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategories } from '../../../hooks/useCategories';
import { categorySchema } from '../../../validators/schemas';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FolderTree, Plus, Trash2, Edit, X, Upload } from 'lucide-react';

export default function CategoriesManagement() {
  const { getCategoriesQuery, createCategory, updateCategory, deleteCategory } = useCategories();
  const { data: categories, isLoading, error } = getCategoriesQuery();

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onAddSubmit = async (data) => {
    setFormError('');
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      await createCategory(formData);
      toast.success('Category created successfully');
      handleFormClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create category.');
      setFormError(err.response?.data?.error || 'Failed to create category.');
    }
  };

  const onEditSubmit = async (data) => {
    setFormError('');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      await updateCategory({ id: editingId, formData });
      toast.success('Category updated successfully');
      handleFormClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update category.');
      setFormError(err.response?.data?.error || 'Failed to update category.');
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setShowAddForm(true);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
    setExistingImage(cat.image || '');
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: 'Products in this category may become uncategorized.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it'
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete category.');
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingId(null);
    setSelectedFile(null);
    setExistingImage('');
    setFormError('');
    reset();
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-foreground">Category Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Define classifications, handle taxonomies, and manage slugs.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); reset(); setSelectedFile(null); setExistingImage(''); }}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2 rounded-xs hover:bg-primary/95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Full Width Categories Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded bg-muted"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-xs text-destructive text-center">Failed to load categories.</p>
        ) : categories?.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xs border border-border/40">
            <FolderTree className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No categories defined yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((cat) => (
              <div
                key={cat._id}
                className="flex gap-4 p-5 rounded-xs border border-border/40 bg-card hover:border-accent/40 shadow-xs hover:shadow-sm transition-all text-xs text-muted-foreground"
              >
                {cat.image ? (
                  <img src={cat.image} className="w-16 h-16 rounded-xs object-cover border border-border/20 shrink-0 bg-secondary" alt="" />
                ) : (
                  <div className="w-16 h-16 rounded-xs bg-secondary border border-border/10 shrink-0 flex items-center justify-center text-[10px] uppercase font-bold text-muted-foreground/45">No Img</div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-foreground text-sm mb-1 font-serif truncate">{cat.name}</h4>
                      <p className="text-[9px] font-mono font-bold text-accent bg-secondary/80 px-2 py-0.5 rounded border border-border w-fit mb-2">/{cat.slug}</p>
                    </div>
                    
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="rounded p-1 border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer bg-card transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="rounded p-1 border border-border/40 hover:bg-rose-500/5 text-muted-foreground hover:text-rose-600 cursor-pointer bg-card transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="leading-relaxed truncate text-muted-foreground mt-1">{cat.description || 'No description provided.'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup Overlay for Category Form */}
      {(showAddForm || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border/40 p-6 rounded-xs shadow-2xl space-y-4 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="font-bold text-foreground text-xs uppercase tracking-widest font-sans">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={handleFormClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Category Name</label>
                <input
                  type="text"
                  placeholder="Woody, Citrus, Floral..."
                  {...register('name')}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                />
                {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide category description details..."
                  {...register('description')}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                />
                {errors.description && <span className="text-xs text-destructive mt-1 block">{errors.description.message}</span>}
              </div>

              {/* Image Input field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Category Banner Image</label>
                
                <div className="border border-dashed border-border rounded-xs p-4 text-center hover:bg-secondary/20 transition-all relative bg-card cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1 stroke-[1.2]" />
                  <span className="text-[9px] font-bold text-foreground block">
                    {selectedFile ? selectedFile.name : 'Select Banner Photo'}
                  </span>
                </div>

                {selectedFile && (
                  <div className="w-16 h-16 rounded-xs border border-border/40 overflow-hidden relative mt-2 bg-muted">
                    <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" alt="" />
                  </div>
                )}

                {editingId && existingImage && !selectedFile && (
                  <div className="w-16 h-16 rounded-xs border border-border/40 overflow-hidden relative mt-2 bg-muted">
                    <img src={existingImage} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
              </div>

              {formError && (
                <div className="rounded-xs bg-destructive/5 p-2.5 text-xs text-destructive border border-destructive/20 font-semibold">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xs bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
