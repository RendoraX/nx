// apps/web/app/shop/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProduct';
import { SearchBar } from '@/components/shop/search-bar';
import { ProductFilter } from '@/components/shop/product-filter';
import { ProductSort } from '@/components/shop/product-sort';
import { ProductCard } from '@/components/shop/product-card';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { EmptyProducts } from '@/components/shop/empty-products';
import { Pagination } from '@/components/shop/pagination';
import { SlidersHorizontal, RefreshCw, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query parameters cleanly as your initial state setup
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('categoryId') || undefined;
  const urlSort = (searchParams.get('sort') as any) || 'newest';
  const urlMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const urlMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 2000;
  const urlPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // React Component Local State Hooks
  const [search, setSearch] = useState(urlSearch);
  const [categoryId, setCategoryId] = useState<string | undefined>(urlCategory);
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>(urlSort);
  const [priceRange, setPriceRange] = useState({ min: urlMinPrice, max: urlMaxPrice });
  const [page, setPage] = useState(urlPage);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const limit = 20;

  // Sync internal state directly if the browser navigation URL changes externally
  useEffect(() => {
    setSearch(urlSearch);
    setCategoryId(urlCategory);
    setSort(urlSort);
    setPriceRange({ min: urlMinPrice, max: urlMaxPrice });
    setPage(urlPage);
  }, [urlSearch, urlCategory, urlSort, urlMinPrice, urlMaxPrice, urlPage]);

  // Central Router Sync Matrix helper to safely maintain browse history and parameters
  const updateUrlParams = (updates: {
    search?: string;
    categoryId?: string | null;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
  }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    router.push(`/products?${current.toString()}`);
  };

  // React Query Hook utilizing your dynamic state variables
  const { data, isLoading, isError, refetch } = useProducts({
    page,
    limit,
    search: search || undefined,
    categoryId: categoryId || undefined,
    sort,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId(undefined);
    setSort('newest');
    setPriceRange({ min: 0, max: 2000 });
    setPage(1);
    router.push('/shop');
  };

  console.log(data?.products);

  if (isError) {
    return (
      <div className="w-full min-h-[80vh] bg-[#FCFAF7] antialiased flex flex-col items-center justify-center text-[#2B2B2B] px-4 py-12 selection:bg-[#1F5E3B]/10">
        <div className="w-14 h-14 rounded-none bg-white border border-[#EAE3D2] text-[#7C7467] flex items-center justify-center mb-6 shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin stroke-[1.25] text-[#C89B3C]" />
        </div>
        <div className="space-y-3 text-center mb-8 max-w-md">
          <h3 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#2B2B2B]">Connection Interrupted</h3>
          <p className="text-xs sm:text-sm text-[#7C7467] font-light leading-relaxed">
            An unexpected issue occurred while updating the products catalog storefront.
          </p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="h-12 px-8 border border-[#1F5E3B] text-[#FCFAF7] bg-[#1F5E3B] text-[11px] font-mono font-medium uppercase tracking-[0.25em] hover:bg-[#154128] transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FCFAF7] overflow-x-hidden antialiased flex flex-col text-[#2B2B2B] selection:bg-[#1F5E3B]/10 relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-[#C89B3C]/5 via-[#1F5E3B]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* REBRANDED HERO INTRO BANNER BLOCK */}
      <section className="w-full bg-white border-b border-[#EAE3D2] py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 relative z-10 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 text-left">
          <div className="inline-flex items-center gap-2 bg-[#FCFAF7] border border-[#EAE3D2] px-3.5 py-1.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#1F5E3B] shadow-2xs">
            <ShoppingBag className="h-3 w-3 text-[#C89B3C]" /> Store Catalog Open
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B2B2B] tracking-tight leading-[1.15]">
            Our Online <span className="font-serif italic text-[#1F5E3B]">Product Shop</span>
          </h1>
          <p className="text-[#7C7467] text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Browse through our selected batch items, natural organic goods, and essential daily collections cataloged transparently for direct home shopping verification.
          </p>
        </div>
      </section>
      
      {/* BREADCRUMB COMPONENT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#A39785]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span onClick={() => router.push('/')} className="cursor-pointer hover:text-[#1F5E3B] transition-colors duration-300">Home</span>
          <ChevronRight className="w-3 h-3 text-[#EAE3D2] shrink-0" />
          <span className="text-[#2B2B2B] font-semibold shrink-0">Shop Catalog</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[#C89B3C]" />
          <span className="font-light text-[#7C7467] tracking-normal text-xs font-mono">
            Showing {data?.products?.length || 0} items
          </span>
        </div>
      </div>

      {/* MAIN LAYOUT APP GRID */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start overflow-visible">
        
        {/* SIDEBAR FILTERS ACCORDION LAYOUT */}
        <aside className={`w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-8 transition-all duration-500 z-30 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border border-[#EAE3D2] p-5 sm:p-6 shadow-2xs">
            <ProductFilter
              facets={data?.filters}
              selectedCategory={categoryId}
              selectedPriceRange={priceRange}
              onCategoryChange={(cat) => {
                setCategoryId(cat);
                setPage(1);
                updateUrlParams({ categoryId: cat, page: 1 });
              }}
              onPriceChange={(min, max) => {
                setPriceRange({ min, max });
                setPage(1);
                updateUrlParams({ minPrice: min, maxPrice: max, page: 1 });
              }}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* MAIN PRODUCT CATALOG CONTROL PANEL CONTAINER */}
        <main className="flex-1 space-y-8 w-full overflow-visible">
          
          {/* SEARCHBAR AND SORT DROPDOWN BAR */}
          <div className="w-full bg-white border border-[#EAE3D2] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xs">
            <div className="w-full sm:max-w-md">
              <SearchBar 
                value={search} 
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                  updateUrlParams({ search: val, page: 1 });
                }} 
                onClear={() => {
                  setSearch('');
                  updateUrlParams({ search: '', page: 1 });
                }} 
              />
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="inline-flex lg:hidden items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-[#2B2B2B] border border-[#EAE3D2] px-4 py-2.5 bg-[#FCFAF7] hover:border-[#1F5E3B] transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5] text-[#1F5E3B]" />
                <span>{isMobileFilterOpen ? 'Hide Filters' : 'Filter Items'}</span>
              </button>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <ProductSort 
                  currentSort={sort} 
                  onSortChange={(val) => {
                    setSort(val);
                    updateUrlParams({ sort: val });
                  }} 
                  totalItems={data?.products?.length || 0} 
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC RESULTS LIST CONTAINER GRID */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-[#EAE3D2] p-4 sm:p-5 shadow-2xs">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full overflow-visible">
              {data.products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white border border-[#EAE3D2] hover:border-[#1F5E3B] p-4 sm:p-5 transition-all duration-300 overflow-visible flex flex-col relative group shadow-2xs hover:shadow-md"
                >
                  <ProductCard 
                    product={{
                      ...product,
                      variants: product.variants || []
                    }} 
                    onAddToCart={(id) => console.log(`Item successfully added to your cart: ${id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full bg-white border border-[#EAE3D2] p-12 sm:p-20 text-center shadow-2xs">
              <EmptyProducts onClearFilters={handleResetFilters} />
            </div>
          )}

          {/* CATALOG PAGINATION MODULE CONTROLLER */}
          {data?.pagination && (
            <div className="w-full pt-8 flex justify-center border-t border-[#EAE3D2]/60">
              <div className="bg-white border border-[#EAE3D2] px-6 py-3 shadow-2xs">
                <Pagination 
                  meta={data.pagination} 
                  onPageChange={(p) => {
                    setPage(p);
                    updateUrlParams({ page: p });
                  }} 
                />
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}