'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/common/Toast';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  // Extract active variants and lowest price variant
  const activeVariants = product.variants?.filter((v) => v.active) || [];
  const lowestVariant = activeVariants.reduce((lowest, current) => {
    const currentPrice = current.salePrice > 0 && current.salePrice < current.price ? current.salePrice : current.price;
    const lowestPrice = lowest 
      ? (lowest.salePrice > 0 && lowest.salePrice < lowest.price ? lowest.salePrice : lowest.price) 
      : Infinity;
    return currentPrice < lowestPrice ? current : lowest;
  }, null) || product.variants?.[0];

  const price = lowestVariant 
    ? (lowestVariant.salePrice > 0 && lowestVariant.salePrice < lowestVariant.price ? lowestVariant.salePrice : lowestVariant.price) 
    : 0;
  const regularPrice = lowestVariant ? lowestVariant.price : 0;
  const hasDiscount = lowestVariant ? (lowestVariant.salePrice > 0 && lowestVariant.salePrice < lowestVariant.price) : false;
  
  const discountPercent = hasDiscount 
    ? Math.round(((regularPrice - price) / regularPrice) * 100) 
    : 0;

  const totalStock = activeVariants.reduce((acc, v) => acc + v.stock, 0);
  const outOfStock = totalStock === 0;

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
    if (!lowestVariant) {
      showToast('No active variant found for this product.', 'error');
      return;
    }
    addToCart(product, lowestVariant, 1);
    showToast(`${product.name} (${lowestVariant.size}) added to cart!`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden bg-card p-4 transition-all duration-300 border border-border/40 hover:border-accent/40 rounded-xs hover:shadow-xs"
    >
      {/* Badges - Top Left */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="rounded-xs bg-accent px-2 py-0.5 text-[9px] font-bold tracking-widest text-accent-foreground">
            -{discountPercent}% OFF
          </span>
        )}
        {outOfStock && (
          <span className="rounded-xs bg-muted px-2 py-0.5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
            Sold Out
          </span>
        )}
      </div>

      {/* Wishlist Button - Top Right */}
      <button
        onClick={handleWishlistToggle}
        className="absolute right-6 top-6 z-10 rounded-full bg-background/80 p-2 text-muted-foreground hover:text-destructive hover:bg-background transition-all duration-300 cursor-pointer shadow-xs"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4.5 w-4.5 stroke-[1.5] ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
      </button>

      {/* Product Image Area */}
      <Link 
        href={`/products/${product._id}`} 
        className="block overflow-hidden aspect-[4/5] bg-secondary relative mb-4 rounded-xs"
      >
        {product.images?.[0] ? (
          <motion.img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs tracking-wider uppercase text-muted-foreground font-semibold">
            Aura Scents
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        {/* Brand */}
        <p className="text-[10px] text-accent uppercase tracking-widest mb-1 font-bold">{product.brand}</p>
        
        {/* Title */}
        <Link href={`/products/${product._id}`} className="block group-hover:text-accent transition-colors">
          <h3 className="text-md font-serif text-foreground leading-tight line-clamp-1 mb-2 font-medium">
            {product.name}
          </h3>
        </Link>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="ml-1 text-xs font-bold text-foreground">{product.ratings || 0}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">({product.numReviews || 0} reviews)</span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-3 border-t border-border/30">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-md font-bold text-foreground">${price.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground line-through font-medium">${regularPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-md font-bold text-foreground">${price.toFixed(2)}</span>
            )}
            {lowestVariant && activeVariants.length > 1 && (
              <span className="text-[9px] text-muted-foreground font-medium mt-0.5">{activeVariants.length} Sizes Available</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex items-center justify-center rounded-xs bg-primary p-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground transition-all duration-300 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
