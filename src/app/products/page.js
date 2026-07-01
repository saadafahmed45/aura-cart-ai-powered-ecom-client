'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/shop/ProductCard';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '');
    setSort(searchParams.get('sort') || 'latest');
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        <aside className="hidden md:block w-64 shrink-0 bg-card border border-border p-6 rounded-xl h-fit">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <h3 className="font-bold text-foreground">Filters</h3>
            <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              Reset Filters
            </button>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Search</label>
            <input
              type="text"
              placeholder="Keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:border-ring focus:outline-none text-foreground"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Categories</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => applyFilters({ category: '' })}
                className={`text-left text-sm py-1 px-2 rounded transition-colors cursor-pointer ${!category ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => applyFilters({ category: cat.slug })}
                  className={`text-left text-sm py-1 px-2 rounded transition-colors cursor-pointer truncate ${category === cat.slug ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {brandsList.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Brands</label>
              <select
                value={brand}
                onChange={(e) => applyFilters({ brand: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:border-ring focus:outline-none text-foreground cursor-pointer"
              >
                <option value="">All Brands</option>
                {brandsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Price Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:border-ring focus:outline-none text-foreground"
              />
              <span className="text-muted-foreground text-xs">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:border-ring focus:outline-none text-foreground"
              />
            </div>
            <button
              onClick={() => applyFilters({ minPrice, maxPrice })}
              className="w-full mt-3 rounded-md bg-secondary text-foreground py-1 text-xs font-bold hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Min Rating</label>
            <div className="flex flex-col gap-1.5">
              {[5, 4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => applyFilters({ rating: r.toString() })}
                  className={`text-left text-sm py-1 px-2 rounded transition-colors cursor-pointer ${rating === r.toString() ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  {r} Stars & Up
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">All Products</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{totalItems} results found</p>
            </div>
            
            <div className="flex items-center gap-2">
              
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary cursor-pointer text-foreground"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>

              <div className="flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 bg-background">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => applyFilters({ sort: e.target.value })}
                  className="bg-transparent text-sm font-medium text-foreground focus:outline-none border-none pr-4 cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="popular">Popular</option>
                </select>
              </div>

            </div>
          </div>

          {(category || brand || minPrice || maxPrice || rating || search) && (
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Active Filters:</span>
              
              {search && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Search: "{search}"
                  <button onClick={() => applyFilters({ search: '' })} className="hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Category: {category}
                  <button onClick={() => applyFilters({ category: '' })} className="hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                </span>
              )}
              {brand && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Brand: {brand}
                  <button onClick={() => applyFilters({ brand: '' })} className="hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                  <button onClick={() => applyFilters({ minPrice: '', maxPrice: '' })} className="hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                </span>
              )}
              {rating && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-secondary px-2.5 py-1 text-foreground border border-border">
                  Rating: {rating} ★ & up
                  <button onClick={() => applyFilters({ rating: '' })} className="hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                </span>
              )}

              <button onClick={clearAllFilters} className="text-xs font-bold text-destructive hover:underline ml-2 cursor-pointer">Clear All</button>
            </div>
          )}

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted p-4 flex flex-col justify-end">
                  <div className="h-4 bg-background/50 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-background/50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-destructive font-semibold">Failed to load products. Please check server connection.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                We couldn't find any products matching your current filters. Try resetting them or adjusting your search term.
              </p>
              <button onClick={clearAllFilters} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-border/40">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            ></motion.div>

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-full bg-card p-6 shadow-xl border-l border-border h-full flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <h3 className="font-bold text-foreground">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="rounded-md p-1 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:border-ring text-foreground"
                />
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyFilters({ category: '' })}
                    className={`text-xs py-1.5 px-3 rounded-full border transition-all cursor-pointer ${!category ? 'bg-primary text-primary-foreground border-primary font-bold' : 'border-border text-muted-foreground bg-card hover:border-foreground'}`}
                  >
                    All
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => applyFilters({ category: cat.slug })}
                      className={`text-xs py-1.5 px-3 rounded-full border transition-all truncate max-w-[120px] cursor-pointer ${category === cat.slug ? 'bg-primary text-primary-foreground border-primary font-bold' : 'border-border text-muted-foreground bg-card hover:border-foreground'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Price Range</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:border-ring text-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:border-ring text-foreground"
                  />
                </div>
                <button
                  onClick={() => {
                    applyFilters({ minPrice, maxPrice });
                    setShowMobileFilters(false);
                  }}
                  className="w-full mt-3 rounded-md bg-secondary text-foreground py-1.5 text-xs font-bold hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  Apply Price
                </button>
              </div>

              <div className="mb-8">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Min Rating</label>
                <div className="grid grid-cols-2 gap-2">
                  {[5, 4, 3, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        applyFilters({ rating: r.toString() });
                        setShowMobileFilters(false);
                      }}
                      className={`text-xs border rounded-md py-1.5 transition-all text-center cursor-pointer ${rating === r.toString() ? 'bg-primary text-primary-foreground border-primary font-bold' : 'border-border text-muted-foreground bg-card'}`}
                    >
                      {r} Stars +
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex gap-4">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 rounded-md border border-border py-2 text-center text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear All
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs text-muted-foreground animate-pulse">
        Loading product catalog...
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
