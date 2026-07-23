// apps/web/app/products/[slug]/page.tsx
"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, Star, ShieldCheck, Truck, RefreshCw, 
  Minus, Plus, ShoppingBag, Heart, Share2, Sparkles, 
  ArrowRight, Info, CheckCircle2, Layers, Compass 
} from "lucide-react";
import { useProductDetails } from "@/hooks/useProductDetails";
import { Product } from "@/types/product";

interface Variant {
  id: string;
  productId: string;
  size: string;
  sku: string;
  price: string;
  inventory?: {
    id: string;
    stock: number;
    reserved: number;
  };
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const {
    product,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
  } = useProductDetails(slug);

  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const variants: Variant[] = product?.variants || [];

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  useEffect(() => {
    if (product && (product as any).getRelatedByCategory) {
      setLoadingRelated(true);
      (product as any)
        .getRelatedByCategory(product.categoryId)
        .then((data: Product[]) => setRelatedProducts(data || []))
        .catch(console.error)
        .finally(() => setLoadingRelated(false));
    }
  }, [product]);

  const currentPrice = selectedVariant ? selectedVariant.price : (product?.price || "0");
  const baseComparePrice = product?.comparePrice ? Number(product.comparePrice) : 0;
  const basePrice = product?.price ? Number(product.price) : 0;
  
  const getAvailableStock = () => {
    const targetInventory = selectedVariant?.inventory || product?.inventory;
    if (!targetInventory) return 0;
    return Math.max(0, targetInventory.stock - targetInventory.reserved);
  };
  
  const availableStock = getAvailableStock();

  const stockConfig = (() => {
    if (availableStock === 0) {
      return { 
        label: 'Out of Stock', 
        className: 'bg-[#FCFAF7] text-[#7C7467] border-[#EAE3D2]', 
        isAvailable: false 
      };
    }
    if (availableStock < 10) {
      return { 
        label: `Limited: Only ${availableStock} Left`, 
        className: 'bg-[#FCFAF7] text-[#C89B3C] border-[#C89B3C]/30', 
        isAvailable: true 
      };
    }
    return { 
      label: 'In Stock', 
      className: 'bg-[#FCFAF7] text-[#1F5E3B] border-[#1F5E3B]/20', 
      isAvailable: true 
    };
  })();

  const discountPercentage = baseComparePrice > basePrice
    ? Math.round(((baseComparePrice - basePrice) / baseComparePrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-[#C89B3C]/20 rounded-none animate-pulse"></div>
          <div className="absolute inset-0 border-t-2 border-b-2 border-[#1F5E3B] rounded-none animate-spin"></div>
        </div>
        <p className="text-[#7C7467] font-mono tracking-widest text-xs uppercase animate-pulse">
          Loading Premium Catalog...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="p-8 bg-[#FCFAF7] border border-[#EAE3D2] rounded-none max-w-md shadow-sm">
          <Info className="w-8 h-8 text-[#7C7467] mx-auto mb-3" />
          <h2 className="font-serif text-[#2B2B2B] text-xl mb-1">Product Not Found</h2>
          <p className="text-[#7C7467] text-xs mb-5">{error || "The requested item could not be retrieved."}</p>
          <Link href="/products" className="inline-flex items-center space-x-2 text-white border border-[#1F5E3B] px-5 py-2 rounded-none text-xs bg-[#1F5E3B] hover:bg-[#1F5E3B]/90 transition-all font-mono uppercase tracking-widest">
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#2B2B2B] antialiased selection:bg-[#C89B3C]/30 overflow-hidden relative">
      
      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <ol className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#7C7467]">
          <li><Link href="/" className="hover:text-[#1F5E3B] transition-colors">Home</Link></li>
          <ChevronRight className="w-3 h-3 text-[#EAE3D2]" />
          <li><Link href="/products" className="hover:text-[#1F5E3B] transition-colors">Shop</Link></li>
          <ChevronRight className="w-3 h-3 text-[#EAE3D2]" />
          <li className="text-[#7C7467]/80 truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      {/* Primary Configuration Shell */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Block: Immersive Visual System */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full rounded-none bg-[#FCFAF7] border border-[#EAE3D2] overflow-hidden group flex items-center justify-center shadow-sm">
              
              {/* Luxury HUD Overlay */}
              <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-center pointer-events-none z-20">
                {discountPercentage > 0 && (
                  <span className="bg-[#1F5E3B] text-white text-[10px] font-bold font-mono tracking-widest px-3 py-1 rounded-none uppercase shadow-sm">
                    SAVE {discountPercentage}%
                  </span>
                )}
                <div className="flex space-x-2 ml-auto">
                  {product.purityBadge && (
                    <span className="bg-[#FCFAF7] border border-[#EAE3D2] text-[#1F5E3B] text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-none font-bold flex items-center gap-1">
                      <Compass className="h-3 w-3 text-[#C89B3C]" /> {product.purityBadge}
                    </span>
                  )}
                </div>
              </div>

              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-8 transform transition-all duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="text-[#7C7467] font-mono text-xs">No Asset Image Loaded</div>
              )}
              
              <div className="absolute inset-0 border border-[#EAE3D2] rounded-none pointer-events-none transition-colors group-hover:border-[#1F5E3B]/20" />
            </div>

            {/* Micro Thumbnail Stream */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative aspect-square rounded-none bg-[#FCFAF7] border transition-all duration-300 ${
                      selectedImage === img.url
                        ? "border-[#1F5E3B] ring-1 ring-[#1F5E3B]/30 shadow-sm scale-[0.98]"
                        : "border-[#EAE3D2] hover:border-[#1F5E3B] hover:scale-[1.02]"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover p-2"
                      sizes="15vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Block: Controls & Purchasing HUD */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            <div className="space-y-3">
              {/* Category & Status Node */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F5E3B] bg-[#FCFAF7] border border-[#EAE3D2] px-3 py-0.5 rounded-none font-bold">
                  {product.category?.name || "Premium Collection"}
                </span>
                <span className={`text-[10px] font-mono uppercase border px-2.5 py-0.5 rounded-none tracking-widest transition-all ${stockConfig.className}`}>
                  {stockConfig.label}
                </span>
              </div>

              {/* Title Identity */}
              <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#2B2B2B] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Engine Metrics Bar */}
              <div className="flex items-center space-x-4 pt-1 text-xs text-[#7C7467] font-mono">
                <div className="flex items-center text-[#C89B3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating || 5) ? "fill-[#C89B3C]" : "text-[#EAE3D2]"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 text-xs text-[#2B2B2B] font-bold">{product.rating || "5.0"}</span>
                </div>
                <span className="text-[#EAE3D2]">|</span>
                <span className="text-[11px] hover:text-[#1F5E3B] transition-colors cursor-pointer">
                  {product.reviewsCount || product.reviews?.length || 0} Reviews
                </span>
              </div>
            </div>

            <hr className="border-[#EAE3D2]" />

            {/* High-Precision Pricing Display */}
            <div className="p-5 rounded-none bg-[#FCFAF7] border border-[#EAE3D2] shadow-sm relative overflow-hidden group">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-normal tracking-tight text-[#1F5E3B] font-serif">
                 ₹ {Number(currentPrice).toFixed(2)}
                </span>
                {product.comparePrice && Number(product.comparePrice) > Number(currentPrice) && (
                  <span className="text-sm font-mono text-[#7C7467] line-through decoration-red-500/50">
                    ₹{Number(product.comparePrice).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#7C7467] font-mono mt-1.5 uppercase tracking-widest flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#1F5E3B] rounded-none" /> Premium Quality Guaranteed
              </p>
            </div>

            {/* Variant Selector */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#7C7467] flex items-center justify-between">
                  <span>Select Option</span>
                  <span className="text-[#1F5E3B] text-xs font-bold uppercase tracking-wider">
                    {selectedVariant?.size || "Choose Size"}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      className={`p-3 text-xs font-mono border rounded-none transition-all duration-300 text-left flex flex-col justify-between ${
                        selectedVariant?.id === v.id
                          ? "border-[#1F5E3B] bg-[#1F5E3B]/5 text-[#2B2B2B]"
                          : "border-[#EAE3D2] bg-[#FCFAF7] text-[#7C7467] hover:border-[#1F5E3B] hover:text-[#2B2B2B]"
                      }`}
                    >
                      <span className="font-bold tracking-wide block mb-1 text-[#2B2B2B]">{v.size}</span>
                      <div className="flex justify-between items-center w-full text-[10px] text-[#7C7467]">
                        <span>{v.sku}</span>
                        <span className={selectedVariant?.id === v.id ? "text-[#1F5E3B] font-bold" : ""}>${v.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C7467]">Quantity</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-[#FCFAF7] border border-[#EAE3D2] rounded-none p-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!stockConfig.isAvailable}
                    className="p-2 hover:bg-white text-[#7C7467] hover:text-[#2B2B2B] disabled:opacity-20 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-mono text-[#2B2B2B] font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock || 99, quantity + 1))}
                    disabled={!stockConfig.isAvailable || quantity >= availableStock}
                    className="p-2 hover:bg-white text-[#7C7467] hover:text-[#2B2B2B] disabled:opacity-20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                disabled={!stockConfig.isAvailable}
                className="flex-1 bg-gradient-to-r from-[#1F5E3B] to-[#2e7d52] text-white font-medium text-xs py-4 px-6 rounded-none transition-all duration-300 shadow-sm active:scale-[0.99] flex items-center justify-center space-x-2 disabled:from-zinc-300 disabled:to-zinc-400 disabled:text-zinc-600 disabled:cursor-not-allowed uppercase tracking-widest font-mono"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              <div className="flex gap-2">
                <button className="p-4 rounded-none bg-[#FCFAF7] border border-[#EAE3D2] hover:border-[#1F5E3B] hover:bg-white text-[#7C7467] hover:text-[#2B2B2B] transition-all duration-200 group">
                  <Heart className="w-4 h-4 text-[#C89B3C] transition-all" />
                </button>
                <button className="p-4 rounded-none bg-[#FCFAF7] border border-[#EAE3D2] hover:border-[#1F5E3B] hover:bg-white text-[#7C7467] hover:text-[#2B2B2B] transition-all duration-200 group">
                  <Share2 className="w-4 h-4 transition-transform" />
                </button>
              </div>
            </div>

            {/* Premium Pipeline Assurance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
              <div className="p-3.5 rounded-none bg-[#FCFAF7] border border-[#EAE3D2]">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C] mx-auto mb-1.5" />
                <span className="block text-[9px] font-mono uppercase text-[#2B2B2B] tracking-wider font-bold">Authenticated</span>
                <span className="text-[9px] text-[#7C7467] block mt-0.5 font-light">100% Pure Material</span>
              </div>
              <div className="p-3.5 rounded-none bg-[#FCFAF7] border border-[#EAE3D2]">
                <Truck className="w-4 h-4 text-[#C89B3C] mx-auto mb-1.5" />
                <span className="block text-[9px] font-mono uppercase text-[#2B2B2B] tracking-wider font-bold">
                  {product.deliveryBadge || "White-Glove"}
                </span>
                <span className="text-[9px] text-[#7C7467] block mt-0.5 font-light">Secure Delivery</span>
              </div>
              <div className="p-3.5 rounded-none bg-[#FCFAF7] border border-[#EAE3D2]">
                <RefreshCw className="w-4 h-4 text-[#C89B3C] mx-auto mb-1.5" />
                <span className="block text-[9px] font-mono uppercase text-[#2B2B2B] tracking-wider font-bold">Easy Returns</span>
                <span className="text-[9px] text-[#7C7467] block mt-0.5 font-light">30-Day Window</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#EAE3D2] relative z-10">
        <div className="flex border-b border-[#EAE3D2] space-x-8 mb-8 overflow-x-auto pb-px scrollbar-none">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all duration-300 relative whitespace-nowrap ${
                activeTab === tab
                  ? "border-[#1F5E3B] text-[#2B2B2B] font-bold"
                  : "border-transparent text-[#7C7467] hover:text-[#2B2B2B]"
              }`}
            >
              {tab === "description" && "Description"}
              {tab === "specs" && "Product Specifications"}
              {tab === "reviews" && `Reviews (${product.reviewsCount || product.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Tab Modules */}
        <div className="min-h-[200px] transition-all duration-300">
          {activeTab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 space-y-4 text-[#7C7467] font-light text-sm leading-relaxed">
                <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#1F5E3B] first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                  {product.description || "No supplemental details available for this product item."}
                </p>
                <div className="p-4 rounded-none bg-[#FCFAF7] border border-[#EAE3D2] flex items-start space-x-3 mt-6">
                  <Sparkles className="w-4 h-4 text-[#C89B3C] mt-0.5 flex-shrink-0" />
                  <div className="text-xs font-mono text-[#7C7467] space-y-1">
                    <span className="text-[#2B2B2B] block font-bold uppercase tracking-wider">Premium Selection Note</span>
                    <span>This organic configuration meets dynamic purity control and standard testing profiles for transparent direct-to-household verification.</span>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-none bg-gradient-to-b from-[#FCFAF7] to-transparent border border-[#EAE3D2] space-y-3 font-mono text-[11px]">
                <h4 className="text-[#2B2B2B] font-bold uppercase tracking-widest mb-2 flex items-center gap-2 text-xs text-[#1F5E3B]">
                  <Layers className="w-3.5 h-3.5 text-[#C89B3C]" /> Core Information
                </h4>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D2]">
                  <span className="text-[#7C7467]">SKU</span>
                  <span className="text-[#2B2B2B] font-bold">{selectedVariant ? selectedVariant.sku : (product.sku || "N/A")}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D2]">
                  <span className="text-[#7C7467]">Framework</span>
                  <span className="text-[#2B2B2B]">Verified Sourcing</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D2]">
                  <span className="text-[#7C7467]">Status</span>
                  <span className={product.isActive ? "text-[#1F5E3B] font-bold" : "text-red-600"}>
                    {product.isActive ? "AVAILABLE" : "UNAVAILABLE"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl rounded-none border border-[#EAE3D2] bg-[#FCFAF7] overflow-hidden font-mono text-xs shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-[#EAE3D2] hover:bg-white transition-colors">
                    <td className="p-4 text-[#7C7467] font-medium w-1/3">Product ID</td>
                    <td className="p-4 text-[#2B2B2B] select-all">{product.id}</td>
                  </tr>
                  <tr className="border-b border-[#EAE3D2] hover:bg-white transition-colors">
                    <td className="p-4 text-[#7C7467] font-medium">Slug Path</td>
                    <td className="p-4 text-[#2B2B2B]">{product.slug}</td>
                  </tr>
                  <tr className="border-b border-[#EAE3D2] hover:bg-white transition-colors">
                    <td className="p-4 text-[#7C7467] font-medium">Category Reference</td>
                    <td className="p-4 text-[#2B2B2B]">{product.categoryId}</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-4 text-[#7C7467] font-medium">Registry History</td>
                    <td className="p-4 text-[#2B2B2B] text-[11px] leading-relaxed">
                      Created: {new Date(product.createdAt).toLocaleString()} <br />
                      Updated: {new Date(product.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-3xl">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="p-5 rounded-none bg-[#FCFAF7] border border-[#EAE3D2] space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1 text-[#C89B3C]">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? "fill-[#C89B3C]" : "text-[#EAE3D2]"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#7C7467]">Verified Buyer</span>
                    </div>
                    <p className="text-sm text-[#2B2B2B] font-light">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-[#EAE3D2] rounded-none bg-[#FCFAF7]">
                  <CheckCircle2 className="w-6 h-6 text-[#7C7467] mx-auto mb-2" />
                  <p className="text-sm text-[#7C7467] font-mono">No customer reviews written for this product yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cohort Integration: Related Products Stream */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#FCFAF7] border-t border-[#EAE3D2] relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-serif font-normal text-[#2B2B2B]">Related Products</h3>
                <p className="text-xs font-mono text-[#7C7467] mt-0.5">Explore similar high-quality options from the same category collection.</p>
              </div>
              <Link href={`/products?categoryId=${product.category?.id || ""}`} className="group inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-[#1F5E3B] hover:text-[#C89B3C] transition-colors font-bold">
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((relProduct) => {
                const primaryImg = relProduct.images?.find((img) => img.position === 0)?.url || relProduct.images?.[0]?.url;
                return (
                  <Link
                    href={`/products/${relProduct.slug}`}
                    key={relProduct.id}
                    className="group bg-white border border-[#EAE3D2] rounded-none p-3 flex flex-col justify-between hover:border-[#1F5E3B] transition-all duration-300 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-square w-full rounded-none bg-[#FCFAF7] overflow-hidden flex items-center justify-center p-3 border border-[#EAE3D2]/40">
                        {primaryImg ? (
                          <Image
                            src={primaryImg}
                            alt={relProduct.name}
                            fill
                            className="object-contain p-3 transform group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 40vw, 20vw"
                          />
                        ) : (
                          <div className="text-[10px] text-[#7C7467] font-mono">No Product Image</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs text-[#2B2B2B] font-medium group-hover:text-[#1F5E3B] transition-colors line-clamp-1">
                          {relProduct.name}
                        </h4>
                        <p className="text-[10px] font-mono text-[#7C7467]">
                          {relProduct.category?.name || "Product Unit"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-4 border-t border-[#EAE3D2] font-mono">
                      <span className="text-xs text-[#1F5E3B] font-bold">${Number(relProduct.price).toFixed(2)}</span>
                      <span className="text-[9px] text-[#1F5E3B] border border-[#1F5E3B]/20 rounded-none px-1.5 py-0.5 group-hover:bg-[#1F5E3B] group-hover:text-white transition-all">
                        View Item
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}