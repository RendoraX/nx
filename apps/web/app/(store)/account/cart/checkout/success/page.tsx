'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  MapPin, 
  Receipt, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Download,
  Phone,
  AlertCircle,
  PackageCheck,
  Crown
} from 'lucide-react';
import { useOrders } from '@/hooks/secure_hook/useOrder';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { getOrder, loading, error } = useOrders();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      getOrder(orderId)
        .then((response: any) => {
          // Extract order object whether wrapped in response.order or returned directly
          const extractedOrder = response?.order || response;
          setOrder(extractedOrder);
        })
        .catch((err: any) => {
          console.error('Failed to fetch order details:', err);
        });
    }
  }, [orderId, getOrder]);

  // 1. Premium Animated Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B3B2B] text-[#FCFAF7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm">
          {/* Pulsing Crown & Spinner Container */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#C89B3C]/20 border-t-[#C89B3C] rounded-full animate-spin" />
            <Crown className="w-8 h-8 text-[#C89B3C] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl font-normal tracking-wide text-[#FCFAF7]">
              Retrieving Vault Ledger
            </h3>
            <p className="text-[11px] font-mono tracking-widest text-[#C89B3C] uppercase">
              Verifying Bespoke Transaction Details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (!orderId || error) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-4 text-red-600 shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-[#1B3B2B] mb-2">Order Not Found</h2>
        <p className="text-xs text-[#7C7467] max-w-sm mb-6">
          {error || 'No valid order reference was identified in the dispatch ledger.'}
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#254f3a] transition-all shadow-md"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  // Fallback while waiting for setOrder
  if (!order) return null;

  // Safe Property Mapping across backend variants
  const address = order.Address || order.address || order.shippingAddress || {};
  const payment = order.payment || {};
  const itemsList = order.items || order.orderItems || [];

  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const paymentProvider = payment.provider || order.paymentMethod || 'COD';
  const paymentStatus = payment.status || order.status || 'PENDING';

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1B3B2B] antialiased py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Success Hero Header */}
        <div className="bg-[#1B3B2B] text-[#FCFAF7] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl border border-[#1B3B2B]">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-[#C89B3C]/20 border border-[#C89B3C]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C89B3C] shadow-inner">
            <CheckCircle2 className="w-9 h-9 stroke-[1.75]" />
          </div>

          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C89B3C] font-bold block mb-1">
            Order Confirmed & Secured
          </span>

          <h1 className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-[#FCFAF7] mb-2">
            Thank You for Your Selection
          </h1>

          <p className="text-xs sm:text-sm text-[#FCFAF7]/70 font-serif italic max-w-md mx-auto mb-6">
            Your order reference <span className="font-mono text-[#C89B3C] not-italic font-bold">{order.id || orderId}</span> has been logged into our vault ledger on {formattedDate}.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#FCFAF7]/10 border border-[#FCFAF7]/15 rounded-full px-4 py-1.5 text-[11px] font-mono text-[#FCFAF7]">
            <Clock className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>Estimated Dispatch: 2 - 4 Business Days</span>
          </div>
        </div>

        {/* Dispatch & Payment Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Address Card */}
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#EAE3D2]/80 pb-2.5">
              <MapPin className="w-4 h-4 text-[#C89B3C]" />
              <h3 className="font-serif text-sm font-medium text-[#1B3B2B]">Dispatch Destination</h3>
            </div>
            
            <div className="text-xs space-y-1 text-[#7C7467]">
              <p className="font-serif font-semibold text-[#1B3B2B] text-sm">
                {address.fullName || 'Valued Client'}
              </p>
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p>{address.city}, {address.state} - <span className="font-mono">{address.postalCode}</span></p>
              {address.phone && (
                <p className="pt-1 font-mono text-[11px] flex items-center gap-1.5 text-[#1B3B2B]">
                  <Phone className="w-3 h-3 text-[#C89B3C]" />
                  {address.phone}
                </p>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#EAE3D2]/80 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
              <h3 className="font-serif text-sm font-medium text-[#1B3B2B]">Payment Verification</h3>
            </div>
            
            <div className="text-xs space-y-2 text-[#7C7467]">
              <div>
                <span className="text-[9.5px] font-mono uppercase text-[#7C7467] block">Method</span>
                <p className="font-serif text-[#1B3B2B] uppercase font-medium">
                  {paymentProvider === 'COD' ? 'Cash On Delivery' : paymentProvider}
                </p>
              </div>

              <div>
                <span className="text-[9.5px] font-mono uppercase text-[#7C7467] block">Status</span>
                <span className="inline-block text-[10px] font-mono font-bold text-[#1B3B2B] bg-[#C89B3C]/20 border border-[#C89B3C]/40 px-2 py-0.5 rounded mt-0.5 uppercase">
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Receipt Section */}
        <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D2]/80 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#C89B3C]" />
              <h3 className="font-serif text-base font-medium text-[#1B3B2B]">Itemized Valuation</h3>
            </div>
            <button 
              onClick={() => window.print()} 
              className="text-[10px] font-mono uppercase tracking-wider text-[#C89B3C] hover:text-[#1B3B2B] flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Items List */}
          <div className="divide-y divide-[#EAE3D2]/60">
            {itemsList.map((item: any) => {
              const variant = item.variant || {};
              const product = variant.product || item.product || {};
              const price = Number(item.price || variant.price || product.price || 0);
              const quantity = Number(item.quantity || 1);

              return (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-12 bg-white border border-[#EAE3D2] rounded-md overflow-hidden flex-shrink-0">
                      {product.images?.[0]?.url ? (
                        <Image 
                          src={product.images[0].url} 
                          alt={product.name || 'Product'} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <PackageCheck className="w-4 h-4 text-[#C89B3C] m-auto" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-serif text-[#1B3B2B] font-medium truncate">
                        {product.name || 'Bespoke Item'}
                      </h4>
                      <p className="text-[10.5px] font-mono text-[#7C7467]">
                        {variant.size ? `${variant.size} • ` : ''}
                        Quantity: <span className="font-bold text-[#1B3B2B]">{quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="font-mono text-xs font-semibold text-[#1B3B2B] text-right">
                    ₹{(price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Calculation */}
          <div className="border-t border-[#EAE3D2] pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-[#7C7467]">
              <span className="font-serif italic">Subtotal</span>
              <span className="font-mono">
                ₹{Number(order.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#7C7467]">
              <span className="font-serif italic">Insured Express Shipping</span>
              <span className="font-mono text-[#C89B3C] uppercase text-[10px] font-bold">
                {Number(order.shippingAmount || 0) === 0 ? 'Complimentary' : `₹${order.shippingAmount}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#1B3B2B] pt-2 border-t border-[#EAE3D2]/60">
              <span className="font-serif">Grand Total</span>
              <span className="font-mono text-base font-bold text-[#C89B3C]">
                ₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            href="/account?tab=orders"
            className="w-full sm:w-auto px-6 py-3 bg-[#FCFAF7] border border-[#EAE3D2] text-[#1B3B2B] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white text-center transition-all shadow-2xs"
          >
            Track Order Status
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#254f3a] text-center transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}