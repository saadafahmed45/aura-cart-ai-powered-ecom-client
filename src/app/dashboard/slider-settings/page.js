'use client';

import { useState, useEffect } from 'react';
import { useSliderConfig } from '../../../hooks/useSliderConfig';
import { useForm } from 'react-hook-form';
import { Save, RotateCcw } from 'lucide-react';

const HEIGHT_PRESETS = [
  { label: 'Full Screen', value: '100vh' },
  { label: 'Large', value: '85vh' },
  { label: 'Medium', value: '70vh' },
  { label: 'Small', value: '50vh' },
  { label: 'Custom', value: 'custom' }
];

const OBJECT_FIT_OPTIONS = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Fill', value: 'fill' }
];

const CONTENT_ALIGN_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
];

export default function SliderSettingsPage() {
  const { getSliderConfigQuery, updateSliderConfig, isUpdatingSliderConfig } = useSliderConfig();
  const { data: config, isLoading } = getSliderConfigQuery();
  const [success, setSuccess] = useState(false);
  const [heightPreset, setHeightPreset] = useState('85vh');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      height: '85vh',
      autoplayInterval: 6000,
      overlayOpacity: 15,
      overlayColor: '#000000',
      objectFit: 'cover',
      contentMaxWidth: 'max-w-7xl',
      contentAlign: 'left'
    }
  });

  const watchedHeight = watch('height');

  useEffect(() => {
    if (config) {
      const h = config.height || '85vh';
      reset({
        height: h,
        autoplayInterval: config.autoplayInterval ?? 6000,
        overlayOpacity: config.overlayOpacity ?? 15,
        overlayColor: config.overlayColor || '#000000',
        objectFit: config.objectFit || 'cover',
        contentMaxWidth: config.contentMaxWidth || 'max-w-7xl',
        contentAlign: config.contentAlign || 'left'
      });

      const preset = HEIGHT_PRESETS.find(p => p.value === h);
      setHeightPreset(preset ? h : 'custom');
    }
  }, [config, reset]);

  const handleHeightPreset = (value) => {
    setHeightPreset(value);
    if (value !== 'custom') {
      setValue('height', value);
    }
  };

  const onSubmit = async (data) => {
    setSuccess(false);
    try {
      await updateSliderConfig(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update slider settings.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-border/40 pb-4">
          <h1 className="text-xl font-bold text-foreground">Slider Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Configure the homepage hero slider appearance.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Slider Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Configure the homepage hero slider appearance and behavior.</p>
        </div>
        <div className="flex items-center gap-2">
          {success && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Saved successfully
            </span>
          )}
          <button
            onClick={() => reset({
              height: '85vh',
              autoplayInterval: 6000,
              overlayOpacity: 15,
              overlayColor: '#000000',
              objectFit: 'cover',
              contentMaxWidth: 'max-w-7xl',
              contentAlign: 'left'
            })}
            className="flex items-center gap-1.5 text-xs font-bold bg-secondary text-secondary-foreground px-3.5 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Height */}
        <div className="bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Slider Height</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Controls the overall height of the hero slider section.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HEIGHT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleHeightPreset(preset.value)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  heightPreset === preset.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-input hover:border-ring hover:text-foreground'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {heightPreset === 'custom' && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Custom height (e.g. 600px, 90vh)</label>
              <input
                type="text"
                placeholder="600px"
                {...register('height', { required: 'Height is required' })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
              {errors.height && <span className="text-xs text-destructive mt-1 block">{errors.height.message}</span>}
            </div>
          )}
        </div>

        {/* Autoplay Interval */}
        <div className="bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Autoplay Interval</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Time between automatic slide transitions (in milliseconds). Set to 0 to disable autoplay.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              {...register('autoplayInterval', { valueAsNumber: true })}
              className="flex-1 accent-primary cursor-pointer"
            />
            <span className="text-sm font-mono font-bold text-foreground min-w-[5ch] text-right">
              {watch('autoplayInterval') ? `${(watch('autoplayInterval') / 1000).toFixed(1)}s` : 'Off'}
            </span>
          </div>
        </div>

        {/* Overlay */}
        <div className="bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Image Overlay</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Dark overlay on slide images for better text readability.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  {...register('overlayColor')}
                  className="h-9 w-9 rounded-lg border border-input cursor-pointer bg-background p-0.5"
                />
                <span className="text-xs font-mono text-muted-foreground">{watch('overlayColor')}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Opacity ({watch('overlayOpacity')}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                {...register('overlayOpacity', { valueAsNumber: true })}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Image Fit */}
        <div className="bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Image Fit</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">How slide images should fit within the slider container.</p>
          </div>
          <div className="flex gap-2">
            {OBJECT_FIT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                  watch('objectFit') === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-input hover:border-ring hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('objectFit')}
                  className="hidden"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Content Alignment */}
        <div className="bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Content Alignment</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Horizontal alignment of slide text content.</p>
          </div>
          <div className="flex gap-2">
            {CONTENT_ALIGN_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                  watch('contentAlign') === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-input hover:border-ring hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('contentAlign')}
                  className="hidden"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Content Max Width */}
        <div className="bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Content Container Width</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Tailwind max-width class for the content container (e.g. max-w-7xl, max-w-4xl, max-w-full).</p>
          </div>
          <select
            {...register('contentMaxWidth')}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
          >
            <option value="max-w-full">Full Width (max-w-full)</option>
            <option value="max-w-7xl">Extra Large (max-w-7xl)</option>
            <option value="max-w-6xl">Large (max-w-6xl)</option>
            <option value="max-w-5xl">Medium (max-w-5xl)</option>
            <option value="max-w-4xl">Small (max-w-4xl)</option>
            <option value="max-w-3xl">Extra Small (max-w-3xl)</option>
          </select>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 bg-card border border-border p-5 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Preview</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Live preview of the current slider configuration.</p>
          </div>
          <div
            className="relative w-full rounded-lg overflow-hidden bg-muted"
            style={{
              height: heightPreset === 'custom' ? watchedHeight || '300px' : watchedHeight || '85vh',
              maxHeight: '400px'
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: watch('overlayColor'),
                opacity: (watch('overlayOpacity') || 15) / 100,
                zIndex: 1
              }}
            />
            <div
              className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center"
              style={{ padding: '2rem' }}
            >
              <div
                className={`${watch('contentMaxWidth') || 'max-w-7xl'} w-full`}
                style={{ textAlign: watch('contentAlign') || 'left' }}
              >
                <span className="text-[8px] font-bold uppercase tracking-widest text-amber-300 block mb-2">
                  AURA HOUSE OF SCENTS
                </span>
                <h2 className="text-white font-bold text-lg sm:text-xl leading-tight mb-1">
                  Slide Title Preview
                </h2>
                <p className="text-white/70 text-xs max-w-md">
                  Description text appears here with the current alignment and container settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="lg:col-span-2 flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdatingSliderConfig}
            className="flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isUpdatingSliderConfig ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
