'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useCoupons } from '../../hooks/useCoupons';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans">
      
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">YOUR SELECTION</span>
        <h1 className="text-4xl font-serif text-foreground font-light tracking-wide">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xs border border-border/40 max-w-lg mx-auto">
          <ShoppingBag className="h-10 w-10 text-accent/60 mx-auto mb-4 stroke-[1.2]" />
          <h3 className="text-lg font-serif font-bold text-foreground">Your bag is empty</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed font-sans">
            It seems you haven&apos;t added any fragrances to your selection. Browse our library to find your timeless presence.
          </p>
          <Link href="/products" className="mt-8 inline-flex items-center gap-2 rounded-xs bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer shadow-xs">
            Browse Fragrances <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Cart items list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => {
              const product = item.product;
              const variant = item.variant;
              if (!variant) return null;
              
              const price = variant.salePrice > 0 && variant.salePrice < variant.price ? variant.salePrice : variant.price;
              const imgUrl = variant.image || product.images?.[0];

              return (
                <div
                  key={`${product._id}-${variant.size}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xs border border-border/40 bg-card"
                >
                  <div className="flex items-center gap-5">
                    <Link href={`/products/${product._id}`} className="aspect-[4/5] w-20 overflow-hidden rounded-xs bg-secondary flex-shrink-0 border border-border/20">
                      {imgUrl ? (
                        <img src={imgUrl} alt="" className="h-full w-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full bg-slate-200"></div>
                      )}
                    </Link>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-accent tracking-widest block mb-0.5">{product.brand}</span>
                      <Link href={`/products/${product._id}`} className="hover:text-accent transition-colors">
                        <h4 className="text-sm font-serif font-semibold text-foreground truncate max-w-xs">{product.name}</h4>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">{variant.size} / {product.fragrance?.concentration || 'EDP'}</p>
                      <p className="text-xs text-foreground font-semibold mt-1.5">${price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity and subtotal row */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border/30 pt-4 sm:pt-0">
                    <div className="flex items-center border border-border rounded-xs bg-card overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product._id, variant.size, item.quantity - 1)}
                        className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-foreground text-center min-w-[24px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, variant.size, item.quantity + 1)}
                        className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-xs font-bold text-foreground tracking-wider">${(price * item.quantity).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => removeFromCart(product._id, variant.size)}
                      className="rounded-full p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Promo Code Card */}
            <div className="bg-card border border-border/40 p-6 rounded-xs">
              <h3 className="font-bold text-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-accent stroke-[1.5]" /> Promo Code
              </h3>

              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none uppercase text-foreground transition-colors"
                  />
                  <Button
                    type="submit"
                    disabled={couponLoading}
                    size="sm"
                    variant="outline"
                  >
                    Apply
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-500/5 p-3 rounded-xs border border-emerald-500/20 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-500 font-bold flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-emerald-500" /> {coupon.code} (-{coupon.discountType === 'percentage' ? `${coupon.amount}%` : `$${coupon.amount}`})
                  </span>
                  <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-destructive cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {couponError && <p className="text-xs text-destructive font-semibold mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold mt-2">{couponSuccess}</p>}
            </div>

            {/* Order Summary Card */}
            <div className="bg-card border border-border/40 p-6 rounded-xs">
              <h3 className="font-bold text-foreground text-xs uppercase tracking-widest mb-5">Order Summary</h3>

              <div className="space-y-4 pb-4 border-b border-border/40 text-xs">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Bag Subtotal</span>
                  <span className="text-foreground">${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-bold">
                    <span>Discount</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Tax (10%)</span>
                  <span className="text-foreground">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Standard Shipping</span>
                  <span className="text-foreground">
                    {totals.shipping === 0 ? 'Complimentary' : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-5 text-sm font-bold text-foreground">
                <span>Total Cost</span>
                <span className="text-base font-serif">${totals.total.toFixed(2)}</span>
              </div>

              {!isAuthenticated && (
                <div className="mb-4 rounded-xs bg-amber-500/5 p-3.5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-500 leading-normal font-semibold">
                  You are not logged in. You will be redirected to Sign In before completing checkout.
                </div>
              )}

              <Button
                onClick={handleCheckoutRedirect}
                className="w-full flex items-center justify-center gap-2 py-4"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
