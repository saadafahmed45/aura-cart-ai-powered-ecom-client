'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useCoupons } from '../../hooks/useCoupons';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, updateQuantity, removeFromCart, coupon, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { validateCoupon } = useCoupons();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const totals = getTotals();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const validatedCoupon = await validateCoupon(couponCode);
      applyCoupon(validatedCoupon);
      setCouponSuccess(`Coupon "${validatedCoupon.code}" applied successfully!`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Invalid or expired coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  const handleCheckoutRedirect = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-foreground mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Your Cart is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
            Add items to your cart to see them here. Browse our categories to find your perfect products.
          </p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => {
              const product = item.product;
              const price = product.discountPrice > 0 ? product.discountPrice : product.price;

              return (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`/products/${product._id}`} className="aspect-square w-16 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full bg-slate-200"></div>
                      )}
                    </Link>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{product.brand}</span>
                      <Link href={`/products/${product._id}`} className="hover:underline">
                        <h4 className="text-sm font-bold text-foreground truncate max-w-xs">{product.name}</h4>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">Price: ${price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
                    <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-foreground text-center min-w-[24px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[64px]">
                      <span className="text-sm font-bold text-foreground">${(price * item.quantity).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-6">
            
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" /> Apply Promo Code
              </h3>

              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:border-ring focus:outline-none uppercase text-foreground"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-xs">
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> {coupon.code} Applied (-{coupon.discountType === 'percentage' ? `${coupon.amount}%` : `$${coupon.amount}`})
                  </span>
                  <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-destructive cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {couponError && <p className="text-xs text-destructive font-semibold mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-500 font-semibold mt-2">{couponSuccess}</p>}
            </div>

            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-500">
                    <span>Discount</span>
                    <span className="font-semibold">-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-foreground">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-semibold text-foreground">
                    {totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 text-base font-bold text-foreground">
                <span>Total Cost</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>

              {!isAuthenticated && (
                <div className="mb-4 rounded-lg bg-amber-500/10 p-3 border border-amber-500/20 text-xs text-amber-600 leading-normal font-semibold">
                  You are not logged in. You will be redirected to Sign In before completing checkout.
                </div>
              )}

              <button
                onClick={handleCheckoutRedirect}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
