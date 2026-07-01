'use client';

import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/common/Toast';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product, isAuthenticated);
    if (isWishlisted) {
      showToast('Removed from wishlist.', 'info');
    } else {
      showToast('Added to wishlist!', 'success');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-lg"
    >
      <div className="absolute left-5 top-5 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="rounded bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
            -{discountPercent}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            OUT OF STOCK
          </span>
        )}
      </div>

      <button
        onClick={handleWishlistToggle}
        className="absolute right-5 top-5 z-10 rounded-full border border-border/40 bg-card/80 p-2 text-muted-foreground transition-all hover:bg-card hover:text-destructive cursor-pointer"
      >
        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
      </button>

      <Link href={`/products/${product._id}`} className="block overflow-hidden rounded-lg aspect-square bg-muted relative mb-4">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-grow">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">{product.brand}</p>
        <Link href={`/products/${product._id}`} className="hover:underline">
          <h3 className="text-sm font-semibold truncate text-foreground mb-1.5">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="ml-1 text-xs font-semibold text-foreground">{product.ratings || 0}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">({product.numReviews || 0} reviews)</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-border/40">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-foreground">${product.discountPrice}</span>
                <span className="text-xs text-muted-foreground line-through">${product.price}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-foreground">${product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground transition-colors cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
