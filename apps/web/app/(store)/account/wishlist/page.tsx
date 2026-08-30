"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trash2, 
  ShoppingBag, 
  Heart, 
  ChevronRight, 
  RefreshCw, 
  Sparkles, 
  Info,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Compass,
  Check
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";

export interface RawWishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  variantId: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    comparePrice?: string | number;
    description?: string;
    sku?: string;
    images?: Array<{ url: string; position?: number }> | string[];
    category?: { name: string };
    [key: string]: any;
  };
  variant?: {
    id: string;
    size?: string;
    price?: string | number;
    sku?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function WishlistPage() {
  const {
    items,
    totalItems,
    isLoading,
    isError,
    error,
    refetch,
    removeItem,
    clearWishlist,
    isClearing,
  } = useWishlist();

  const { addToCart } = useCart();
  const wishlistItems = items as unknown as RawWishlistItem[];

  // Local state for search & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [addingId, setAddingId] = useState<string | null>(null);

  // Filtered & Sorted Items
  const filteredItems = useMemo(() => {
    return wishlistItems
      .filter((item) => {
        const name = item.product?.name || "";
        const sku = item.variant?.sku || item.product?.sku || "";
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .sort((a, b) => {
        const priceA = Number(a.variant?.price ?? a.product?.price ?? 0);
        const priceB = Number(b.variant?.price ?? b.product?.price ?? 0);
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [wishlistItems, searchQuery, sortBy]);

// Inside app/wishlist/page.tsx

const handleRemove = async (productId: string, variantId: string) => {
  try {
    // 1. Trigger the hook action
    removeItem({ productId, variantId });

    // 2. Force refetch directly after mutation completes
    setTimeout(() => {
      refetch();
    }, 300);

    toast.success("Item removed from your vault.");
  } catch (err) {
    toast.error("Could not remove item from wishlist.");
  }
};

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your saved vault?")) {
      clearWishlist();
      toast.success("Wishlist cleared.");
    }
  };

  const handleQuickAdd = async (variantId: string, productId: string) => {
    const targetId = variantId || productId;
    setAddingId(targetId);
    try {
      await addToCart(targetId, 1);
      toast.success("Formula added to your cart.");
    } catch (err: any) {
      toast.error("Failed to add item to cart.");
    } finally {
      setAddingId(null);
    }
  };

  // Dynamic JSON-LD Schema for SEO
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Personal Saved Rituals & Botanical Vault",
    "description": "Handcrafted botanical extracts, sacred remedies, and herbal formulations saved in user wishlist.",
    "numberOfItems": wishlistItems.length,
    "itemListElement": wishlistItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": item.product?.name || "Herbal Formulation",
        "description": item.product?.description || "Authentic botanical remedy",
        "sku": item.variant?.sku || item.product?.sku,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": Number(item.variant?.price ?? item.product?.price ?? 0),
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <>
      {/* Inject Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="min-h-screen bg-[#FCFAF7] text-[#2B2B2B] antialiased selection:bg-[#C89B3C]/30 overflow-x-hidden relative pb-28">
        
        {/* Soft Ambient Radial Glass Orbs */}
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-[#C89B3C]/15 via-[#1F5E3B]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#1F5E3B]/10 via-[#C89B3C]/10 to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10">
          <ol className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#7C7467] overflow-x-auto scrollbar-none pb-1">
            <li className="shrink-0">
              <Link href="/" className="hover:text-[#1F5E3B] transition-colors">Home</Link>
            </li>
            <ChevronRight className="w-3 h-3 text-[#C89B3C]/60 shrink-0" />
            <li className="shrink-0">
              <Link href="/products" className="hover:text-[#1F5E3B] transition-colors">Atelier Shop</Link>
            </li>
            <ChevronRight className="w-3 h-3 text-[#C89B3C]/60 shrink-0" />
            <li className="text-[#2B2B2B] font-bold truncate">Personal Vault</li>
          </ol>
        </nav>

        {/* Hero Header Component */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 relative z-10">
          <div className="backdrop-blur-xl bg-white/75 border border-[#C89B3C]/30 ring-1 ring-white/80 rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_-10px_rgba(200,155,60,0.12)] relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C89B3C]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1F5E3B]/10 border border-[#1F5E3B]/20 text-[#1F5E3B] text-[10px] font-mono uppercase tracking-[0.25em] font-bold rounded-full backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#C89B3C] animate-pulse" />
                  <span>Preserved Collection</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif text-[#2B2B2B] font-normal tracking-tight">
                  Saved Rituals & Formulations
                </h1>
                <p className="text-xs sm:text-sm text-[#7C7467] font-serif italic max-w-xl leading-relaxed">
                  Your handpicked library of pure extracts, oils, and botanical remedies stored for your routine.
                </p>
              </div>

              {/* Stat Counters & Global Actions */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#EAE3D2]">
                <div className="px-5 py-3 bg-white/80 border border-[#EAE3D2] rounded-2xl text-center backdrop-blur-md shadow-2xs">
                  <span className="block text-2xl font-serif text-[#1F5E3B] font-semibold">{totalItems}</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#7C7467]">
                    {totalItems === 1 ? "Formula" : "Formulas"}
                  </span>
                </div>

                {wishlistItems.length > 0 && (
                  <button
                    onClick={handleClear}
                    disabled={isClearing}
                    className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-red-700 hover:text-white bg-red-50/90 hover:bg-red-800 border border-red-200/90 px-4 py-3.5 rounded-2xl transition-all cursor-pointer backdrop-blur-md active:scale-95 disabled:opacity-50 shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    {isClearing ? "Clearing..." : "Clear Vault"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Control Panel */}
        {wishlistItems.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
            <div className="backdrop-blur-xl bg-white/60 border border-[#EAE3D2] ring-1 ring-white/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#7C7467] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search saved formulas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border border-[#EAE3D2] focus:border-[#1F5E3B] pl-10 pr-4 py-2 text-xs font-mono rounded-xl focus:outline-none transition-all placeholder:text-[#7C7467]/70"
                />
              </div>

              {/* Sorting selector */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#7C7467] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C89B3C]" /> Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/80 border border-[#EAE3D2] text-[#2B2B2B] text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-[#1F5E3B] transition-all cursor-pointer"
                >
                  <option value="newest">Recently Saved</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Main Vault Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* Skeleton Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="backdrop-blur-xl bg-white/50 border border-[#C89B3C]/20 rounded-3xl p-5 animate-pulse space-y-4"
                >
                  <div className="w-full h-56 bg-white/80 rounded-2xl border border-[#EAE3D2]/50" />
                  <div className="h-4 bg-zinc-200/80 rounded-lg w-3/4" />
                  <div className="h-3 bg-zinc-100/80 rounded-lg w-1/2" />
                  <div className="h-10 bg-zinc-200/80 rounded-xl w-full mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-16 backdrop-blur-xl bg-white/80 border border-red-200/90 rounded-3xl max-w-md mx-auto p-8 shadow-sm">
              <Info className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <p className="text-red-700 font-mono text-xs mb-6">
                {error?.message || "Unable to retrieve your saved formulas."}
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] bg-[#1F5E3B] text-white font-medium rounded-xl hover:bg-[#154128] transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> Reload Ledger
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && wishlistItems.length === 0 && (
            <div className="text-center py-20 backdrop-blur-xl bg-white/70 border border-[#C89B3C]/30 rounded-3xl max-w-md mx-auto p-8 sm:p-12 shadow-[0_12px_40px_-10px_rgba(200,155,60,0.08)]">
              <div className="w-16 h-16 bg-white border border-[#C89B3C]/40 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xs">
                <Heart className="w-7 h-7 text-[#C89B3C]" />
              </div>
              <h2 className="text-2xl font-serif text-[#2B2B2B] font-normal mb-2">
                Your Vault is Empty
              </h2>
              <p className="text-xs text-[#7C7467] font-mono leading-relaxed mb-8 uppercase tracking-widest">
                No botanical formulations saved in your collection yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-[#1F5E3B] text-white text-xs font-mono uppercase tracking-[0.2em] font-medium rounded-2xl hover:bg-[#154128] transition-all shadow-md active:scale-95"
              >
                <span>Browse Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Wishlist Cards Grid */}
          {!isLoading && !isError && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <WishlistGlassCard
                  key={item.id}
                  item={item}
                  addingId={addingId}
                  onRemove={handleRemove}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}

          {/* No Filter Results Search Fallback */}
          {!isLoading && !isError && wishlistItems.length > 0 && filteredItems.length === 0 && (
            <div className="text-center py-12 bg-white/60 border border-[#EAE3D2] rounded-2xl p-6 font-mono text-xs text-[#7C7467]">
              No saved items matched "{searchQuery}".
            </div>
          )}
        </section>

        {/* Atelier Trust Assurance Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <div className="backdrop-blur-xl bg-white/60 border border-[#C89B3C]/20 ring-1 ring-white/60 rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-2xs">
            <div className="space-y-1.5 p-2">
              <ShieldCheck className="w-5 h-5 text-[#C89B3C] mx-auto mb-2" />
              <h3 className="text-xs font-mono uppercase tracking-[0.15em] font-bold text-[#2B2B2B]">
                100% Purity Certified
              </h3>
              <p className="text-[11px] text-[#7C7467] font-light">Directly sourced organic herbs & formulations.</p>
            </div>
            <div className="space-y-1.5 p-2 border-t sm:border-t-0 sm:border-l border-[#EAE3D2]">
              <Truck className="w-5 h-5 text-[#C89B3C] mx-auto mb-2" />
              <h3 className="text-xs font-mono uppercase tracking-[0.15em] font-bold text-[#2B2B2B]">
                White-Glove Delivery
              </h3>
              <p className="text-[11px] text-[#7C7467] font-light">Dispatched in protected temperature-controlled packs.</p>
            </div>
            <div className="space-y-1.5 p-2 border-t sm:border-t-0 sm:border-l border-[#EAE3D2]">
              <RotateCcw className="w-5 h-5 text-[#C89B3C] mx-auto mb-2" />
              <h3 className="text-xs font-mono uppercase tracking-[0.15em] font-bold text-[#2B2B2B]">
                Guaranteed Satisfaction
              </h3>
              <p className="text-[11px] text-[#7C7467] font-light">30-day hassle-free return and exchange window.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Single Glass Card Component with rounded contours
function WishlistGlassCard({
  item,
  addingId,
  onRemove,
  onQuickAdd,
}: {
  item: RawWishlistItem;
  addingId: string | null;
  onRemove: (productId: string, variantId: string) => void;
  onQuickAdd: (variantId: string, productId: string) => void;
}) {
  const { product, variant, productId, variantId } = item;

  const displayPrice = Number(variant?.price ?? product?.price ?? 0);
  const comparePrice = product?.comparePrice ? Number(product.comparePrice) : null;
  const isAdding = addingId === (variantId || productId);

  const images = product?.images;
  let imageUrl: string | null = null;

  if (Array.isArray(images) && images.length > 0) {
    const firstImg = images[0];
    if (typeof firstImg === "string") {
      imageUrl = firstImg;
    } else if (typeof firstImg === "object" && firstImg !== null) {
      imageUrl = firstImg.url;
    }
  }

  return (
    <article className="group backdrop-blur-xl bg-white/60 hover:bg-white/85 border border-[#C89B3C]/25 hover:border-[#1F5E3B] rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-500 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-8px_rgba(31,94,59,0.12)] hover:-translate-y-1">
      
      <div className="space-y-4">
        {/* Rounded Visual Container */}
        <div className="relative aspect-square w-full bg-white/90 border border-[#EAE3D2] rounded-2xl overflow-hidden flex items-center justify-center p-4 group-hover:border-[#1F5E3B]/30 transition-colors">
          
          {/* Floating Remove Button */}
          <button
            onClick={() => onRemove(productId, variantId)}
            className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-50 text-[#7C7467] hover:text-red-700 border border-[#EAE3D2] rounded-xl transition-all backdrop-blur-md cursor-pointer shadow-2xs active:scale-90"
            title="Remove from wishlist"
            aria-label="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Purity Badge */}
          <span className="absolute top-3 left-3 z-10 bg-white/90 border border-[#EAE3D2] text-[#1F5E3B] text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-2xs">
            <Compass className="w-3 h-3 text-[#C89B3C]" /> Pure
          </span>

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product?.name || "Herbal formulation preview"}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <span className="text-[#7C7467] font-mono text-[10px] uppercase tracking-widest text-center px-2">
              Botanical Extract
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-[#7C7467]">
            <span className="truncate pr-2">SKU: {variant?.sku || product?.sku || "HERB-AYU"}</span>
            {variant?.size && (
              <span className="bg-white/90 border border-[#C89B3C]/30 text-[#1F5E3B] font-bold px-2 py-0.5 rounded-md">
                {variant.size}
              </span>
            )}
          </div>

          <Link
            href={product?.slug ? `/products/${product.slug}` : "#"}
            className="block text-lg font-serif text-[#2B2B2B] hover:text-[#1F5E3B] transition-colors line-clamp-1 font-normal tracking-tight"
          >
            {product?.name || "Ayurvedic Herbal Formula"}
          </Link>
        </div>
      </div>

      {/* Pricing & Double Actions */}
      <div className="mt-5 pt-3.5 border-t border-[#EAE3D2]/80 space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-serif text-[#1F5E3B] font-normal">
            ₹{displayPrice.toFixed(2)}
          </span>
          {comparePrice && comparePrice > displayPrice && (
            <span className="text-xs font-mono text-[#7C7467] line-through decoration-red-500/50">
              ₹{comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onQuickAdd(variantId, productId)}
            disabled={isAdding}
            className="flex items-center justify-center space-x-1.5 py-3 bg-[#1F5E3B] hover:bg-[#154128] text-white text-[9px] font-mono uppercase tracking-[0.18em] font-bold rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
          >
            {isAdding ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>

          <Link
            href={product?.slug ? `/products/${product.slug}` : "#"}
            className="flex items-center justify-center py-3 bg-white/80 hover:bg-white text-[#2B2B2B] hover:text-[#1F5E3B] border border-[#EAE3D2] hover:border-[#1F5E3B] text-[9px] font-mono uppercase tracking-[0.18em] font-bold rounded-xl transition-all shadow-2xs"
          >
            <span>Details</span>
          </Link>
        </div>
      </div>
    </article>
  );
}