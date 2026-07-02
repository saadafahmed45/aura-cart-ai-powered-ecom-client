'use client';

import Link from 'next/link';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/shop/ProductCard';
import HeroSlider from '../components/shop/HeroSlider';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Home() {
  const { getProductsQuery } = useProducts();
  const { getCategoriesQuery } = useCategories();

  // Load products with limit 8
  const { data: productData, isLoading: productsLoading } = getProductsQuery({ limit: 8 });
  const { data: categories, isLoading: categoriesLoading } = getCategoriesQuery();

  const products = productData?.products || [];

  // Filter products for trending (rating > 4.5) and featured (discountPrice > 0)
  const featuredProducts = products.filter(p => p.discountPrice > 0).slice(0, 4);
  const trendingProducts = products.slice().sort((a, b) => (b.ratings || 0) - (a.ratings || 0)).slice(0, 4);

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      
      {/* 1. Dynamic Hero Slider */}
      <HeroSlider />

      {/* 2. Core Trust Badges */}
      <section className="border-y border-border bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Free Delivery</h4>
              <p className="text-xs text-muted-foreground">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">30-Day Returns</h4>
              <p className="text-xs text-muted-foreground">Easy returns and quick refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Secure Checkout</h4>
              <p className="text-xs text-muted-foreground">Pay with Cash on Delivery safely</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">4.8 Rating</h4>
              <p className="text-xs text-muted-foreground">Trusted by 10,000+ customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Shop by Category</h2>
              <p className="text-sm text-muted-foreground mt-1">Explore our diverse selections curated for your lifestyle.</p>
            </div>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 group-hover:underline">
                    Browse Catalog &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 px-6 py-12 shadow-xl sm:px-12 md:py-16 text-white text-center md:text-left grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Exclusive Reward</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Get 10% Off Your First Order</h2>
            <p className="text-sm text-indigo-200">
              Use code <span className="font-mono bg-indigo-900/40 px-2 py-0.5 rounded border border-indigo-500/30 font-semibold tracking-widest text-indigo-300">WELCOME10</span> at checkout to apply a special discount on your purchase.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link href="/products" className="rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-slate-100 transition-colors shadow-lg">
              Unlock Special Offer &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured Deals (Discounted) */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured Promotions</h2>
              <p className="text-sm text-muted-foreground mt-1">High-quality selections currently on discount.</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
              See all deals &rarr;
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                products.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* 6. Trending Products (Top Rated) */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Trending Best-Sellers</h2>
              <p className="text-sm text-muted-foreground mt-1">Customer favorites based on stellar reviews.</p>
            </div>
            <Link href="/products?sort=rating" className="text-sm font-semibold text-primary hover:underline">
              Sort by ratings &rarr;
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trendingProducts.length > 0 ? (
                trendingProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                products.slice(4, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* 7. Animated Customer Reviews Section */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-center text-foreground mb-12">
            Loved by Customers Globally
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm italic text-muted-foreground">
                "Outstanding sound detail! The active noise cancelling works like a charm. Delivery was extremely fast, and paying with COD made the transaction super convenient."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-semibold text-sm text-foreground">Mark Harrison</span>
                <span className="text-xs text-muted-foreground border-l border-border pl-3">Verified Buyer</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm italic text-muted-foreground">
                "The classic leather jacket is thick, authentic, and fits perfectly. Excellent customer support. I will definitely be purchasing from AuraCart again soon."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-semibold text-sm text-foreground">Sarah Sterling</span>
                <span className="text-xs text-muted-foreground border-l border-border pl-3">Verified Buyer</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm italic text-muted-foreground">
                "I ordered the mesh running shoes. Unbelievably lightweight and comfortable. Excellent grip on concrete. Excellent product quality for the price."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-semibold text-sm text-foreground">Danny K.</span>
                <span className="text-xs text-muted-foreground border-l border-border pl-3">Verified Buyer</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
