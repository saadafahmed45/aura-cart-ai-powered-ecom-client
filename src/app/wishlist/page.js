'use client';

import Link from 'next/link';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export default function WishlistPage() {
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans">
      
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">YOUR REVERIE</span>
        <h1 className="text-4xl font-serif text-foreground font-light tracking-wide">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xs border border-border/40 max-w-lg mx-auto">
          <Heart className="h-10 w-10 text-accent/60 mx-auto mb-4 stroke-[1.2]" />
          <h3 className="text-lg font-serif font-bold text-foreground">Wishlist is empty</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed font-sans">
            You haven&apos;t saved any fragrances to your wishlist yet. Explore our olfactory catalog and mark your favorites.
          </p>
          <Link href="/products" className="mt-8 inline-flex items-center gap-2 rounded-xs bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer shadow-xs">
            Start Exploring <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;
            const hasDiscount = product.discountPrice > 0;

            return (
              <motion.div
                key={product._id}
                layout
                className="group relative flex flex-col overflow-hidden bg-card p-4 transition-all duration-300 border border-border/40 hover:border-accent/40 rounded-xs hover:shadow-xs"
              >
                {/* Remove from wishlist */}
                <button
                  onClick={() => toggleWishlist(product, false)}
                  className="absolute right-6 top-6 z-10 rounded-full bg-background/80 p-2 text-muted-foreground hover:text-destructive hover:bg-background transition-all duration-300 cursor-pointer shadow-xs"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4 stroke-[1.5]" />
                </button>

                <Link href={`/products/${product._id}`} className="block overflow-hidden aspect-[4/5] bg-secondary relative mb-4 rounded-xs">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs tracking-wider uppercase text-muted-foreground font-semibold">
                      Aura Scents
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-grow">
                  <span className="text-[10px] text-accent uppercase tracking-widest mb-1 font-bold">{product.brand}</span>
                  <Link href={`/products/${product._id}`} className="hover:text-accent transition-colors">
                    <h3 className="text-md font-serif text-foreground truncate mb-2 font-medium">{product.name}</h3>
                  </Link>

                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">In Stock</span>
                    ) : (
                      <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">Out of Stock</span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-3 border-t border-border/30">
                    <div className="flex flex-col">
                      {hasDiscount ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-md font-bold text-foreground">${product.discountPrice}</span>
                          <span className="text-xs text-muted-foreground line-through font-medium">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-md font-bold text-foreground">${product.price}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex items-center justify-center rounded-xs bg-primary p-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground transition-all duration-300 cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
