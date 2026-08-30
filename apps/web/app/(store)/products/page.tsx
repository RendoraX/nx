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
import { SlidersHorizontal, RefreshCw, ShoppingBag, ChevronRight, Sparkles, X } from 'lucide-react';

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

    router.push(`/shop?${current.toString()}`);
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


 

  if (isError) {
    return (
      <div className="w-full min-h-[80vh] bg-[#FCFAF7] antialiased flex flex-col items-center justify-center text-[#2B2B2B] px-4 py-12 selection:bg-[#1F5E3B]/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1F5E3B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center max-w-md w-full bg-white/80 backdrop-blur-md border border-[#EAE3D2] p-6 sm:p-10 text-center shadow-lg rounded-xs">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FCFAF7] border border-[#EAE3D2] text-[#7C7467] flex items-center justify-center mb-5 sm:mb-6 shadow-xs rounded-xs group">
            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] text-[#C89B3C] group-hover:rotate-180 transition-transform duration-700 ease-out" />
          </div>
          <div className="space-y-2 mb-6 sm:mb-8">
            <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#C89B3C] bg-[#C89B3C]/10 px-2.5 py-1 rounded-2xs">
              System Alert
            </span>
            <h3 className="text-sm sm:text-base font-serif text-[#2B2B2B] font-medium pt-1">Connection Interrupted</h3>
            <p className="text-xs text-[#7C7467] font-light leading-relaxed">
              An unexpected issue occurred while loading the storefront catalog. Please refresh to try again.
            </p>
          </div>
          <button 
            onClick={() => refetch()} 
            className="w-full h-11 border border-[#1F5E3B] text-[#FCFAF7] bg-[#1F5E3B] text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] hover:bg-[#154128] hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer rounded-2xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FCFAF7] overflow-x-hidden antialiased flex flex-col text-[#2B2B2B] selection:bg-[#1F5E3B]/10 relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-b from-[#C89B3C]/8 via-[#1F5E3B]/5 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* HERO SECTION */}
      <section className="w-full bg-white/70 backdrop-blur-md border-b border-[#EAE3D2] py-8 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 text-left">
          <div className="inline-flex items-center gap-2 bg-[#FCFAF7] border border-[#EAE3D2] px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#1F5E3B] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E3B] animate-ping" />
            <ShoppingBag className="h-3 w-3 text-[#C89B3C]" /> Store Catalog Open
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
            <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl font-normal text-[#2B2B2B] tracking-tight leading-[1.1]">
              Our Online <span className="font-serif italic text-[#1F5E3B] underline decoration-[#C89B3C]/40 underline-offset-4 sm:underline-offset-8">Product Shop</span>
            </h1>
            <p className="text-[#7C7467] text-xs sm:text-sm max-w-xl leading-relaxed font-light">
              Browse through our selected batch items, natural organic goods, and essential daily collections cataloged transparently.
            </p>
          </div>
        </div>
      </section>
      
      {/* BREADCRUMB BAR */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em]">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 text-[#A39785]">
          <span 
            onClick={() => router.push('/')} 
            className="cursor-pointer hover:text-[#1F5E3B] transition-colors duration-200 shrink-0"
          >
            Home
          </span>
          <ChevronRight className="w-3 h-3 text-[#EAE3D2] shrink-0" />
          <span className="text-[#2B2B2B] font-semibold shrink-0 bg-[#EAE3D2]/30 px-2 py-0.5 rounded-2xs">
            Shop Catalog
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 border border-[#EAE3D2] px-2.5 sm:px-3 py-1 rounded-full shadow-2xs shrink-0">
          <Sparkles className="w-3 h-3 text-[#C89B3C]" />
          <span className="font-light text-[#7C7467] tracking-normal text-[11px] font-mono">
            <strong className="text-[#1F5E3B] font-semibold">{data?.products?.length || 0}</strong> Items
          </span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-16 sm:pb-20 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        
        {/* DESKTOP SIDEBAR & MOBILE SLIDE-OVER DRAWER */}
        <aside className={`
          fixed lg:relative inset-0 z-50 lg:z-30 lg:block
          ${isMobileFilterOpen ? 'flex' : 'hidden'}
          lg:w-72 flex-shrink-0 lg:sticky lg:top-8 transition-all duration-300
        `}>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-[#2B2B2B]/50 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-[85%] max-w-xs sm:max-w-sm lg:max-w-none bg-white border-l lg:border border-[#EAE3D2] p-5 sm:p-6 shadow-2xl lg:shadow-2xs rounded-none sm:rounded-xs h-full lg:h-auto overflow-y-auto lg:overflow-visible ml-auto lg:ml-0 z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE3D2] lg:hidden">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#1F5E3B]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#2B2B2B]">
                    Filter Options
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-[#7C7467] hover:text-[#2B2B2B] bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xs active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ProductFilter
                facets={data?.filters}
                selectedCategory={categoryId}
                selectedPriceRange={priceRange}
                onCategoryChange={(cat) => {
                  setCategoryId(cat);
                  setPage(1);
                  updateUrlParams({ categoryId: cat, page: 1 });
                  setIsMobileFilterOpen(false);
                }}
                onPriceChange={(min, max) => {
                  setPriceRange({ min, max });
                  setPage(1);
                  updateUrlParams({ minPrice: min, maxPrice: max, page: 1 });
                }}
                onReset={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        </aside>

        {/* MAIN CATALOG GRID & CONTROLS */}
        <main className="flex-1 space-y-4 sm:space-y-6 w-full">
          
          {/* SEARCHBAR AND SORT BAR */}
          <div className="w-full bg-white border border-[#EAE3D2] p-3 sm:p-4 rounded-2xs sm:rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-2xs">
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
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="inline-flex lg:hidden items-center justify-center gap-1.5 text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-[#2B2B2B] border border-[#EAE3D2] px-3 py-2.5 bg-[#FCFAF7] hover:border-[#1F5E3B] transition-all rounded-2xs cursor-pointer active:scale-95 shadow-2xs shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5] text-[#1F5E3B]" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
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

          {/* MOBILE 2-COLUMN GRID / DESKTOP 3-COLUMN GRID */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 w-full">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-[#EAE3D2] p-2.5 sm:p-4 rounded-2xs sm:rounded-sm shadow-2xs">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 w-full">
              {data.products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white border border-[#EAE3D2] hover:border-[#1F5E3B]/60 p-2.5 sm:p-4 rounded-2xs sm:rounded-sm transition-all duration-300 flex flex-col relative group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
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
            <div className="w-full bg-white border border-[#EAE3D2] p-8 sm:p-20 text-center rounded-2xs sm:rounded-sm shadow-2xs">
              <EmptyProducts onClearFilters={handleResetFilters} />
            </div>
          )}

          {/* PAGINATION */}
          {data?.pagination && (
            <div className="w-full pt-6 sm:pt-8 flex justify-center border-t border-[#EAE3D2]">
              <div className="bg-white border border-[#EAE3D2] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-2xs hover:border-[#1F5E3B]/40 transition-colors">
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