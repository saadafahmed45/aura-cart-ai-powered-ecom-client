'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../../validators/schemas';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { ArrowLeft, CheckCircle2, CreditCard, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, coupon, getTotals, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { profile } = useAuth();
  const { createOrder, isCreatingOrder } = useOrders();

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const totals = getTotals();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      couponCode: coupon?.code || ''
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=checkout');
    } else if (cartItems.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [isAuthenticated, cartItems, orderSuccess, router]);

  useEffect(() => {
    if (profile?.addresses?.length > 0) {
      const defaultAddr = profile.addresses.find(addr => addr.isDefault) || profile.addresses[0];
      if (defaultAddr) {
        setValue('street', defaultAddr.street);
        setValue('city', defaultAddr.city);
        setValue('state', defaultAddr.state);
        setValue('zip', defaultAddr.zip);
        setValue('country', defaultAddr.country);
      }
    }
  }, [profile, setValue]);

  const selectAddress = (addr) => {
    setValue('street', addr.street);
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('zip', addr.zip);
    setValue('country', addr.country);
  };

  const onSubmit = async (data) => {
    setErrorMessage('');
    const shippingAddress = {
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country
    };

    const orderItems = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price
    }));

    try {
      const order = await createOrder({
        orderItems,
        shippingAddress,
        couponCode: coupon?.code || null
      });
      setCreatedOrder(order);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to place order. Please try again.');
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 bg-background">
        <div className="rounded-full bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-500 mb-6">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-3">Order Placed Successfully!</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-2">
          Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-foreground bg-secondary px-1.5 py-0.5 rounded border">{createdOrder?._id}</span>.
        </p>
        <p className="text-muted-foreground text-sm max-w-sm mb-8">
          Our shipping agents will fulfill your package soon. You will pay <strong className="text-foreground">${createdOrder?.totalPrice}</strong> via Cash on Delivery at your door.
        </p>
        <div className="flex gap-4">
          <Link href="/orders" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
            Track Orders
          </Link>
          <Link href="/products" className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {profile?.addresses?.length > 0 && (
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-primary" /> Saved Delivery Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.addresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => selectAddress(addr)}
                    className="flex flex-col text-left p-3 rounded-lg border border-border bg-card hover:bg-secondary cursor-pointer transition-colors text-xs text-muted-foreground leading-relaxed"
                  >
                    <span className="font-semibold text-foreground text-sm mb-1">
                      {addr.street} {addr.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 font-bold">DEFAULT</span>}
                    </span>
                    <span>{addr.city}, {addr.state} {addr.zip}</span>
                    <span>{addr.country}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-1.5 border-b border-border pb-3">
              <MapPin className="h-4.5 w-4.5 text-primary" /> Delivery Address
            </h3>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Street Address</label>
              <input
                type="text"
                placeholder="123 Main St, Apt 4B"
                {...register('street')}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
              {errors.street && <span className="text-xs text-destructive mt-1 block">{errors.street.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">City</label>
                <input
                  type="text"
                  placeholder="New York"
                  {...register('city')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.city && <span className="text-xs text-destructive mt-1 block">{errors.city.message}</span>}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">State / Province</label>
                <input
                  type="text"
                  placeholder="NY"
                  {...register('state')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.state && <span className="text-xs text-destructive mt-1 block">{errors.state.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  {...register('zip')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.zip && <span className="text-xs text-destructive mt-1 block">{errors.zip.message}</span>}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Country</label>
                <input
                  type="text"
                  placeholder="USA"
                  {...register('country')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
                {errors.country && <span className="text-xs text-destructive mt-1 block">{errors.country.message}</span>}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-semibold">
                {errorMessage}
              </div>
            )}

            <input type="submit" id="checkout-form-submit" className="hidden" />

          </form>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-1.5 border-b border-border pb-3">
              <CreditCard className="h-4.5 w-4.5 text-primary" /> Payment Method
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-primary bg-primary/5 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  defaultChecked
                  className="mt-1 text-primary cursor-pointer"
                />
                <label htmlFor="cod" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold text-sm text-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-emerald-500" /> Cash on Delivery (COD)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Pay with cash directly to our delivery courier when your package arrives at your door.
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/40 opacity-60">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="online"
                  disabled
                  className="mt-1"
                />
                <label htmlFor="online" className="flex flex-col gap-1">
                  <span className="font-bold text-sm text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" /> Online Payment (Cards/Stripe) 
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-foreground border">COMING SOON</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Pay securely using credit cards or digital bank transfers. Extensible config ready for Stripe/SSLCommerz.
                  </span>
                </label>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-foreground text-sm border-b border-border pb-3">Order Details</h3>

          <div className="divide-y divide-border/60 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between py-2 text-xs">
                <div className="flex gap-2 truncate pr-4">
                  <span className="font-bold text-muted-foreground shrink-0">{item.quantity}x</span>
                  <span className="truncate text-foreground font-semibold">{item.product.name}</span>
                </div>
                <span className="font-bold text-foreground">${((item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Discount</span>
                <span className="font-semibold">-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span className="font-semibold text-foreground">${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-foreground">
                {totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-border pt-4 text-base font-extrabold text-foreground">
            <span>Total Cost</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => document.getElementById('checkout-form-submit').click()}
            disabled={isCreatingOrder}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isCreatingOrder ? 'Placing Order...' : 'Confirm COD Purchase'}
          </button>
        </div>

      </div>
    </div>
  );
}
