'use client';

import Link from 'next/link';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/shop/ProductCard';
import HeroSlider from '../components/shop/HeroSlider';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Flame, Compass, Heart } from 'lucide-react';

const FRAGRANCE_NOTES = [
  {
    name: 'Citrus',
    tagline: 'Fresh & Vibrant',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop',
    query: '/products?search=citrus'
  },
  {
    name: 'Woody',
    tagline: 'Earth & Warmth',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop',
    query: '/products?search=wood'
  },
  {
    name: 'Floral',
    tagline: 'Sweet & Exquisite',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop',
    query: '/products?search=rose'
  },
  {
    name: 'Spicy',
    tagline: 'Sensual & Intense',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&auto=format&fit=crop',
    query: '/products?search=saffron'
  }
];

export default function Home() {
  const { getProductsQuery } = useProducts();
  const { getCategoriesQuery } = useCategories();

  // Load products with limit 10
  const { data: productData, isLoading: productsLoading } = getProductsQuery({ limit: 10 });
  const { data: categories, isLoading: categoriesLoading } = getCategoriesQuery();

  const products = productData?.products || [];

  // Filter products for New Arrivals (latest products) and Best Sellers (highest rating)
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice().sort((a, b) => (b.ratings || 0) - (a.ratings || 0)).slice(0, 4);
  const signatureScents = products.filter(p => p.brand === 'Aura Signature').slice(0, 4);

  return (
    <div className="w-full flex flex-col min-h-screen bg-background font-sans">
      
      {/* 1. Luxury Hero Slider */}
      <HeroSlider />

      {/* 2. Brand Intro Text Block (Whitespace rich) */}
      <section className="py-24 text-center max-w-4xl mx-auto px-4">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4 block"
        >
          OUR PHILOSOPHY
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground font-light leading-snug tracking-wide"
        >
          A scent is a portal to presence. We blend exquisite raw ingredients into timeless olfactory creations designed to linger in the memory.
        </motion.h2>
        <div className="h-0.5 w-12 bg-accent/40 mx-auto mt-8"></div>
      </section>

      {/* 3. Shop By Fragrance Notes (Visual category grid) */}
      <section className="py-16 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">FRAGRANCE FAMILIES</span>
            <h2 className="text-3xl font-serif text-foreground font-medium tracking-wide">Shop by Fragrance Notes</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FRAGRANCE_NOTES.map((note) => (
              <Link
                key={note.name}
                href={note.query}
                className="group relative flex flex-col items-center justify-end overflow-hidden aspect-[3/4] rounded-xs bg-secondary"
              >
                {/* Background image hover zoom */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 z-10 transition-all duration-500" />
                <img
                  src={note.image}
                  alt={note.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Content */}
                <div className="relative z-20 text-center pb-8 px-4 text-white">
                  <h3 className="text-xl font-serif tracking-wide mb-1">{note.name}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-accent-foreground opacity-90 group-hover:underline">
                    {note.tagline} &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Collections (Mega row) */}
      <section className="py-16 bg-secondary/35 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">CURATED SELECTIONS</span>
              <h2 className="text-2xl font-serif text-foreground tracking-wide">Featured Collections</h2>
            </div>
            <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-accent transition-colors">
              Browse All Collections &rarr;
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xs bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories?.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col items-center justify-end overflow-hidden aspect-[3/4] rounded-xs bg-secondary"
                >
                  {/* Dark backdrop overlay */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 z-10 transition-all duration-500" />
                  
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center font-serif text-lg text-accent uppercase tracking-widest">
                      Aura Scents
                    </div>
                  )}
                  
                  {/* Content overlay */}
                  <div className="relative z-20 text-center pb-8 px-4 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent mb-1 block">
                      Curated Selection
                    </span>
                    <h3 className="text-lg font-serif tracking-wide mb-1.5">{cat.name}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-accent-foreground opacity-90 group-hover:underline">
                      Explore Scents &rarr;
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Custom Perfume Banner (Bespoke scent design callout) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-xs bg-card border border-border/40 px-6 py-16 shadow-xs sm:px-12 md:py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          
          <div className="floating-bottle flex justify-center md:order-last">
            <img 
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop" 
              alt="Custom blending kit"
              className="max-w-[280px] rounded-xs aspect-square object-cover shadow-sm border border-border/60"
            />
          </div>

          <div className="flex flex-col gap-5 items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">BESPOKE EXPERIENCE</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-tight tracking-wide">
              Create Your Signature Fragrance
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-md font-sans">
              Our Custom Perfume Blending Kit brings the master perfumer's organ to your home. Experiment with premium essential base oils, middle accords, and top highlights to craft a scent that is uniquely yours.
            </p>
            <Link 
              href="/products?category=custom-perfumes" 
              className="mt-2 inline-flex justify-center rounded-xs bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm"
            >
              Order Custom Blend Kit
            </Link>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals (Clean 4-column product grid) */}
      <section className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">LATEST RELEASES</span>
              <h2 className="text-2xl font-serif text-foreground tracking-wide">New Arrivals</h2>
            </div>
            <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-accent transition-colors">
              Shop All Scents &rarr;
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-xs bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Limited Edition / Grand Reserve Callout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative overflow-hidden rounded-xs bg-secondary py-16 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex flex-col gap-5 items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">LIMITED EDITION</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-tight tracking-wide">
              Aura Grand Reserve
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground font-sans max-w-md">
              A masterwork composition. Formulated in micro-batches with high-grade ambergris, wild saffron, and Bulgarian rose oil. Individually numbered bottles for the ultimate connoisseur.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-foreground">
              <span className="font-serif text-xl">$250</span>
              <span className="text-[9px] uppercase tracking-widest bg-accent px-2 py-0.5 text-accent-foreground">Only 8 bottles left</span>
            </div>
            <Link 
              href="/products" 
              className="mt-2 inline-flex justify-center rounded-xs bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm"
            >
              Secure a Bottle
            </Link>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop" 
              alt="Grand Reserve Bottle"
              className="max-h-[380px] rounded-xs object-cover shadow-md border border-border"
            />
          </div>
        </div>
      </section>

      {/* 8. Best Sellers (Trending products) */}
      <section className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">HOUSE FAVORITES</span>
              <h2 className="text-2xl font-serif text-foreground tracking-wide">Best Selling Scents</h2>
            </div>
            <Link href="/products?sort=rating" className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-accent transition-colors">
              Sort by Popularity &rarr;
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-xs bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 9. Luxury Experience Section (Why Choose Aura) */}
      <section className="py-24 bg-card border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-3">AURA QUALITY</span>
          <h2 className="text-3xl font-serif text-foreground tracking-wide mb-16">The Olfactory Excellence</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col gap-4">
              <Compass className="h-6 w-6 stroke-[1.2] text-accent" />
              <h3 className="text-lg font-serif text-foreground">Natural Essences</h3>
              <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                We select raw, organic essential oils from ethical producers worldwide, ensuring the scent profile is authentic and free from synthetic overtones.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Flame className="h-6 w-6 stroke-[1.2] text-accent" />
              <h3 className="text-lg font-serif text-foreground">Aged Maceration</h3>
              <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                Each batch undergoes an extended 8-week aging and maceration process. This merges top highlights with heavy base anchors to build complex notes.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <ShieldCheck className="h-6 w-6 stroke-[1.2] text-accent" />
              <h3 className="text-lg font-serif text-foreground">Timeless Longevity</h3>
              <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                Concentrated at Extraits and high Eau de Parfum volume levels. Our fragrances remain present on skin and apparel for over 12 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Customer Reviews */}
      <section className="py-20 bg-secondary/35 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-3">TESTIMONIALS</span>
          <h2 className="text-2xl font-serif text-foreground tracking-wide mb-12">Loved by Scent Lovers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col justify-between items-center rounded-xs bg-card p-8 border border-border/30 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-center text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-xs italic leading-relaxed text-muted-foreground font-sans mb-6">
                "No. 33 Santal Aura smells absolutely spectacular. It matches the original perfectly, but has a softer, smoother woody transition. I get compliments every single day."
              </p>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Mark Harrison</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Verified Buyer</p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center rounded-xs bg-card p-8 border border-border/30 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-center text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-xs italic leading-relaxed text-muted-foreground font-sans mb-6">
                "The Custom Blend Kit was a fantastic experience. Blending notes myself felt like craft art. The raw base oils are extremely high purity. A gorgeous gift item."
              </p>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Sarah Sterling</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Verified Buyer</p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center rounded-xs bg-card p-8 border border-border/30 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-center text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-xs italic leading-relaxed text-muted-foreground font-sans mb-6">
                "Lost Cherry Blossom is decadent, rich, and lasts forever on clothes. The almond and sweet cherry notes are so authentic. Aura is now my go-to fragrance house."
              </p>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Danny K.</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Instagram Gallery (Aesthetic fragrance imagery) */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-3">INSTAGRAM DIARY</span>
          <h2 className="text-2xl font-serif text-foreground tracking-wide mb-10">Follow Our Presence</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-secondary overflow-hidden rounded-xs border border-border/20">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop" 
                alt="Aura aesthetics" 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-103"
              />
            </div>
            <div className="aspect-square bg-secondary overflow-hidden rounded-xs border border-border/20">
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop" 
                alt="Aura ingredients" 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-103"
              />
            </div>
            <div className="aspect-square bg-secondary overflow-hidden rounded-xs border border-border/20">
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop" 
                alt="Aura bottles" 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-103"
              />
            </div>
            <div className="aspect-square bg-secondary overflow-hidden rounded-xs border border-border/20">
              <img 
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop" 
                alt="Aura experience" 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-103"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
