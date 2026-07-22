'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { productSchema } from '../../../validators/schemas';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Search, Plus, Trash2, Edit, X, Upload, ShoppingBag, Sparkles, Sliders } from 'lucide-react';

export default function ProductsManagement() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { getProductsQuery, createProduct, updateProduct, deleteProduct } = useProducts();
  const { getCategoriesQuery } = useCategories();
  
  const { data: productsData, isLoading, error } = getProductsQuery({ 
    page, 
    search, 
    category: categoryFilter,
    status: statusFilter,
    featured: featuredFilter,
    dashboard: 'true',
    limit: 8 
  });
  const { data: categories } = getCategoriesQuery();

  const products = productsData?.products || [];
  const totalPages = productsData?.pages || 1;

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      shortDescription: '',
      fullDescription: '',
      status: 'active',
      featured: false,
      bestSeller: false,
      newArrival: false,
      variants: [{ size: '100ml', price: 100, salePrice: 0, sku: '', stock: 20, active: true }],
      fragrance: {
        fragranceFamily: '',
        topNotes: '',
        middleNotes: '',
        baseNotes: '',
        concentration: 'EDP',
        gender: 'Unisex',
        season: [],
        occasion: []
      },
      performance: {
        longevity: 80,
        projection: 80
      }
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants'
  });

  const watchVariants = watch('variants');
  const watchLongevity = watch('performance.longevity');
  const watchProjection = watch('performance.projection');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const onAddSubmit = async (data) => {
    setFormError('');
    if (selectedFiles.length === 0) {
      setFormError('Please upload at least one image file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('category', data.category);
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('fullDescription', data.fullDescription);
    formData.append('status', data.status);
    formData.append('featured', data.featured);
    formData.append('bestSeller', data.bestSeller);
    formData.append('newArrival', data.newArrival);

    formData.append('variants', JSON.stringify(data.variants));
    formData.append('fragrance', JSON.stringify(data.fragrance));
    formData.append('performance', JSON.stringify(data.performance));

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await createProduct(formData);
      toast.success('Perfume created successfully');
      handleFormClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create perfume.');
      setFormError(err.response?.data?.error || 'Failed to create perfume.');
    }
  };

  const onEditSubmit = async (data) => {
    setFormError('');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('category', data.category);
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('fullDescription', data.fullDescription);
    formData.append('status', data.status);
    formData.append('featured', data.featured);
    formData.append('bestSeller', data.bestSeller);
    formData.append('newArrival', data.newArrival);

    formData.append('variants', JSON.stringify(data.variants));
    formData.append('fragrance', JSON.stringify(data.fragrance));
    formData.append('performance', JSON.stringify(data.performance));

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
    } else {
      existingImages.forEach((img) => {
        formData.append('keepImages', img);
      });
    }

    try {
      await updateProduct({ id: editingId, formData });
      toast.success('Perfume updated successfully');
      handleFormClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update perfume.');
      setFormError(err.response?.data?.error || 'Failed to update perfume.');
    }
  };

  const handleEditClick = (prod) => {
    setEditingId(prod._id);
    setShowForm(true);
    
    setValue('name', prod.name);
    setValue('brand', prod.brand);
    setValue('category', prod.category?._id || prod.category || '');
    setValue('shortDescription', prod.shortDescription || '');
    setValue('fullDescription', prod.fullDescription);
    setValue('status', prod.status || 'active');
    setValue('featured', prod.featured || false);
    setValue('bestSeller', prod.bestSeller || false);
    setValue('newArrival', prod.newArrival || false);

    setValue('variants', prod.variants || []);
    
    setValue('fragrance.fragranceFamily', prod.fragrance?.fragranceFamily || '');
    setValue('fragrance.topNotes', prod.fragrance?.topNotes?.join(', ') || '');
    setValue('fragrance.middleNotes', prod.fragrance?.middleNotes?.join(', ') || '');
    setValue('fragrance.baseNotes', prod.fragrance?.baseNotes?.join(', ') || '');
    setValue('fragrance.concentration', prod.fragrance?.concentration || 'EDP');
    setValue('fragrance.gender', prod.fragrance?.gender || 'Unisex');
    setValue('fragrance.season', prod.fragrance?.season || []);
    setValue('fragrance.occasion', prod.fragrance?.occasion || []);

    setValue('performance.longevity', prod.performance?.longevity || 80);
    setValue('performance.projection', prod.performance?.projection || 80);

    setExistingImages(prod.images || []);
    setSelectedFiles([]);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Perfume?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it'
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProduct(id);
      toast.success('Perfume deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete perfume.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    setSelectedFiles([]);
    setExistingImages([]);
    setFormError('');
    reset();
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-foreground">Perfume Catalog</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Control pricing variants, define notes pyramids, and review stock sizes.</p>
        </div>
        <button
          onClick={() => { 
            setShowForm(true); 
            setEditingId(null); 
            reset(); 
            setSelectedFiles([]); 
            setExistingImages([]);
          }}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2 rounded-xs hover:bg-primary/95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create Perfume
        </button>
      </div>

      {/* Searching and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, brand, SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xs border border-border bg-background pl-9 pr-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
          >
            <option value="">All Families</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
            className="rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
          >
            <option value="">Featured Status</option>
            <option value="true">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Full Width Table View */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-xs text-destructive text-center">Failed to load catalog.</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xs border border-border/40">
            <ShoppingBag className="h-10 w-10 text-accent/60 mx-auto mb-3 stroke-[1.2]" />
            <p className="text-xs text-muted-foreground">No perfumes currently match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xs border border-border/40 bg-card">
            <table className="w-full text-left border-collapse text-xs text-foreground bg-card">
              <thead>
                <tr className="border-b border-border/45 bg-secondary/30 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                  <th className="p-4">Product details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Active Sizes</th>
                  <th className="p-4">Price Range</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {products.map((p) => {
                  const priceRange = p.lowestPrice === p.highestPrice 
                    ? `$${p.lowestPrice.toFixed(2)}` 
                    : `$${p.lowestPrice.toFixed(2)} - $${p.highestPrice.toFixed(2)}`;
                  
                  const sizesStr = p.variants?.map(v => v.size).join(', ') || 'N/A';

                  return (
                    <tr key={p._id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} className="w-9 h-11 rounded-xs object-cover border border-border/20" />
                        ) : (
                          <div className="w-9 h-11 bg-muted rounded-xs"></div>
                        )}
                        <div>
                          <span className="font-bold text-foreground block truncate max-w-[200px] font-serif text-sm">{p.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-accent font-semibold block">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-semibold">
                        {p.category?.name || 'Unclassified'}
                      </td>
                      <td className="p-4 font-semibold text-foreground">
                        {sizesStr}
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        {priceRange}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.totalStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {p.totalStock > 0 ? `${p.totalStock} units` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-xs text-[8px] font-bold uppercase tracking-wider border ${
                          p.status === 'active' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20' :
                          p.status === 'draft' ? 'bg-amber-500/5 text-amber-600 border-amber-500/20' :
                          'bg-muted/10 text-muted-foreground border-border'
                        }`}>
                          {p.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2 mt-3.5">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="rounded-full p-1.5 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer bg-card transition-colors"
                          title="Edit Perfume"
                        >
                          <Edit className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="rounded-full p-1.5 border border-border hover:bg-rose-500/5 text-muted-foreground hover:text-rose-600 cursor-pointer bg-card transition-colors"
                          title="Delete Perfume"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xs border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer bg-card text-foreground"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xs border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer bg-card text-foreground"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal Popup Overlay for Product Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border/40 p-6 rounded-xs space-y-4 max-h-[90vh] overflow-y-auto max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="font-bold text-foreground text-xs uppercase tracking-widest font-sans flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-accent stroke-[1.5]" /> {editingId ? 'Modify Scent' : 'Add Perfume'}
              </h3>
              <button onClick={handleFormClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4 text-xs">
              
              {/* Basic Details */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest block border-b border-border/40 pb-1">Basic Info</span>
                
                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-1">Perfume Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Santal Aura, Oud Wood..."
                    {...register('name')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                  {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-foreground block mb-1">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Aura Signature"
                      {...register('brand')}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                    />
                    {errors.brand && <span className="text-xs text-destructive mt-1 block">{errors.brand.message}</span>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-foreground block mb-1">Category</label>
                    <select
                      {...register('category')}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
                    >
                      <option value="">Select Category...</option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <span className="text-xs text-destructive mt-1 block">{errors.category.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-1">Short Tagline</label>
                  <input
                    type="text"
                    placeholder="Short editorial summary..."
                    {...register('shortDescription')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-1">Narrative Description</label>
                  <textarea
                    rows="3"
                    placeholder="Explain the scent characteristics and raw material extraction..."
                    {...register('fullDescription')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                  {errors.fullDescription && <span className="text-xs text-destructive mt-1 block">{errors.fullDescription.message}</span>}
                </div>
              </div>

              {/* Status & Featured Checkboxes */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest block border-b border-border/40 pb-1">Visibility Status</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-foreground block mb-1">Publish Status</label>
                    <select
                      {...register('status')}
                      className="w-full rounded-xs border border-border bg-background px-3 py-1.5 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 justify-center pl-2 pt-4">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none font-bold text-foreground">
                      <input type="checkbox" {...register('featured')} className="rounded border-border text-accent focus:ring-accent" />
                      Featured Scent
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none font-bold text-foreground">
                      <input type="checkbox" {...register('bestSeller')} className="rounded border-border text-accent focus:ring-accent" />
                      Best Seller
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none font-bold text-foreground">
                      <input type="checkbox" {...register('newArrival')} className="rounded border-border text-accent focus:ring-accent" />
                      New Arrival
                    </label>
                  </div>
                </div>
              </div>

              {/* Perfume Size Variants */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center border-b border-border/40 pb-1">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Bottle Variants</span>
                  <button
                    type="button"
                    onClick={() => appendVariant({ size: '50ml', price: 80, salePrice: 0, sku: '', stock: 20, active: true })}
                    className="text-[10px] font-bold uppercase tracking-wider text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Size
                  </button>
                </div>

                {variantFields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-secondary/35 rounded-xs border border-border/30 relative space-y-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-muted-foreground block mb-0.5">Size</label>
                        <input
                          type="text"
                          placeholder="e.g. 50ml, 100ml"
                          {...register(`variants.${idx}.size`)}
                          className="w-full rounded-xs border border-border bg-background px-2 py-1 text-xs focus:border-accent text-foreground"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-muted-foreground block mb-0.5">SKU</label>
                        <input
                          type="text"
                          placeholder="Variant SKU..."
                          {...register(`variants.${idx}.sku`)}
                          className="w-full rounded-xs border border-border bg-background px-2 py-1 text-xs focus:border-accent text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-muted-foreground block mb-0.5">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`variants.${idx}.price`)}
                          className="w-full rounded-xs border border-border bg-background px-2 py-1 text-xs focus:border-accent text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-muted-foreground block mb-0.5">Promo Price</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0 if none"
                          {...register(`variants.${idx}.salePrice`)}
                          className="w-full rounded-xs border border-border bg-background px-2 py-1 text-xs focus:border-accent text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-muted-foreground block mb-0.5">Stock</label>
                        <input
                          type="number"
                          {...register(`variants.${idx}.stock`)}
                          className="w-full rounded-xs border border-border bg-background px-2 py-1 text-xs focus:border-accent text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`variants.${idx}.active`}
                        {...register(`variants.${idx}.active`)}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <label htmlFor={`variants.${idx}.active`} className="text-[9px] font-bold text-muted-foreground cursor-pointer select-none">
                        Active variant (listed on frontend)
                      </label>
                    </div>
                  </div>
                ))}
                {errors.variants && <span className="text-xs text-destructive mt-1 block">{errors.variants.message}</span>}
              </div>

              {/* Fragrance Specifications */}
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest block border-b border-border/40 pb-1">Fragrance Notes Profile</span>
                
                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-1">Fragrance Family</label>
                  <input
                    type="text"
                    placeholder="e.g. Woody Oriental, Floral Chypre..."
                    {...register('fragrance.fragranceFamily')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-0.5">Top Notes</label>
                  <span className="text-[9px] text-muted-foreground block mb-1">Separate notes with commas</span>
                  <input
                    type="text"
                    placeholder="Bergamot, Cardamom, Lemon..."
                    {...register('fragrance.topNotes')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-0.5">Heart (Middle) Notes</label>
                  <span className="text-[9px] text-muted-foreground block mb-1">Separate notes with commas</span>
                  <input
                    type="text"
                    placeholder="Turkish Rose, Violet, Cedarwood..."
                    {...register('fragrance.middleNotes')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground block mb-0.5">Base Notes</label>
                  <span className="text-[9px] text-muted-foreground block mb-1">Separate notes with commas</span>
                  <input
                    type="text"
                    placeholder="White Ambergris, Sandalwood, Musk..."
                    {...register('fragrance.baseNotes')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-foreground block mb-1">Concentration</label>
                    <select
                      {...register('fragrance.concentration')}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
                    >
                      <option value="EDP">Eau de Parfum (EDP)</option>
                      <option value="EDT">Eau de Toilette (EDT)</option>
                      <option value="Parfum">Extrait de Parfum (Parfum)</option>
                      <option value="Cologne">Eau de Cologne</option>
                      <option value="Eau Fraiche">Eau Fraiche</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-foreground block mb-1">Gender focus</label>
                    <select
                      {...register('fragrance.gender')}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer"
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Longevity Projection Sliders */}
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest block border-b border-border/40 pb-1">Performance Specs</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-foreground">Scent Longevity</label>
                    <span className="font-bold text-accent">{watchLongevity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    {...register('performance.longevity')}
                    className="w-full h-1 bg-secondary accent-accent rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-foreground">Sillage Projection</label>
                    <span className="font-bold text-accent">{watchProjection}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    {...register('performance.projection')}
                    className="w-full h-1 bg-secondary accent-accent rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Image Uploads */}
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest block border-b border-border/40 pb-1">Fragrance Imagery</span>
                
                <div className="border-2 border-dashed border-border/50 rounded-xs p-4 text-center hover:bg-secondary/20 transition-all relative bg-card">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1.5 stroke-[1.2]" />
                  <span className="text-[10px] font-bold text-foreground block">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Upload fragrance photos'}
                  </span>
                  <span className="text-[8px] text-muted-foreground mt-0.5 block">Supports JPG, PNG, WebP up to 5MB</span>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto py-1">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="w-10 h-12 rounded-xs border border-border/40 overflow-hidden shrink-0 relative bg-muted">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {editingId && existingImages.length > 0 && selectedFiles.length === 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto py-1">
                    {existingImages.map((imgUrl, idx) => (
                      <div key={idx} className="w-10 h-12 rounded-xs border border-border/40 overflow-hidden shrink-0 relative bg-muted">
                        <img src={imgUrl} className="w-full h-full object-cover" />
                      </div>
                    ))}
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
                className="w-full rounded-xs bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Securing Fragrances...' : editingId ? 'Save Changes' : 'Publish Perfume'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
