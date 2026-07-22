'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Accordion, AccordionItem } from '../../../components/ui/Accordion';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ChevronRight
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
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)' });
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

  const activeVariants = product?.variants?.filter(v => v.active) || [];
  const currentVariant = activeVariants[selectedSizeIndex] || product?.variants?.[0];

  const handleIncrement = () => {
    if (currentVariant && quantity < currentVariant.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && currentVariant) {
      addToCart(product, currentVariant, quantity);
      showToast(`${product.name} (${currentVariant.size}) added to cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (product && currentVariant) {
      addToCart(product, currentVariant, quantity);
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

  // Magnifying Zoom Effect handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.pageXOffset) / width) * 100;
    const y = ((e.pageY - top - window.pageYOffset) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  if (productLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-[4/5] bg-muted rounded-xs"></div>
          <div className="flex flex-col gap-6">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 font-sans">
        <h2 className="text-2xl font-serif text-destructive tracking-wide">Fragrance Not Found</h2>
        <p className="text-muted-foreground text-xs mt-2 leading-relaxed">The fragrance you are trying to examine does not exist in our catalog.</p>
        <button onClick={() => router.push('/products')} className="mt-6 rounded-xs bg-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-accent transition-colors cursor-pointer">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Retrieve pricing logic
  const price = currentVariant 
    ? (currentVariant.salePrice > 0 && currentVariant.salePrice < currentVariant.price ? currentVariant.salePrice : currentVariant.price) 
    : 0;
  const regularPrice = currentVariant ? currentVariant.price : 0;
  const hasDiscount = currentVariant ? (currentVariant.salePrice > 0 && currentVariant.salePrice < currentVariant.price) : false;
  const discountPercent = hasDiscount 
    ? Math.round(((regularPrice - price) / regularPrice) * 100) 
    : 0;

  // Resolve active image (custom variant image overrides default slide index if set)
  const displayImage = (currentVariant?.image) ? currentVariant.image : (product.images?.[activeImage] || '');

  // Fragrance profile details
  const fragranceFamily = product.fragrance?.fragranceFamily || 'Olfactory Signature';
  const topNotesStr = product.fragrance?.topNotes?.join(', ') || 'Natural Citrus';
  const middleNotesStr = product.fragrance?.middleNotes?.join(', ') || 'Floral Essences';
  const baseNotesStr = product.fragrance?.baseNotes?.join(', ') || 'Oakmoss & Musks';
  const concentration = product.fragrance?.concentration || 'EDP';
  const gender = product.fragrance?.gender || 'Unisex';
  
  const seasonStr = product.fragrance?.season?.join(', ') || 'All Season';
  const occasionStr = product.fragrance?.occasion?.join(', ') || 'Daily Wear';

  const longevityVal = product.performance?.longevity || 80;
  const projectionVal = product.performance?.projection || 80;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground transition-colors">Collection</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
        
        {/* Gallery Section */}
        <div className="flex flex-col gap-4">
          <div 
            className="relative aspect-[4/5] overflow-hidden rounded-xs border border-border/40 bg-secondary cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {hasDiscount && (
              <span className="absolute left-4 top-4 z-10 rounded-xs bg-accent px-2 py-0.5 text-[9px] font-bold tracking-widest text-accent-foreground">
                -{discountPercent}% OFF
              </span>
            )}
            
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.name}
                style={zoomStyle}
                className="h-full w-full object-cover object-center transition-transform duration-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs tracking-wider uppercase text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && !currentVariant?.image && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[4/5] w-20 flex-shrink-0 overflow-hidden rounded-xs border bg-card cursor-pointer transition-all duration-300 ${activeImage === idx ? 'border-accent ring-1 ring-accent' : 'border-border/60 hover:border-foreground/20'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase & Attributes Section */}
        <div className="flex flex-col lg:sticky lg:top-28">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{product.brand}</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-foreground mb-4 tracking-wide leading-tight">{product.name}</h1>
          
          {/* Reviews Rating summary */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${idx < Math.round(product.ratings || 0) ? 'fill-amber-500 text-amber-500' : 'text-border'}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-foreground">{product.ratings || 0}</span>
            <span className="text-xs text-muted-foreground border-l border-border pl-2.5">({product.numReviews || 0} reviews)</span>
          </div>

          {/* Price & Stock info card */}
          <div className="mb-6 p-5 rounded-xs bg-secondary/50 border border-border/40 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Price</span>
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">${price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground line-through font-medium">${regularPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-foreground">${price.toFixed(2)}</span>
              )}
              {currentVariant?.sku && (
                <span className="text-[9px] text-muted-foreground font-semibold mt-1">SKU: {currentVariant.sku}</span>
              )}
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Status</span>
              {currentVariant && currentVariant.stock > 0 ? (
                <span className="text-xs font-bold text-emerald-600">In Stock ({currentVariant.stock} units)</span>
              ) : (
                <span className="text-xs font-bold text-destructive">Sold Out</span>
              )}
            </div>
          </div>

          {/* Short description text */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-sans">
            {product.shortDescription || product.fullDescription?.substring(0, 150) + '...'}
          </p>

          {/* Size Selector */}
          {activeVariants.length > 0 && (
            <div className="mb-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Bottle Volume</span>
              <div className="flex gap-2">
                {activeVariants.map((v, idx) => (
                  <button
                    key={v.size}
                    onClick={() => {
                      setSelectedSizeIndex(idx);
                      setQuantity(1);
                    }}
                    className={`px-4 py-2 text-xs font-bold border transition-all duration-300 rounded-xs cursor-pointer ${selectedSizeIndex === idx ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-foreground/30'}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {currentVariant && currentVariant.stock > 0 && (
            <div className="flex flex-col gap-4 border-t border-border/40 pt-6">
              
              {/* Quantity clickers */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-xs bg-card overflow-hidden">
                  <button onClick={handleDecrement} className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-foreground min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button onClick={handleIncrement} className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Buy buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </Button>
                
                <Button
                  onClick={handleBuyNow}
                  variant="accent"
                  className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2"
                >
                  Purchase Now
                </Button>

                <button
                  onClick={handleWishlistToggle}
                  className={`rounded-xs border border-border p-3 cursor-pointer transition-colors ${isWishlisted ? 'text-destructive bg-destructive/5 hover:bg-destructive/10' : 'text-muted-foreground bg-card hover:bg-secondary hover:text-foreground'}`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
                </button>
              </div>

            </div>
          )}

          {/* Quality checks */}
          <div className="grid grid-cols-3 gap-2 mt-8 border-t border-border/40 pt-6 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="h-4.5 w-4.5 stroke-[1.2] text-accent" />
              <span>Complimentary Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="h-4.5 w-4.5 stroke-[1.2] text-accent" />
              <span>Easy Return</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 stroke-[1.2] text-accent" />
              <span>COD Guarantee</span>
            </div>
          </div>

        </div>
      </div>

      {/* Fragrance Metrics & Notes Pyramid Section */}
      <section className="py-12 border-t border-border/40 mb-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Notes Pyramid */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-serif font-bold text-foreground tracking-wide flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-accent" /> Scent Profile ({fragranceFamily})
          </h3>

          <div className="flex flex-col gap-3 font-sans">
            <div className="border border-accent/20 bg-secondary/30 p-4 rounded-xs">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-1">Top Notes (First Impression)</span>
              <p className="text-xs text-foreground font-medium">{topNotesStr}</p>
            </div>
            <div className="border border-accent/30 bg-secondary/50 p-4 rounded-xs">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-1">Heart Notes (Core Theme)</span>
              <p className="text-xs text-foreground font-medium">{middleNotesStr}</p>
            </div>
            <div className="border border-primary/10 bg-secondary/70 p-4 rounded-xs">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-1">Base Notes (Anchoring Presence)</span>
              <p className="text-xs text-foreground font-medium">{baseNotesStr}</p>
            </div>
          </div>
        </div>

        {/* Longevity progress sliders */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-serif font-bold text-foreground tracking-wide">Olfactory Behavior</h3>
          
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-foreground">Scent Longevity</span>
                <span className="text-accent">{longevityVal}% ({longevityVal > 80 ? '10-12 Hours' : '6-8 Hours'})</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${longevityVal}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-foreground">Sillage Projection</span>
                <span className="text-accent">{projectionVal}% ({projectionVal > 80 ? 'Intense Presence' : 'Moderate Presence'})</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${projectionVal}%` }}></div>
              </div>
            </div>

            {/* Pills grid */}
            <div className="grid grid-cols-3 gap-3 text-center mt-2">
              <div className="rounded-xs bg-secondary/50 p-3 border border-border/30">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block mb-0.5">Season</span>
                <span className="text-xs font-bold text-foreground truncate block">{seasonStr}</span>
              </div>
              <div className="rounded-xs bg-secondary/50 p-3 border border-border/30">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block mb-0.5">Occasion</span>
                <span className="text-xs font-bold text-foreground truncate block">{occasionStr}</span>
              </div>
              <div className="rounded-xs bg-secondary/50 p-3 border border-border/30">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest block mb-0.5">Gender Focus</span>
                <span className="text-xs font-bold text-foreground truncate block">{gender}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs description and specs */}
      <div className="mb-20">
        <Tabs
          tabs={[
            {
              value: 'description',
              label: 'Composition Narrative',
              content: (
                <div className="prose max-w-none text-xs text-muted-foreground leading-relaxed py-4 font-sans space-y-4">
                  <p className="whitespace-pre-line">{product.fullDescription}</p>
                </div>
              )
            },
            {
              value: 'details',
              label: 'Fragrance Details',
              content: (
                <div className="max-w-md rounded-xs border border-border/40 bg-card p-5 mt-4">
                  <dl className="divide-y divide-border/40 text-foreground font-sans text-xs">
                    <div className="flex justify-between py-3">
                      <dt className="font-semibold text-muted-foreground">Perfumer Brand</dt>
                      <dd className="font-bold text-foreground text-right">{product.brand}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="font-semibold text-muted-foreground">Collection Class</dt>
                      <dd className="font-bold text-foreground text-right">{product.category?.name || 'Olfactory Scents'}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="font-semibold text-muted-foreground">Total Scent Volume</dt>
                      <dd className="font-bold text-foreground text-right">{currentVariant ? `${currentVariant.size} Bottle` : 'Complimentary set'}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="font-semibold text-muted-foreground">Concentration</dt>
                      <dd className="font-bold text-foreground text-right">{concentration}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="font-semibold text-muted-foreground">Country of Origin</dt>
                      <dd className="font-bold text-foreground text-right">France / USA raw assets</dd>
                    </div>
                  </dl>
                </div>
              )
            }
          ]}
          defaultTab="description"
        />
      </div>

      {/* Accordions for customer questions, returns, policies */}
      <div className="mb-20 max-w-3xl border-t border-border/40 pt-8">
        <h3 className="text-md font-bold uppercase tracking-widest text-foreground mb-6 font-sans">Customer Support Information</h3>
        <Accordion>
          <AccordionItem title="Olfactory Questions & Scent Maceration FAQ">
            <p>Our inspired and custom perfumes are formulated with high volume concentrations (20% - 25% fragrance compound extracts). We macerate each batch for an extended period. If you feel a scent profile smells slightly volatile initially, let the bottle sit in a dark, cool space for 5-7 days to complete maceration stability.</p>
          </AccordionItem>
          <AccordionItem title="Shipping, Dispatch & Packing Details">
            <p>We pack all perfume bottles in robust, shock-absorbent luxury cardboard cylinders to avoid transit breakages. Orders dispatch within 24-48 business hours with Flat Shipping rates. Cash on Delivery is verified via a quick phone validation before dispatch.</p>
          </AccordionItem>
          <AccordionItem title="Returns Policy & Refund Inquiries">
            <p>Due to personal hygiene and cosmetic policies, opened perfume bottles cannot be returned for full refunds. We recommend purchasing our **Discovery Set Samples** before committing to full 100ml perfume purchases. If you receive a damaged or leaking bottle, contact support immediately with photos for a prompt replacement.</p>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Customer Reviews panel */}
      <div className="mb-20 border-t border-border/40 pt-12">
        <h2 className="text-xl font-serif text-foreground mb-10 tracking-wide">
          Customer Testimony ({reviews?.length || 0})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Reviews list */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {reviewsLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-16 bg-muted rounded-xs"></div>
                <div className="h-16 bg-muted rounded-xs"></div>
              </div>
            ) : reviews?.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border/40 rounded-xs">
                <Sparkles className="h-8 w-8 text-muted-foreground/60 mx-auto mb-3 stroke-[1.2]" />
                <h4 className="font-bold text-foreground font-serif tracking-wide">No Reviews Yet</h4>
                <p className="text-xs text-muted-foreground mt-1">Be the first to share your thoughts on this scent.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {reviews?.map((review) => (
                  <div key={review._id} className="py-6 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">{review.user?.name}</span>
                      <span className="text-muted-foreground font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3.5 w-3.5 ${idx < review.rating ? 'fill-amber-500 text-amber-500' : 'text-border'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-sans">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add review form */}
          <div className="bg-card border border-border/40 p-6 rounded-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Write a Review</h3>
            
            {isAuthenticated ? (
              <form onSubmit={handleSubmit(onReviewSubmit)} className="flex flex-col gap-4">
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Rating</label>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValue('rating', star)}
                        className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`h-5 w-5 ${star <= selectedRating ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <span className="text-xs text-destructive">{errors.rating.message}</span>}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Comment</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us about the longevity, notes blend, sillage projection..."
                    {...register('comment')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                  {errors.comment && <span className="text-xs text-destructive">{errors.comment.message}</span>}
                </div>

                {reviewErrorMsg && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xs font-semibold">{reviewErrorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xs bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-accent transition-all duration-300 cursor-pointer"
                >
                  Submit Scent Review
                </button>

              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-muted-foreground font-medium">You must be logged in to review.</p>
                <button 
                  onClick={() => router.push('/login')} 
                  className="mt-4 rounded-xs bg-secondary text-foreground px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Related Products list */}
      <div className="border-t border-border/40 pt-16">
        <h2 className="text-2xl font-serif font-light tracking-wide text-foreground mb-8">Related Fragrances</h2>
        {relatedLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-xs bg-muted"></div>
            ))}
          </div>
        ) : relatedProducts?.length === 0 ? (
          <p className="text-xs text-muted-foreground font-medium">No related fragrances found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts?.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
