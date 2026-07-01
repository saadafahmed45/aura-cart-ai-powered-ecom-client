'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCoupons } from '../../../hooks/useCoupons';
import { couponSchema } from '../../../validators/schemas';
import { Tag, Plus, Trash2, Edit, X } from 'lucide-react';

export default function CouponsManagement() {
  const { getCouponsQuery, createCoupon, updateCoupon, deleteCoupon } = useCoupons();
  const { data: coupons, isLoading, error } = getCouponsQuery();

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(couponSchema)
  });

  const onAddSubmit = async (data) => {
    setFormError('');
    try {
      await createCoupon(data);
      reset();
      setShowAddForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create coupon.');
    }
  };

  const onEditSubmit = async (data) => {
    setFormError('');
    try {
      await updateCoupon({ id: editingId, couponData: data });
      reset();
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update coupon.');
    }
  };

  const handleEditClick = (c) => {
    setEditingId(c._id);
    setShowAddForm(false);
    setValue('code', c.code);
    setValue('discountType', c.discountType);
    setValue('amount', c.amount);
    const dateFormatted = new Date(c.expiryDate).toISOString().substring(0, 10);
    setValue('expiryDate', dateFormatted);
    setValue('isActive', c.isActive);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete coupon.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Coupon System</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Configure discounts, set code percentages or fixed values, and track expirations.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); reset(); }}
          className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/95 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create Coupon
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
            <p className="text-xs text-destructive text-center">Failed to load coupons.</p>
          ) : coupons?.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No coupons created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons?.map((c) => (
                <div
                  key={c._id}
                  className="flex justify-between items-start p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow text-xs text-muted-foreground bg-card"
                >
                  <div>
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5 mb-1">
                      <Tag className="h-4 w-4 text-primary" /> {c.code}
                    </h4>
                    <div className="flex flex-col gap-1 mt-2">
                      <span>Discount: <strong>{c.discountType === 'percentage' ? `${c.amount}%` : `$${c.amount}`}</strong></span>
                      <span>Expires: <strong>{new Date(c.expiryDate).toLocaleDateString()}</strong></span>
                      <span className="flex items-center gap-1.5 mt-1">Status: 
                        <span className={`inline-block w-2 h-2 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <strong>{c.isActive ? 'Active' : 'Inactive'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="rounded p-1.5 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer bg-card"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
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
                {editingId ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); reset(); }} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Coupon Code</label>
                <input
                  type="text"
                  placeholder="SAVE15, GOLDEN30..."
                  {...register('code')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none uppercase text-foreground"
                />
                {errors.code && <span className="text-xs text-destructive mt-1 block">{errors.code.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Discount Type</label>
                  <select
                    {...register('discountType')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  {errors.discountType && <span className="text-xs text-destructive mt-1 block">{errors.discountType.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Value Amount</label>
                  <input
                    type="number"
                    placeholder="15, 25..."
                    {...register('amount')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {errors.amount && <span className="text-xs text-destructive mt-1 block">{errors.amount.message}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Expiry Date</label>
                <input
                  type="date"
                  {...register('expiryDate')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.expiryDate && <span className="text-xs text-destructive mt-1 block">{errors.expiryDate.message}</span>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                  Coupon Active Status
                </label>
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
                {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Coupon'}
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
