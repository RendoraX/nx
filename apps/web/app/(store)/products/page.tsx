// apps/web/app/shop/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProduct';
import { SearchBar } from '@/components/shop/search-bar';
import { ProductFilter } from '@/components/shop/product-filter';
import { ProductSort } from '@/components/shop/product-sort';
import { ProductCard } from '@/components/shop/product-card';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { EmptyProducts } from '@/components/shop/empty-products';
import { Pagination } from '@/components/shop/pagination';
import { SlidersHorizontal, RefreshCw, ShoppingBag } from 'lucide-react';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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

  console.log(data?.products)
  if (isError) {
    return (
      <div className="w-full min-h-screen bg-[#FCFAF7] antialiased flex flex-col items-center justify-center text-[#2B2B2B] selection:bg-[#1F5E3B]/10">
        <div className="w-12 h-12 text-[#7C7467] flex items-center justify-center mb-4">
          <RefreshCw className="w-5 h-5 animate-spin stroke-[1.25]" />
        </div>
        <div className="space-y-3 text-center mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2B2B2B]">Connection Interrupted</h3>
          <p className="text-[13px] text-[#7C7467] max-w-sm mx-auto font-light tracking-wide">An unexpected issue occurred while updating the products catalog storefront.</p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="h-12 px-8 border border-[#1F5E3B] text-[#1F5E3B] bg-transparent text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-[#1F5E3B] hover:text-[#FCFAF7] transition-all duration-500 cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FCFAF7] overflow-x-hidden antialiased flex flex-col text-[#2B2B2B] selection:bg-[#1F5E3B]/10">

      {/* REBRANDED HERO INTRO BANNER BLOCK */}
      <section className="w-full bg-white border-b border-[#EAE3D2] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-[#FCFAF7] border border-[#EAE3D2] px-3 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-[0.2em] text-[#1F5E3B]">
            <ShoppingBag className="h-3 w-3 text-[#C89B3C]" /> Store Catalog Open
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#2B2B2B] tracking-tight">
            Our Online <span className="font-serif italic text-[#1F5E3B]">Product Shop</span>
          </h1>
          <p className="text-[#7C7467] text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Browse through our selected batch items, natural organic goods, and essential daily collections cataloged transparently for direct home shopping verification.
          </p>
        </div>
      </section>
      
      {/* BREADCRUMB COMPONENT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-[#A39785]">
        <div className="flex items-center gap-2">
          <span onClick={() => router.push('/')} className="cursor-pointer hover:text-[#1F5E3B] transition-colors duration-300">Home</span>
          <span className="text-[9px] font-light text-[#EAE3D2]">&gt;</span>
          <span className="text-[#2B2B2B]">Shop Catalog</span>
        </div>
        <div className="hidden sm:flex items-center">
          <span className="font-light text-[#7C7467] lowercase tracking-normal text-xs">Showing {data?.products?.length || 0} items</span>
        </div>
      </div>

      {/* MAIN LAYOUT APP GRID */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row gap-12 items-start overflow-visible">
        
        {/* SIDEBAR FILTERS ACCORDION LAYOUT */}
        <aside className={`w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-8 transition-all duration-500 z-30 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
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
        </aside>

        {/* MAIN PRODUCT CATALOG CONTROL PANEL CONTAINER */}
        <main className="flex-1 space-y-8 w-full overflow-visible">
          
          {/* SEARCHBAR AND SORT DROPDOWN BAR */}
          <div className="w-full bg-[#FCFAF7] border-b border-[#EAE3D2] pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
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
            
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="inline-flex lg:hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#2B2B2B] border border-[#EAE3D2] px-4 py-2 bg-transparent transition-all hover:border-[#1F5E3B]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Filter Items</span>
              </button>

              <div className="flex items-center gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-transparent border border-[#EAE3D2]/40 p-6">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full overflow-visible">
              {data.products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-transparent border border-transparent hover:border-[#EAE3D2]/60 p-4 transition-all duration-500 overflow-visible flex flex-col relative group"
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
            <div className="w-full bg-[#FCFAF7] border border-[#EAE3D2]/50 p-20 text-center">
              <EmptyProducts onClearFilters={handleResetFilters} />
            </div>
          )}

          {/* CATALOG PAGINATION MODULE CONTROLLER */}
          {data?.pagination && (
            <div className="w-full pt-8 flex justify-center border-t border-[#EAE3D2]/40">
              <div className="bg-transparent px-6 py-2">
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