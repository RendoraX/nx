'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Tag,
  Layers,
  Lock,
  PackageCheck,
  Receipt,
  RotateCcw,
  X
} from 'lucide-react';
import { useCart } from '@/providers/CartProvider';

const SHIPPING_THRESHOLD = 500;

function LuxurySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 animate-pulse text-left">
      <div className="lg:col-span-8 space-y-3 sm:space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#FCFAF7] border border-[#EAE3D2]/80 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4 items-center">
            <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#EAE3D2]/40 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="h-3.5 sm:h-4 bg-[#EAE3D2]/50 rounded w-1/2 sm:w-1/3" />
              <div className="h-2.5 sm:h-3 bg-[#EAE3D2]/40 rounded w-1/3 sm:w-1/4" />
              <div className="h-2.5 sm:h-3 bg-[#EAE3D2]/30 rounded w-1/4 sm:w-1/5" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-4">
        <div className="h-64 sm:h-80 bg-[#1B3B2B] rounded-2xl p-5 sm:p-6" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { 
    cart, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  const [showClearModal, setShowClearModal] = useState(false);

  const items = cart?.items || [];

  // Keep local quantities in sync whenever context cart state updates
  useEffect(() => {
    if (cart?.items) {
      const initialQtys: Record<string, number> = {};
      cart.items.forEach((item) => {
        initialQtys[item.id] = item.quantity;
      });
      setLocalQuantities(initialQtys);
    }
  }, [cart]);

  const handleQuantityChange = async (itemId: string, newQty: number, currentServerQty: number) => {
    setLocalQuantities((prev) => ({ ...prev, [itemId]: newQty }));
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      setLocalQuantities((prev) => ({ ...prev, [itemId]: currentServerQty }));
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      // Error handled via Context state
    } finally {
      setShowClearModal(false);
    }
  };

  const subtotal = cart?.subtotal ?? items.reduce((acc, item) => {
    const qty = localQuantities[item.id] ?? item.quantity;
    const lineVal = (item.variant?.price || 0) * qty;
    return acc + lineVal;
  }, 0);

  const shipping = subtotal >= SHIPPING_THRESHOLD || items.length === 0 ? 0 : 40;
  const grandTotal = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1B3B2B] antialiased selection:bg-[#C89B3C]/20 relative overflow-hidden pb-24 sm:pb-10">
      
      {/* Ambient Backlight */}
      <div className="absolute top-0 right-1/3 w-60 sm:w-[450px] h-60 sm:h-[450px] bg-[#C89B3C]/5 rounded-full blur-2xl sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-[#1B3B2B]/5 rounded-full blur-2xl sm:blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 relative z-10">
        
        {/* Header */}
        <div className="border-b border-[#EAE3D2]/80 pb-4 sm:pb-6 mb-5 sm:mb-8 text-left relative">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C]" />
            <span className="text-[9px] font-bold tracking-[0.22em] text-[#C89B3C] uppercase font-mono">
              Bespoke Selection
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#1B3B2B] tracking-tight">
                Your Vault
              </h1>
              <p className="text-[11px] sm:text-xs text-[#7C7467] font-serif italic mt-0.5">
                Review and manage your curated reservations prior to checkout.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 bg-[#FCFAF7] border border-[#EAE3D2] px-3 py-1.5 rounded-full shadow-2xs">
                <ShoppingBag className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#1B3B2B] uppercase">
                  {cart?.itemCount || 0} {cart?.itemCount === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>

              {items.length > 0 && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#7C7467] hover:text-red-700 bg-[#FCFAF7] hover:bg-red-50/60 border border-[#EAE3D2] hover:border-red-200 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
                  title="Clear all items from vault"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden xs:inline">Clear Vault</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50/90 backdrop-blur border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-mono text-[11px] sm:text-xs">{error}</span>
          </div>
        )}

        {loading ? (
          <LuxurySkeleton />
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="min-h-[300px] sm:min-h-[380px] flex items-center justify-center bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 sm:p-8 text-center shadow-2xs relative overflow-hidden group">
            <div className="max-w-sm space-y-4 relative z-10">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <div className="absolute inset-0 bg-[#C89B3C]/10 rounded-full blur-lg group-hover:bg-[#C89B3C]/20 transition-all duration-700" />
                <div className="relative w-full h-full bg-white border border-[#EAE3D2] rounded-full flex items-center justify-center text-[#1B3B2B] shadow-2xs">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-[#C89B3C] stroke-[1.5]" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#1B3B2B]">Your vault is empty</h2>
                <p className="text-[11px] sm:text-xs text-[#7C7467] font-light leading-relaxed max-w-xs mx-auto">
                  Immerse yourself in our catalog to reserve handcrafted, limited-edition items.
                </p>
              </div>

              <div className="pt-1">
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B3B2B] text-[#FCFAF7] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] rounded-lg hover:bg-[#C89B3C] hover:text-[#1B3B2B] transition-all duration-500 shadow-sm hover:shadow-md"
                >
                  Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 text-left">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">

              {/* Free Shipping Progress Indicator */}
              <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-3 sm:p-4 shadow-2xs space-y-1.5">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-[#1B3B2B] font-medium">
                    <Truck className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                    {subtotal >= SHIPPING_THRESHOLD ? (
                      <span className="text-[#1B3B2B]">Unlocked <strong className="text-[#C89B3C]">Complimentary Shipping</strong></span>
                    ) : (
                      <span>Add <strong className="text-[#C89B3C]">₹{amountToFreeShipping.toFixed(2)}</strong> for Free Delivery</span>
                    )}
                  </span>
                  <span className="text-[#7C7467] text-[10px]">{Math.round(shippingProgress)}%</span>
                </div>
                <div className="w-full bg-[#EAE3D2]/60 h-1 sm:h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#1B3B2B] to-[#C89B3C] h-full transition-all duration-700 ease-out" 
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Product Cards */}
              {items.map((item) => {
                const currentQty = localQuantities[item.id] ?? item.quantity;
                const primaryImage = item.product?.images?.[0]?.url;
                const secondaryImage = item.product?.images?.[1]?.url;
                const unitPrice = item.variant?.price || 0;
                const itemLineTotal = unitPrice * currentQty;
                const stockAvailable = item.inventory?.stock ?? 0;

                return (
                  <div 
                    key={item.id}
                    className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-2xs hover:shadow-sm transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                      
                      {/* Product Thumbnail */}
                      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-white border border-[#EAE3D2] flex-shrink-0 group/img shadow-2xs">
                        {primaryImage ? (
                          <>
                            <Image 
                              src={primaryImage} 
                              alt={item.product?.images?.[0]?.alt || item.product?.name || 'Product Image'} 
                              fill 
                              className={`object-cover transition-all duration-500 ${secondaryImage ? 'group-hover/img:opacity-0 group-hover/img:scale-105' : 'group-hover/img:scale-105'}`} 
                            />
                            {secondaryImage && (
                              <Image 
                                src={secondaryImage} 
                                alt={item.product?.name || 'Product Preview'} 
                                fill 
                                className="object-cover transition-all duration-500 opacity-0 group-hover/img:opacity-100 group-hover/img:scale-105 absolute inset-0" 
                              />
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#7C7467]">
                            <ShoppingBag className="w-5 h-5 stroke-[1]" />
                          </div>
                        )}

                        {item.product?.images && item.product.images.length > 1 && (
                          <div className="absolute bottom-1 right-1 bg-[#1B3B2B]/90 backdrop-blur-md text-[7px] sm:text-[8px] text-[#FCFAF7] px-1 py-0.2 rounded font-mono shadow-2xs">
                            +{item.product.images.length - 1}
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold uppercase tracking-wider text-[#C89B3C] bg-[#C89B3C]/10 border border-[#C89B3C]/20 px-1.5 py-0.2 rounded-full truncate">
                            {item.product?.category || 'Exclusive'}
                          </span>
                        </div>

                        <Link href={`/products/${item.product?.slug || ''}`} className="group/link block">
                          <h3 className="font-serif font-medium text-[#1B3B2B] text-xs sm:text-base leading-snug group-hover/link:text-[#C89B3C] transition-colors line-clamp-1">
                            {item.product?.name}
                          </h3>
                        </Link>

                        {/* Variant Badges */}
                        {item.variant && (
                          <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-[#7C7467]">
                            <span className="inline-flex items-center gap-1 font-medium text-[#1B3B2B] bg-white border border-[#EAE3D2] px-2 py-0.5 rounded text-[9px] sm:text-[10px] shadow-2xs">
                              <Layers className="w-2.5 h-2.5 text-[#C89B3C]" />
                              {item.variant.title}
                            </span>
                            <span className="hidden xs:inline-flex items-center gap-1 text-[9px] text-[#7C7467]/80">
                              <Tag className="w-2.5 h-2.5" />
                              {item.variant.sku}
                            </span>
                          </div>
                        )}

                        <p className="text-[10px] sm:text-[11px] text-[#7C7467] font-mono pt-0.5">
                          ₹{unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-[8px] sm:text-[9px] uppercase text-[#7C7467]/60">each</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity + Line Total + Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[#EAE3D2]/80 pt-2 sm:pt-0">
                      
                      {/* Quantity Selector */}
                      <div className="flex flex-col items-start sm:items-end gap-0.5">
                        <div className="flex items-center border border-[#EAE3D2] rounded-lg bg-white p-0.5 shadow-2xs relative">
                          <button
                            disabled={currentQty <= 1}
                            onClick={() => handleQuantityChange(item.id, currentQty - 1, item.quantity)}
                            className="p-1 text-[#7C7467] hover:text-[#1B3B2B] disabled:opacity-30 active:scale-95 cursor-pointer transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="w-6 sm:w-7 text-center text-[11px] font-bold font-mono text-[#1B3B2B]">
                            {currentQty}
                          </span>

                          <button
                            disabled={stockAvailable > 0 && currentQty >= stockAvailable}
                            onClick={() => handleQuantityChange(item.id, currentQty + 1, item.quantity)}
                            className="p-1 text-[#7C7467] hover:text-[#1B3B2B] disabled:opacity-30 active:scale-95 cursor-pointer transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {stockAvailable > 0 && stockAvailable <= 10 && (
                          <span className="text-[8.5px] text-[#C89B3C] font-mono font-medium">
                            Only {stockAvailable} left
                          </span>
                        )}
                      </div>

                      {/* Line Total */}
                      <span className="font-serif font-semibold text-[#1B3B2B] text-sm sm:text-base text-right flex-1 sm:flex-initial sm:w-28">
                        ₹{itemLineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#7C7467]/60 hover:text-red-700 active:scale-90 transition-all p-1.5 cursor-pointer rounded-md hover:bg-red-50/80"
                        title="Remove Piece"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-4">
              <div className="bg-[#1B3B2B] text-[#FCFAF7] border border-[#1B3B2B] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl sticky top-6 sm:top-8 relative overflow-hidden">
                
                {/* Glow Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C89B3C]/10 rounded-full blur-xl pointer-events-none" />

                {/* Header */}
                <div className="border-b border-[#FCFAF7]/15 pb-3 flex items-center justify-between relative z-10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-[#C89B3C]" />
                      <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-[#C89B3C] font-bold">
                        Vault Assessment
                      </span>
                    </div>
                    <h2 className="font-serif text-lg sm:text-xl font-normal text-[#FCFAF7] tracking-tight">
                      Order Summary
                    </h2>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-[#C89B3C]" />
                </div>

                {/* Rows */}
                <div className="space-y-2.5 text-xs relative z-10">
                  <div className="flex justify-between items-center text-[#FCFAF7]/80">
                    <span className="font-serif italic text-xs">Subtotal</span>
                    <span className="font-mono text-[#FCFAF7] font-medium text-xs sm:text-sm">
                      ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[#FCFAF7]/80">
                    <span className="font-serif italic text-xs">Courier Shipping</span>
                    <span className="font-mono text-xs">
                      {shipping === 0 ? (
                        <span className="text-[#C89B3C] font-mono text-[9px] font-bold uppercase tracking-wider bg-[#C89B3C]/15 px-2 py-0.5 rounded border border-[#C89B3C]/30">
                          Complimentary
                        </span>
                      ) : (
                        <span className="text-[#FCFAF7] font-medium">₹{shipping.toFixed(2)}</span>
                      )}
                    </span>
                  </div>

                  <div className="border-t border-[#FCFAF7]/15 pt-3 flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="font-serif text-base sm:text-lg font-normal text-[#FCFAF7] block">Grand Total</span>
                      <span className="text-[8.5px] text-[#FCFAF7]/50 font-mono tracking-wider uppercase block">Taxes & duties included</span>
                    </div>
                    <span className="font-mono text-lg sm:text-2xl font-bold text-[#C89B3C]">
                      ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="pt-1 relative z-10">
                  <Link
                    href="/account/cart/checkout"
                    className="w-full h-10 sm:h-11 bg-[#C89B3C] hover:bg-[#D4A747] text-[#1B3B2B] font-semibold text-[11px] tracking-[0.18em] uppercase rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    Proceed to Checkout 
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Guarantees */}
                <div className="pt-3 border-t border-[#FCFAF7]/15 space-y-2 text-[10px] sm:text-[11px] text-[#FCFAF7]/70 relative z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                    <span className="font-serif italic">256-Bit Encrypted & Authenticated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                    <span className="font-serif italic">Insured Bespoke Packaging & Transit</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      {/* Clear Cart Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3B2B]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-left">
            <button 
              onClick={() => setShowClearModal(false)}
              className="absolute top-3 right-3 text-[#7C7467] hover:text-[#1B3B2B] p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-700 mb-2">
                <Trash2 className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1B3B2B]">Clear your vault?</h3>
              <p className="text-xs text-[#7C7467] font-light leading-relaxed">
                Are you sure you want to remove all items from your selection? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#7C7467] hover:text-[#1B3B2B] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Bottom Bar */}
      {items.length > 0 && !loading && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1B3B2B]/95 backdrop-blur-md border-t border-[#C89B3C]/30 px-3 py-2.5 sm:hidden shadow-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-widest text-[#FCFAF7]/60">Total</span>
            <span className="font-mono font-bold text-base text-[#C89B3C]">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <Link
            href="/cart/checkout"
            className="flex-1 h-9 bg-[#C89B3C] active:bg-[#D4A747] text-[#1B3B2B] font-bold text-[10px] tracking-[0.16em] uppercase rounded-lg flex items-center justify-center gap-1.5 shadow-md"
          >
            Checkout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

    </div>
  );
}