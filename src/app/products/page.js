'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/shop/ProductCard';
import { Drawer } from '../../components/ui/Drawer';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(searchParams.get('search') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(searchParams.get('category') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrand(searchParams.get('brand') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(searchParams.get('minPrice') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxPrice(searchParams.get('maxPrice') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRating(searchParams.get('rating') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSort(searchParams.get('sort') || 'latest');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(parseInt(searchParams.get('page')) || 1);
  }, [searchParams]);

  const { getProductsQuery } = useProducts();
  const { data: productData, isLoading: productsLoading, error: productsError } = getProductsQuery({
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort,
    page,
    limit: 9
  });

  const { getCategoriesQuery } = useCategories();
  const { data: categories } = getCategoriesQuery();

  const products = productData?.products || [];
  const brandsList = productData?.brands || [];
  const totalPages = productData?.pages || 1;
  const totalItems = productData?.total || 0;

  const applyFilters = (updatedFilters) => {
    const params = new URLSearchParams();
    
    const addParam = (key, val) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    };

    addParam('search', updatedFilters.search !== undefined ? updatedFilters.search : search);
    addParam('category', updatedFilters.category !== undefined ? updatedFilters.category : category);
    addParam('brand', updatedFilters.brand !== undefined ? updatedFilters.brand : brand);
    addParam('minPrice', updatedFilters.minPrice !== undefined ? updatedFilters.minPrice : minPrice);
    addParam('maxPrice', updatedFilters.maxPrice !== undefined ? updatedFilters.maxPrice : maxPrice);
    addParam('rating', updatedFilters.rating !== undefined ? updatedFilters.rating : rating);
    addParam('sort', updatedFilters.sort !== undefined ? updatedFilters.sort : sort);
    
    const newPage = updatedFilters.page !== undefined ? updatedFilters.page : 1;
    addParam('page', newPage);

    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSort('latest');
    setPage(1);
    router.push('/products');
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      applyFilters({ page: newPage });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Editorial Title Block */}
      <div className="text-center mb-16 max-w-xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">THE COLLECTION</span>
        <h1 className="text-4xl font-serif text-foreground tracking-wide font-light">Explore Aura Fragrances</h1>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          From signature extracts to customized blended formulas, explore our sensory library crafted for personal projection and presence.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 h-fit bg-card border border-border/40 p-6 rounded-xs">
          <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Filters</h3>
            <button 
              onClick={clearAllFilters} 
              className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-accent transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Search Catalog</label>
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
              className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
          </div>

          {/* Categories select list */}
          <div className="mb-6">
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Categories</label>
            <div className="flex flex-col gap-1.5 pl-1">
              <button
                onClick={() => applyFilters({ category: '' })}
                className={`text-left text-xs py-1 px-2 rounded-xs transition-colors cursor-pointer font-medium uppercase tracking-wider ${!category ? 'bg-secondary text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                All Scents
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => applyFilters({ category: cat.slug })}
                  className={`text-left text-xs py-1 px-2 rounded-xs transition-colors cursor-pointer font-medium uppercase tracking-wider truncate ${category === cat.slug ? 'bg-secondary text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Selection */}
          {brandsList.length > 0 && (
            <div className="mb-6">
              <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Perfume House</label>
              <select
                value={brand}
                onChange={(e) => applyFilters({ brand: e.target.value })}
                className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground cursor-pointer transition-colors"
              >
                <option value="">All Houses</option>
                {brandsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Filters */}
          <div className="mb-6">
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Price Limit</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xs border border-border bg-background px-2 py-1.5 text-xs focus:border-accent focus:outline-none text-foreground"
              />
              <span className="text-muted-foreground text-[10px]">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xs border border-border bg-background px-2 py-1.5 text-xs focus:border-accent focus:outline-none text-foreground"
              />
            </div>
            <button
              onClick={() => applyFilters({ minPrice, maxPrice })}
              className="w-full mt-3 rounded-xs bg-primary text-primary-foreground py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary/95 transition-all duration-300 cursor-pointer"
            >
              Filter
            </button>
          </div>

          {/* Rating Filters */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Minimum Rating</label>
            <div className="flex flex-col gap-1 pl-1">
              {[5, 4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => applyFilters({ rating: r.toString() })}
                  className={`text-left text-xs py-1 px-2 rounded-xs transition-colors cursor-pointer font-medium ${rating === r.toString() ? 'bg-secondary text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {r} Stars & Up
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content list area */}
        <div className="flex-1">
          
          {/* List header toolbar */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-8">
            <div>
              <p className="text-xs text-muted-foreground tracking-wider font-semibold uppercase">
                {totalItems} scents found
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-xs border border-border/80 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-secondary cursor-pointer text-foreground transition-all duration-300"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter By
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 border border-border/80 rounded-xs px-3 py-1.5 bg-card">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => applyFilters({ sort: e.target.value })}
                  className="bg-transparent text-xs font-bold uppercase tracking-wider text-foreground focus:outline-none border-none pr-4 cursor-pointer"
                >
                  <option value="latest">Newest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                  <option value="popular">Popularity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Tags list */}
          {(category || brand || minPrice || maxPrice || rating || search) && (
            <div className="flex flex-wrap gap-2 mb-8 items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Active:</span>
              
              {search && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xs bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Search: &ldquo;{search}&rdquo;
                  <button onClick={() => applyFilters({ search: '' })} className="hover:text-destructive cursor-pointer ml-1"><X className="h-3 w-3" /></button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xs bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Category: {category}
                  <button onClick={() => applyFilters({ category: '' })} className="hover:text-destructive cursor-pointer ml-1"><X className="h-3 w-3" /></button>
                </span>
              )}
              {brand && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xs bg-secondary px-2.5 py-1 text-foreground border border-border">
                  {brand}
                  <button onClick={() => applyFilters({ brand: '' })} className="hover:text-destructive cursor-pointer ml-1"><X className="h-3 w-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xs bg-secondary px-2.5 py-1 text-foreground border border-border">
                  ${minPrice || '0'} - ${maxPrice || '∞'}
                  <button onClick={() => applyFilters({ minPrice: '', maxPrice: '' })} className="hover:text-destructive cursor-pointer ml-1"><X className="h-3 w-3" /></button>
                </span>
              )}
              {rating && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xs bg-secondary px-2.5 py-1 text-foreground border border-border">
                  {rating} ★ & up
                  <button onClick={() => applyFilters({ rating: '' })} className="hover:text-destructive cursor-pointer ml-1"><X className="h-3 w-3" /></button>
                </span>
              )}

              <button onClick={clearAllFilters} className="text-[10px] font-bold uppercase tracking-wider text-destructive hover:underline ml-2 cursor-pointer">Clear All</button>
            </div>
          )}

          {/* Main Grid View */}
          {productsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-xs bg-muted"></div>
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xs">
              <p className="text-destructive text-sm font-semibold">Failed to fetch fragrance library. Please verify server connection.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xs border border-border/40 max-w-lg mx-auto">
              <Sparkles className="h-10 w-10 text-accent/60 mx-auto mb-4 stroke-[1.2]" />
              <h3 className="text-lg font-serif font-bold text-foreground">No Fragrances Found</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed">
                We couldn&apos;t find any scents matching your selection. Try adjusting your price boundaries, keyword search, or category selections.
              </p>
              <button 
                onClick={clearAllFilters} 
                className="mt-6 rounded-xs bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/95 transition-all duration-300 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Minimal Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-border/40">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center justify-center rounded-full border border-border bg-card p-2 text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center justify-center rounded-full border border-border bg-card p-2 text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Reusable Drawer for Mobile Filters */}
      <Drawer
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        title="Refine Collection"
        side="right"
      >
        <div className="flex flex-col gap-6 py-4">
          {/* Keyword Search */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Search Catalog</label>
            <input
              type="text"
              placeholder="Keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
              className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyFilters({ category: '' })}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${!category ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground bg-card hover:border-foreground'}`}
              >
                All
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => applyFilters({ category: cat.slug })}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${category === cat.slug ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground bg-card hover:border-foreground'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price bounds */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Price Limit</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xs border border-border bg-background px-2.5 py-1.5 text-xs focus:border-accent focus:outline-none text-foreground"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xs border border-border bg-background px-2.5 py-1.5 text-xs focus:border-accent focus:outline-none text-foreground"
              />
            </div>
            <button
              onClick={() => {
                applyFilters({ minPrice, maxPrice });
                setShowMobileFilters(false);
              }}
              className="w-full mt-3 rounded-xs bg-secondary text-foreground py-2 text-xs font-bold uppercase tracking-widest hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </div>

          {/* Rating */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Min Rating</label>
            <div className="grid grid-cols-2 gap-2">
              {[5, 4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    applyFilters({ rating: r.toString() });
                    setShowMobileFilters(false);
                  }}
                  className={`text-[10px] font-bold uppercase tracking-wider border rounded-xs py-2 text-center cursor-pointer transition-colors ${rating === r.toString() ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground bg-card'}`}
                >
                  {r} Stars +
                </button>
              ))}
            </div>
          </div>

          {/* Clear Button */}
          <div className="mt-8 pt-4 border-t border-border flex gap-4">
            <button
              onClick={() => {
                clearAllFilters();
                setShowMobileFilters(false);
              }}
              className="flex-1 rounded-xs border border-border py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </Drawer>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
        Loading olfactory collection...
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
