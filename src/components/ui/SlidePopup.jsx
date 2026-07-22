'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { heroSlideSchema } from '../../validators/schemas';
import { Upload } from 'lucide-react';
import { Modal } from './Modal';

export function SlidePopup({ isOpen, onClose, slide, onSubmit, isSubmitting }) {
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const isEditing = !!slide;
  const imagePreview = localPreview || (slide?.image ?? null);

  const defaultValues = isEditing
    ? {
        title: slide.title,
        description: slide.description || '',
        buttonText: slide.buttonText || 'Shop Now',
        buttonLink: slide.buttonLink || '/products',
        order: slide.order ?? 0,
        isActive: slide.isActive ?? true,
      }
    : {
        title: '',
        description: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        order: 0,
        isActive: true,
      };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLocalPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data) => {
    setFormError('');
    if (!isEditing && !imageFile) {
      setFormError('Please upload an image for the slide.');
      return;
    }
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('buttonText', data.buttonText || 'Shop Now');
      formData.append('buttonLink', data.buttonLink || '/products');
      formData.append('order', data.order ?? 0);
      formData.append('isActive', data.isActive);
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save slide.');
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setImageFile(null);
    setLocalPreview(null);
    setFormError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Edit Slide' : 'Create New Slide'}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Slide Image {!isEditing && <span className="text-destructive">*</span>}
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
          {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Slide'}
        </button>
      </form>
    </Modal>
  );
}
