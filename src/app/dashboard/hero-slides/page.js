'use client';

import { useState } from 'react';
import { useHeroSlides } from '../../../hooks/useHeroSlides';
import { Image as ImageIcon, Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { SlidePopup } from '../../../components/ui/SlidePopup';

export default function HeroSlidesManagement() {
  const { getAllHeroSlidesQuery, createHeroSlide, updateHeroSlide, deleteHeroSlide, isCreatingHeroSlide, isUpdatingHeroSlide } = useHeroSlides();
  const { data: slides, isLoading, error } = getAllHeroSlidesQuery();

  const [popupOpen, setPopupOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      try {
        await deleteHeroSlide(id);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete slide.');
      }
    }
  };

  const handleAddClick = () => {
    setEditingSlide(null);
    setPopupOpen(true);
  };

  const handleEditClick = (slide) => {
    setEditingSlide(slide);
    setPopupOpen(true);
  };

  const handlePopupSubmit = async (formData) => {
    if (editingSlide) {
      await updateHeroSlide({ id: editingSlide._id, formData });
    } else {
      await createHeroSlide(formData);
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
          onClick={handleAddClick}
          className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/95 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>

      {/* Slides List */}
        <div className="space-y-4">
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
                        <span>Button: &ldquo;{slide.buttonText}&rdquo; &rarr; {slide.buttonLink}</span>
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

      <SlidePopup
        key={editingSlide?._id ?? 'new'}
        isOpen={popupOpen}
        onClose={() => { setPopupOpen(false); setEditingSlide(null); }}
        slide={editingSlide}
        onSubmit={handlePopupSubmit}
        isSubmitting={isCreatingHeroSlide || isUpdatingHeroSlide}
      />

    </div>
  );
}
