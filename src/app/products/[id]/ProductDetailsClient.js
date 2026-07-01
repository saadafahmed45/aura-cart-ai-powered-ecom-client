'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProducts } from '../../../hooks/useProducts';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../components/common/Toast';
import { reviewSchema } from '../../../validators/schemas';
import ProductCard from '../../../components/shop/ProductCard';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  MessageSquare
} from 'lucide-react';

export default function ProductDetailsClient({ id }) {
  const router = useRouter();
  const { getProductQuery, getRelatedProductsQuery, getProductReviewsQuery, submitReview } = useProducts();
  const { addToCart } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const { data: product, isLoading: productLoading, error: productError } = getProductQuery(id);
  const { data: relatedProducts, isLoading: relatedLoading } = getRelatedProductsQuery(id);
  const { data: reviews, isLoading: reviewsLoading } = getProductReviewsQuery(id);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  const isWishlisted = wishlistItems.some((item) => item._id === id);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: ''
    }
  });

  const selectedRating = watch('rating');

  const handleIncrement = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      showToast('Items added. Redirecting to checkout...', 'info');
      router.push('/checkout');
    }
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product, isAuthenticated);
    if (isWishlisted) {
      showToast('Removed from wishlist.', 'info');
    } else {
      showToast('Added to wishlist!', 'success');
    }
  };

  const onReviewSubmit = async (data) => {
    setReviewErrorMsg('');
    try {
      await submitReview({
        productId: id,
        rating: data.rating,
        comment: data.comment
      });
      showToast('Review submitted successfully for moderation!', 'success');
      reset();
    } catch (err) {
      setReviewErrorMsg(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (productLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-muted rounded-xl"></div>
          <div className="flex flex-col gap-6">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-destructive">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">The product you are trying to view does not exist or was deleted.</p>
        <button onClick={() => router.push('/products')} className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
          Back to Shop
        </button>
      </div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const specs = [
    { name: 'Brand', value: product.brand },
    { name: 'Category', value: product.category?.name || 'N/A' },
    { name: 'Availability', value: product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock' },
    { name: 'Item Weight', value: '1.2 lbs' },
    { name: 'Dimensions', value: '8.4 x 6.2 x 2.1 inches' },
    { name: 'Warranty', value: '1-Year Limited Manufacturer' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card">
            {hasDiscount && (
              <span className="absolute left-4 top-4 z-10 rounded bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground animate-pulse">
                -{discountPercent}% OFF
              </span>
            )}
            
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-card cursor-pointer transition-colors ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-foreground'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{product.brand}</span>
          <h1 className="text-3xl font-extrabold text-foreground mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4.5 w-4.5 ${idx < Math.round(product.ratings || 0) ? 'fill-amber-500 text-amber-500' : 'text-border'}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{product.ratings || 0}</span>
            <span className="text-sm text-muted-foreground border-l border-border pl-2">({product.numReviews || 0} customer reviews)</span>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1 font-semibold">Price:</span>
              {hasDiscount ? (
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-foreground">${product.discountPrice}</span>
                  <span className="text-sm text-muted-foreground line-through mb-0.5">${product.price}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-foreground">${product.price}</span>
              )}
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1 font-semibold">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-sm font-bold text-emerald-500">In Stock ({product.stock} left)</span>
              ) : (
                <span className="text-sm font-bold text-destructive">Out of Stock</span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          {product.stock > 0 && (
            <div className="flex flex-col gap-4 border-t border-border pt-6">
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                  <button onClick={handleDecrement} className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-foreground min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button onClick={handleIncrement} className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
                >
                  Buy It Now
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`rounded-lg border border-border p-3 cursor-pointer ${isWishlisted ? 'text-destructive bg-destructive/5 hover:bg-destructive/10' : 'text-muted-foreground bg-card hover:bg-secondary hover:text-foreground'}`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
                </button>
              </div>

            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-primary" />
              <span>Flat Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-4 w-4 text-primary" />
              <span>Easy Return</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>COD Guarantee</span>
            </div>
          </div>

        </div>
      </div>

      <div className="mb-16 border-t border-border pt-8">
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeTab === 'description' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeTab === 'specifications' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Specifications
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="prose max-w-none text-sm text-muted-foreground leading-relaxed">
            <p className="mb-4">{product.description}</p>
            <p>Our premium goods are designed with high longevity standards in mind. Handcrafted, curated, and validated under high compliance environments. Shop AuraCart for the ultimate purchase security.</p>
          </div>
        ) : (
          <div className="max-w-md rounded-xl border border-border bg-card p-4 shadow-sm">
            <dl className="divide-y divide-border text-foreground bg-card">
              {specs.map((spec) => (
                <div key={spec.name} className="flex justify-between py-2.5 text-sm">
                  <dt className="font-semibold text-muted-foreground">{spec.name}</dt>
                  <dd className="font-bold text-foreground text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      <div className="mb-16 border-t border-border pt-8">
        <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary animate-pulse" /> Customer Reviews ({reviews?.length || 0})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            {reviewsLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ) : reviews?.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-bold text-foreground">No Reviews Yet</h4>
                <p className="text-xs text-muted-foreground mt-1">Be the first to share your thoughts on this product.</p>
              </div>
            ) : (
              reviews?.map((review) => (
                <div key={review._id} className="border-b border-border/60 pb-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{review.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${idx < review.rating ? 'fill-amber-500 text-amber-500' : 'text-border'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Write a Review</h3>
            
            {isAuthenticated ? (
              <form onSubmit={handleSubmit(onReviewSubmit)} className="flex flex-col gap-4">
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Rating</label>
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValue('rating', star)}
                        className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`h-6 w-6 ${star <= selectedRating ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <span className="text-xs text-destructive">{errors.rating.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Comment</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us what you liked or disliked about this product..."
                    {...register('comment')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {errors.comment && <span className="text-xs text-destructive">{errors.comment.message}</span>}
                </div>

                {reviewErrorMsg && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg font-semibold">{reviewErrorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Submit Review
                </button>

              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">You must be logged in to leave a review.</p>
                <button onClick={() => router.push('/login')} className="mt-3 rounded-md bg-secondary text-foreground px-4 py-2 text-xs font-bold hover:bg-secondary/80 transition-colors cursor-pointer">
                  Sign In
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="border-t border-border pt-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">Related Products</h2>
        {relatedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted"></div>
            ))}
          </div>
        ) : relatedProducts?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No related products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts?.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
