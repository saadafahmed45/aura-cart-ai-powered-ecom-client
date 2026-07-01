import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  coupon: null,
  isInitialized: false,

  initializeCart: () => {
    if (typeof window !== 'undefined') {
      const items = localStorage.getItem('cartItems');
      const coupon = localStorage.getItem('cartCoupon');
      set({
        items: items ? JSON.parse(items) : [],
        coupon: coupon ? JSON.parse(coupon) : null,
        isInitialized: true
      });
    } else {
      set({ isInitialized: true });
    }
  },

  addToCart: (product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find(item => item.product._id === product._id);

    let updatedItems;
    if (existingItem) {
      updatedItems = items.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item
      );
    } else {
      updatedItems = [...items, { product, quantity: Math.min(quantity, product.stock) }];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }
    set({ items: updatedItems });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const updatedItems = items.map(item =>
      item.product._id === productId
        ? { ...item, quantity: Math.min(Math.max(1, quantity), item.product.stock) }
        : item
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }
    set({ items: updatedItems });
  },

  removeFromCart: (productId) => {
    const { items } = get();
    const updatedItems = items.filter(item => item.product._id !== productId);

    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }
    set({ items: updatedItems });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartCoupon');
    }
    set({ items: [], coupon: null });
  },

  applyCoupon: (coupon) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartCoupon', JSON.stringify(coupon));
    }
    set({ coupon });
  },

  removeCoupon: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartCoupon');
    }
    set({ coupon: null });
  },

  getTotals: () => {
    const { items, coupon } = get();
    
    const subtotal = items.reduce((acc, item) => {
      const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    let discount = 0;
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.amount) / 100;
      } else if (coupon.discountType === 'fixed') {
        discount = coupon.amount;
      }
      discount = Math.min(discount, subtotal);
    }

    const tax = Math.round((subtotal - discount) * 0.1 * 100) / 100;
    const shipping = (subtotal - discount) > 100 || subtotal === 0 ? 0 : 10;
    const total = Math.round((subtotal - discount + tax + shipping) * 100) / 100;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0)
    };
  }
}));
