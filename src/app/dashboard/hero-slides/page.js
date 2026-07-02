'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHeroSlides } from '../../../hooks/useHeroSlides';
import { heroSlideSchema } from '../../../validators/schemas';
import { Image as ImageIcon, Plus, Trash2, Edit, X, Eye, EyeOff, GripVertical, Upload } from 'lucide-react';

export default function HeroSlidesManagement() {
  const { getAllHeroSlidesQuery, createHeroSlide, updateHeroSlide, deleteHeroSlide } = useHeroSlides();
  const { data: slides, isLoading, error } = getAllHeroSlidesQuery();

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: '',
      description: '',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      order: 0,
      isActive: true
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    reset({
      title: '',
      description: '',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      order: 0,
      isActive: true
    });
    setImagePreview(null);
    setImageFile(null);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onAddSubmit = async (data) => {
    setFormError('');
    if (!imageFile) {
      setFormError('Please upload an image for the slide.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('buttonText', data.buttonText || 'Shop Now');
      formData.append('buttonLink', data.buttonLink || '/products');
      formData.append('order', data.order || 0);
      formData.append('isActive', data.isActive);

      await createHeroSlide(formData);
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create slide.');
    }
  };

  const onEditSubmit = async (data) => {
    setFormError('');
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('buttonText', data.buttonText || '');
      formData.append('buttonLink', data.buttonLink || '');
      formData.append('order', data.order || 0);
      formData.append('isActive', data.isActive);

      await updateHeroSlide({ id: editingId, formData });
      resetForm();
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update slide.');
    }
  };

  const handleEditClick = (slide) => {
    setEditingId(slide._id);
    setShowAddForm(false);
    setValue('title', slide.title);
    setValue('description', slide.description || '');
    setValue('buttonText', slide.buttonText || '');
    setValue('buttonLink', slide.buttonLink || '');
    setValue('order', slide.order || 0);
    setValue('isActive', slide.isActive);
    setImagePreview(slide.image);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      try {
        await deleteHeroSlide(id);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete slide.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hero Slides</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage the homepage hero banner slides. Drag order numbers to reorder.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); resetForm(); }}
          className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/95 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Slides List */}
        <div className="xl:col-span-2 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-muted"></div>
              ))}
            </div>
          ) : error ? (
            <p className="text-xs text-destructive text-center">Failed to load hero slides.</p>
          ) : slides?.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground font-medium">No hero slides yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first slide to display on the homepage.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slides?.map((slide) => (
                <div
                  key={slide._id}
                  className={`flex gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow ${
                    !slide.isActive ? 'opacity-60 border-border/50' : 'border-border'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-muted relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    {!slide.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <EyeOff className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-sm truncate">{slide.title}</h4>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        slide.isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {slide.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{slide.description || 'No description'}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="font-mono bg-secondary px-1.5 py-0.5 rounded border">Order: {slide.order}</span>
                      {slide.buttonText && (
                        <span>Button: "{slide.buttonText}" → {slide.buttonLink}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEditClick(slide)}
                      className="rounded p-1.5 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer bg-card"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
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

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">
                {editingId ? 'Edit Slide' : 'Create New Slide'}
              </h3>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4">
              
              {/* Image Upload */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Slide Image {!editingId && <span className="text-destructive">*</span>}
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-36 rounded-lg border-2 border-dashed border-input bg-background hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-center overflow-hidden group"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Title <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  placeholder="Summer Collection 2026"
                  {...register('title')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.title && <span className="text-xs text-destructive mt-1 block">{errors.title.message}</span>}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Description</label>
                <textarea
                  rows="2"
                  placeholder="Discover the latest trends..."
                  {...register('description')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.description && <span className="text-xs text-destructive mt-1 block">{errors.description.message}</span>}
              </div>

              {/* Button Text & Link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Button Text</label>
                  <input
                    type="text"
                    placeholder="Shop Now"
                    {...register('buttonText')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Button Link</label>
                  <input
                    type="text"
                    placeholder="/products"
                    {...register('buttonLink')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    {...register('order')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Status</label>
                  <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                    />
                    <span className="text-sm text-foreground font-medium">Active</span>
                  </label>
                </div>
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
                {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Slide'}
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
