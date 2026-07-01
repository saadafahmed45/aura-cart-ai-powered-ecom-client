'use client';

import Link from 'next/link';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-foreground mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Wishlist is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
            You haven't saved any items to your wishlist yet. Explore our products and save your favorites!
          </p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;
            const hasDiscount = product.discountPrice > 0;

            return (
              <motion.div
                key={product._id}
                layout
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleWishlist(product, false)}
                  className="absolute right-5 top-5 z-10 rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-destructive cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <Link href={`/products/${product._id}`} className="block overflow-hidden rounded-lg aspect-square bg-muted relative mb-4">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-grow">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">{product.brand}</span>
                  <Link href={`/products/${product._id}`} className="hover:underline">
                    <h3 className="text-sm font-bold truncate text-foreground mt-1 mb-2">{product.name}</h3>
                  </Link>

                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <span className="text-xs text-emerald-500 font-bold">In Stock</span>
                    ) : (
                      <span className="text-xs text-destructive font-bold">Out of Stock</span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border">
                    <div className="flex flex-col">
                      {hasDiscount ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-foreground">${product.discountPrice}</span>
                          <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-foreground">${product.price}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground cursor-pointer"
                    >
                      <ShoppingCart className="h-3 w-3" /> Add
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
