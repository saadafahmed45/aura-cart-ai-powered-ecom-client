'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { productSchema } from '../../../validators/schemas';
import { Search, Plus, Trash2, Edit, X, Upload, ShoppingBag } from 'lucide-react';

export default function ProductsManagement() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { getProductsQuery, createProduct, updateProduct, deleteProduct } = useProducts();
  const { getCategoriesQuery } = useCategories();
  
  const { data: productsData, isLoading, error } = getProductsQuery({ page, search, category: categoryFilter, limit: 8 });
  const { data: categories } = getCategoriesQuery();

  const products = productsData?.products || [];
  const totalPages = productsData?.pages || 1;

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      description: '',
      price: 0,
      discountPrice: 0,
      stock: 0
    }
  });

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
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('discountPrice', data.discountPrice || 0);
    formData.append('stock', data.stock);

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await createProduct(formData);
      handleFormClose();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create product.');
    }
  };

  const onEditSubmit = async (data) => {
    setFormError('');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('discountPrice', data.discountPrice || 0);
    formData.append('stock', data.stock);

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
    } else {
      existingImages.forEach((img) => {
        formData.append('existingImages', img);
      });
    }

    try {
      await updateProduct({ id: editingId, formData });
      handleFormClose();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update product.');
    }
  };

  const handleEditClick = (prod) => {
    setEditingId(prod._id);
    setShowForm(true);
    setValue('name', prod.name);
    setValue('brand', prod.brand);
    setValue('category', prod.category?._id || prod.category || '');
    setValue('description', prod.description);
    setValue('price', prod.price);
    setValue('discountPrice', prod.discountPrice || 0);
    setValue('stock', prod.stock);
    setExistingImages(prod.images || []);
    setSelectedFiles([]);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete product.');
      }
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
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Catalog Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Control items stock, upload promo imagery, and modify pricing specs.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); reset(); setSelectedFiles([]); }}
          className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/95 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search catalog by name, brand..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-xs focus:border-ring focus:outline-none text-foreground"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:border-ring focus:outline-none text-foreground cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
              ))}
            </div>
          ) : error ? (
            <p className="text-xs text-destructive text-center">Failed to load catalog.</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No products match your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left border-collapse text-xs text-foreground bg-card">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-semibold text-muted-foreground">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-secondary/25 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded"></div>
                        )}
                        <div>
                          <span className="font-bold text-foreground block truncate max-w-[150px]">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground block">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {p.category?.name || 'Uncategorized'}
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        {p.discountPrice > 0 ? (
                          <div className="flex flex-col">
                            <span>${p.discountPrice}</span>
                            <span className="text-[10px] text-muted-foreground line-through">${p.price}</span>
                          </div>
                        ) : (
                          <span>${p.price}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {p.stock > 0 ? `${p.stock} units` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => handleEditClick(p)}
                          className="rounded p-1.5 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer bg-card"
                          title="Edit Details"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="rounded p-1.5 border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer bg-card"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded border px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer bg-card text-foreground"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded border px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer bg-card text-foreground"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">
                {editingId ? 'Edit Product' : 'Create Product'}
              </h3>
              <button onClick={handleFormClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Product Title</label>
                <input
                  type="text"
                  placeholder="Waterproof smart watch, leather shoes..."
                  {...register('name')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Brand</label>
                  <input
                    type="text"
                    placeholder="Brand name..."
                    {...register('brand')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {errors.brand && <span className="text-xs text-destructive mt-1 block">{errors.brand.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Category</label>
                  <select
                    {...register('category')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="">Choose category...</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <span className="text-xs text-destructive mt-1 block">{errors.category.message}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide technical specifications, dimensions, features list..."
                  {...register('description')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.description && <span className="text-xs text-destructive mt-1 block">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    {...register('price')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {errors.price && <span className="text-xs text-destructive mt-1 block">{errors.price.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Promo Price</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Leave 0 if none"
                    {...register('discountPrice')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {errors.discountPrice && <span className="text-xs text-destructive mt-1 block">{errors.discountPrice.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Stock</label>
                  <input
                    type="number"
                    placeholder="50, 100..."
                    {...register('stock')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {errors.stock && <span className="text-xs text-destructive mt-1 block">{errors.stock.message}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Upload Product Images</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-secondary/40 transition-colors relative bg-card">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
                  <span className="text-[11px] font-semibold text-foreground block">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drag and drop or browse files'}
                  </span>
                  <span className="text-[9px] text-muted-foreground mt-0.5 block">Supports JPG, PNG, WebP up to 5MB</span>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="flex gap-1.5 mt-3 overflow-x-auto py-1">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="w-10 h-10 rounded border border-border overflow-hidden shrink-0 relative bg-muted">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {editingId && existingImages.length > 0 && selectedFiles.length === 0 && (
                  <div className="flex gap-1.5 mt-3 overflow-x-auto py-1">
                    {existingImages.map((imgUrl, idx) => (
                      <div key={idx} className="w-10 h-10 rounded border border-border overflow-hidden shrink-0 relative bg-muted">
                        <img src={imgUrl} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
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
                {isSubmitting ? 'Uploading & Saving...' : editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
