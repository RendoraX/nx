'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  ExternalLink,
  AlertCircle,
  Loader2,
  Phone,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { useOrders } from '@/hooks/secure_hook/useOrder'; // Adjust path if needed

type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export default function OrderDetailPage({ params }: { params: Promise<{ orderid: string }> }) {
  // Unwrap params safely for Next.js 14/15 App Router
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderid;

  const { getOrder, cancelOrder, loading: apiLoading, error: apiError } = useOrders();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // 1. Fetch real order data on mount
  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrder(orderId)
        .then((response: any) => {
          // Extract order whether returned directly or inside response.order
          const fetchedOrder = response?.order || response;
          if (!fetchedOrder || (!fetchedOrder.id && !fetchedOrder._id)) {
            throw new Error("Order details could not be parsed.");
          }
          setOrder(fetchedOrder);
        })
        .catch((err: any) => {
          console.error("Error fetching order details:", err);
          setError(err?.message || "Failed to load order details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, getOrder]);

  // Business Protection Guard: Only allow user cancellation during PENDING phase.
  const isCancellable = order?.status === 'PENDING';

  // 2. Real Cancellation Handler
  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your order? This action will restore stock and cannot be undone."
    );
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      if (cancelOrder) {
        await cancelOrder(order.id || orderId);
      }
      setOrder((prev: any) => ({
        ...prev,
        status: 'CANCELLED',
      }));
    } catch (err: any) {
      alert(err?.message || "Failed to cancel order. Please contact support.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Friendly human-readable label mapper
  const getFriendlyStatusLabel = (status: OrderStatus | string): string => {
    const mapping: Record<string, string> = {
      PENDING: 'Order Placed',
      CONFIRMED: 'Confirmed & Preparing',
      PACKED: 'Packed & Sealed',
      SHIPPED: 'Dispatched to Courier',
      OUT_FOR_DELIVERY: 'Out for Delivery Today',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled & Refunded'
    };
    return mapping[status] || status || 'Processing';
  };

  // 3. Premium Loading State
  if (loading || apiLoading) {
    return (
      <div className="min-h-screen bg-[#1B3B2B] text-[#FCFAF7] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#C89B3C]/20 border-t-[#C89B3C] rounded-full animate-spin" />
            <Crown className="w-8 h-8 text-[#C89B3C] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl font-normal tracking-wide text-[#FCFAF7]">
              Retrieving Vault Ledger
            </h3>
            <p className="text-[11px] font-mono tracking-widest text-[#C89B3C] uppercase">
              Loading Order Details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Error State
  if (error || apiError || !order) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-4 text-red-600 shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-[#1B3B2B] mb-2">Order Not Found</h2>
        <p className="text-xs text-[#7C7467] max-w-sm mb-6">
          {error || apiError || 'No record matching this identifier was found in your order history.'}
        </p>
        <Link
          href="/account?tab=orders"
          className="px-6 py-3 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#254f3a] transition-all shadow-md"
        >
          Return to Order History
        </Link>
      </div>
    );
  }

  // Safe Mappings from backend Prisma schema
  const address = order.Address || order.address || order.shippingAddress || {};
  const payment = order.payment || {};
  const itemsList = order.items || order.orderItems || [];

  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const subtotal = Number(order.subtotal || 0);
  const shippingFee = Number(order.shippingAmount || order.shippingFee || 0);
  const totalAmount = Number(order.totalAmount || 0);
  const paymentProvider = payment.provider || order.paymentMethod || 'COD';

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Navigation Top Deck */}
        <div className="flex items-center justify-between">
          <Link 
            href="/account?tab=orders" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A39785] uppercase tracking-widest hover:text-[#1B3B2B] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2]" /> Back to Order History
          </Link>
          <span className="text-xs font-mono text-[#7C7467]">Order ID: {order.id}</span>
        </div>

        {/* Dynamic Advisory Banner */}
        {isCancellable && (
          <div className="bg-[#FCFAF7] border-l-4 border-[#C89B3C] rounded-r-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-[#C89B3C] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-wider">Fulfillment Advisory</h4>
              <p className="text-xs text-[#7C7467] leading-relaxed max-w-3xl">
                As a boutique, specialized startup, our team prepares items almost immediately. You can cancel your order directly below only while status remains unconfirmed. Once status transitions out of pending, cancellation functions lock out.
              </p>
            </div>
          </div>
        )}

        {/* Master Identity Header Board */}
        <div className="bg-[#1B3B2B] rounded-xl p-8 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold text-[#FCFAF7] tracking-tight">Order #{order.id}</h1>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                order.status === 'CANCELLED' 
                  ? 'bg-red-950/40 text-red-400 border-red-900' 
                  : 'bg-[#FCFAF7]/10 text-[#FCFAF7] border-[#FCFAF7]/30'
              }`}>
                {getFriendlyStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-xs text-[#EAE3D2]/80 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#C89B3C]" /> Registered: {formattedDate}
            </p>
          </div>

          {/* Conditional Action Button */}
          {isCancellable && (
            <div className="relative z-10">
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-full md:w-auto px-5 py-2.5 bg-transparent border border-red-400/40 text-red-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>

        {/* Layout Partition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Items Manifest */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1B3B2B] border-b border-[#EAE3D2] pb-2">Items in this Order</h3>
            
            {itemsList.map((item: any) => {
              const variant = item.variant || {};
              const product = variant.product || item.product || {};
              const price = Number(item.price || variant.price || product.price || 0);
              const quantity = Number(item.quantity || 1);
              const imageUrl = product.images?.[0]?.url;

              return (
                <div 
                  key={item.id} 
                  className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-5 shadow-sm transition-all hover:border-[#1B3B2B]/30 flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 bg-white border border-[#EAE3D2] rounded-lg overflow-hidden flex items-center justify-center text-[#1B3B2B] flex-shrink-0">
                      {imageUrl ? (
                        <Image 
                          src={imageUrl} 
                          alt={product.name || 'Product'} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <Package className="h-6 w-6 stroke-[1.25] text-[#C89B3C]" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-serif font-medium text-sm text-[#1A1A1A] leading-snug">
                        {product.name || 'Bespoke Item'}
                      </h4>
                      <div className="space-y-1 text-xs text-[#7C7467]">
                        {variant.size && (
                          <p>
                            <span className="font-medium text-[#A39785]">Size:</span> {variant.size}
                          </p>
                        )}
                        {variant.sku && (
                          <p>
                            <span className="font-medium text-[#A39785]">SKU:</span> {variant.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-end sm:justify-start gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#EAE3D2]/60">
                    <span className="text-sm font-bold text-[#1A1A1A] font-mono">
                      ₹{price.toFixed(2)} <span className="text-xs text-[#7C7467] font-normal font-sans">x {quantity}</span>
                    </span>
                    
                    {(product.slug || item.productId) && (
                      <Link
                        href={`/products/${product.slug || item.productId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B3B2B] hover:text-[#C89B3C] uppercase tracking-wider transition-colors mt-auto group"
                      >
                        View Product <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side Stack: Address & Summary Info */}
          <div className="space-y-6">
            
            {/* Shipping Address */}
            <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em] border-b border-[#EAE3D2] pb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#C89B3C]" /> Shipping Address
              </h4>
              <div className="text-xs text-[#7C7467] space-y-1 font-light leading-relaxed">
                <p className="font-semibold text-[#1A1A1A]">{address.fullName || 'Valued Client'}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                <p>{address.city}, {address.state}</p>
                <p className="font-mono">{address.postalCode}</p>
                {address.phone && (
                  <p className="pt-1 font-mono text-[11px] flex items-center gap-1.5 text-[#1B3B2B]">
                    <Phone className="w-3 h-3 text-[#C89B3C]" />
                    {address.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em] border-b border-[#EAE3D2] pb-2 flex items-center justify-between">
                <span>Payment Summary</span>
                <span className="text-[10px] font-mono text-[#C89B3C]">{paymentProvider}</span>
              </h4>
              <div className="space-y-3 text-xs divide-y divide-[#EAE3D2]/60">
                <div className="flex justify-between text-[#7C7467] pt-1">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7C7467] pt-2">
                  <span>Shipping & Handling:</span>
                  <span className="font-mono text-[#C89B3C] uppercase text-[10px] font-bold">
                    {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#1B3B2B] font-bold text-sm pt-3">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-base">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}