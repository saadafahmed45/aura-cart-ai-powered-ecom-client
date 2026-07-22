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
import { ArrowLeft, CheckCircle2, CreditCard, DollarSign, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';

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

    const orderItems = cartItems.map(item => {
      const v = item.variant;
      const price = v.salePrice > 0 && v.salePrice < v.price ? v.salePrice : v.price;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price,
        size: v.size,
        sku: v.sku
      };
    });

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
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4 bg-background font-sans">
        <div className="rounded-full bg-accent/10 p-5 border border-accent/20 text-accent mb-8">
          <CheckCircle2 className="h-16 w-16 stroke-[1.2]" />
        </div>
        <h1 className="text-4xl font-serif text-foreground font-light mb-4 tracking-wide">Order Confirmed</h1>
        <p className="text-xs text-muted-foreground max-w-md mb-3 leading-relaxed">
          Thank you for choosing Aura. Your order ID is <span className="font-mono font-bold text-foreground bg-secondary px-2 py-0.5 rounded-xs border border-border">{createdOrder?._id}</span>.
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mb-10 leading-relaxed">
          Our shipping agents will fulfill your package soon. You will pay <strong className="text-foreground">${createdOrder?.totalPrice.toFixed(2)}</strong> via Cash on Delivery at your door.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/orders')}>
            Track Orders
          </Button>
          <Button variant="outline" onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans">
      
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">SECURE GATEWAY</span>
        <h1 className="text-4xl font-serif text-foreground font-light tracking-wide">Checkout</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to bag
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Forms area */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Saved Addresses List */}
          {profile?.addresses?.length > 0 && (
            <div className="bg-card border border-border/40 p-6 rounded-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-5 flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-accent stroke-[1.5]" /> Saved Delivery Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.addresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => selectAddress(addr)}
                    className="flex flex-col text-left p-4 rounded-xs border border-border bg-card hover:bg-secondary hover:border-accent/40 cursor-pointer transition-all duration-300 text-xs text-muted-foreground leading-relaxed"
                  >
                    <span className="font-bold text-foreground text-sm mb-1.5 flex items-center gap-2">
                      {addr.street} {addr.isDefault && <span className="text-[8px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-xs font-extrabold tracking-widest uppercase">DEFAULT</span>}
                    </span>
                    <span>{addr.city}, {addr.state} {addr.zip}</span>
                    <span>{addr.country}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address Inputs Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/40 p-6 rounded-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border/40 pb-4 mb-4">
              <MapPin className="h-4.5 w-4.5 text-accent stroke-[1.5]" /> Delivery Address
            </h3>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Street Address</label>
              <input
                type="text"
                placeholder="123 Main St, Apt 4B"
                {...register('street')}
                className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
              {errors.street && <span className="text-xs text-destructive mt-1.5 block">{errors.street.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">City</label>
                <input
                  type="text"
                  placeholder="New York"
                  {...register('city')}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                />
                {errors.city && <span className="text-xs text-destructive mt-1.5 block">{errors.city.message}</span>}
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">State / Province</label>
                <input
                  type="text"
                  placeholder="NY"
                  {...register('state')}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                />
                {errors.state && <span className="text-xs text-destructive mt-1.5 block">{errors.state.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  {...register('zip')}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                />
                {errors.zip && <span className="text-xs text-destructive mt-1.5 block">{errors.zip.message}</span>}
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Country</label>
                <input
                  type="text"
                  placeholder="USA"
                  {...register('country')}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                />
                {errors.country && <span className="text-xs text-destructive mt-1.5 block">{errors.country.message}</span>}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-destructive/5 p-3.5 border border-destructive/20 text-xs text-destructive font-semibold">
                {errorMessage}
              </div>
            )}

            <input type="submit" id="checkout-form-submit" className="hidden" />

          </form>

          {/* Payment Methods */}
          <div className="bg-card border border-border/40 p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border/40 pb-4 mb-4">
              <CreditCard className="h-4.5 w-4.5 text-accent stroke-[1.5]" /> Payment Method
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xs border border-accent bg-secondary/50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  defaultChecked
                  className="mt-1 text-primary cursor-pointer"
                />
                <label htmlFor="cod" className="flex flex-col gap-1 cursor-pointer select-none">
                  <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Cash on Delivery (COD)
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Pay with cash directly to our delivery courier when your package arrives at your door.
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xs border border-border/40 bg-muted/20 opacity-60">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="online"
                  disabled
                  className="mt-1"
                />
                <label htmlFor="online" className="flex flex-col gap-1 select-none">
                  <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" /> Online Payment (Cards/Stripe) 
                    <span className="rounded-xs bg-secondary px-2 py-0.5 text-[8px] font-extrabold tracking-widest text-foreground border border-border uppercase">COMING SOON</span>
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Pay securely using credit cards or digital bank transfers. Extensible config ready for Stripe/SSLCommerz.
                  </span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Order details panel */}
        <div className="bg-card border border-border/40 p-6 rounded-xs flex flex-col gap-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground border-b border-border/40 pb-4">Order Details</h3>

          <div className="divide-y divide-border/30 max-h-48 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const v = item.variant;
              if (!v) return null;
              const price = v.salePrice > 0 && v.salePrice < v.price ? v.salePrice : v.price;
              
              return (
                <div key={`${item.product._id}-${v.size}`} className="flex justify-between py-3.5 text-xs">
                  <div className="flex gap-2.5 truncate pr-4">
                    <span className="font-bold text-accent shrink-0">{item.quantity}x</span>
                    <span className="truncate text-foreground font-semibold font-sans">{item.product.name} ({v.size})</span>
                  </div>
                  <span className="font-bold text-foreground tracking-wider">${(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3.5 border-t border-border/40 pt-5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-bold">
                <span>Discount</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span className="font-semibold text-foreground">${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-foreground">
                {totals.shipping === 0 ? 'Complimentary' : `$${totals.shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-border/40 pt-5 text-xs uppercase font-extrabold text-foreground">
            <span>Total Cost</span>
            <span className="text-base font-serif">${totals.total.toFixed(2)}</span>
          </div>

          <Button
            onClick={() => document.getElementById('checkout-form-submit').click()}
            disabled={isCreatingOrder}
            className="w-full mt-4 flex items-center justify-center gap-2 py-4"
          >
            {isCreatingOrder ? 'Securing Scents...' : 'Confirm COD Purchase'}
          </Button>

          <div className="flex justify-center items-center gap-1.5 text-[10px] text-muted-foreground font-semibold mt-1">
            <Sparkles className="h-3.5 w-3.5 text-accent stroke-[1.5]" /> Fulfilling under high compliance
          </div>
        </div>

      </div>
    </div>
  );
}
