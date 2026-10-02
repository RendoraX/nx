'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  AlertCircle,
  Crown,
  Sparkles,
  Box,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useOrders } from '@/hooks/secure_hook/useOrder';
import { useLanguage } from '@/providers/LanguageProvider';

export default function CustomKitOrderSuccessPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { getOrder, loading, error } = useOrders();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      getOrder(orderId)
        .then((response: any) => {
          const extractedOrder = response?.order || response;
          setOrder(extractedOrder);
        })
        .catch((err: any) => {
          console.error('Failed to fetch kit order details:', err);
        });
    }
  }, [orderId, getOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B3B2B] text-[#FCFAF7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#C89B3C]/20 border-t-[#C89B3C] rounded-full animate-spin" />
            <Crown className="w-8 h-8 text-[#C89B3C] animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-normal tracking-wide text-[#FCFAF7]">
              {t('Loading order details...')}
            </h3>
            <p className="text-[11px] font-mono tracking-widest text-[#C89B3C] uppercase">
              {t('Checking your order...')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderId || error) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-4 text-red-600 shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-[#1B3B2B] mb-2">{t('Order not found')}</h2>
        <p className="text-xs text-[#7C7467] max-w-sm mb-6">
          {error || t('We could not find this order. Check the order link and try again.')}
        </p>
        <Link
          href="/kit/builder"
          className="px-6 py-3 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#254f3a] transition-all shadow-md"
        >
          {t('Open kit builder')}
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const address = order.Address || order.address || order.shippingAddress || {};
  const itemsList = order.items || order.orderItems || order.kitItems || [];

  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1B3B2B] antialiased py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Banner */}
        <div className="bg-[#1B3B2B] text-[#FCFAF7] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl border border-[#1B3B2B]">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-[#C89B3C]/20 border border-[#C89B3C]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C89B3C] shadow-inner">
            <CheckCircle2 className="w-9 h-9 stroke-[1.75]" />
          </div>

          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C89B3C] font-bold block mb-1">
            {t('Order confirmed')}
          </span>

          <h1 className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-[#FCFAF7] mb-2">
            {t('Your puja kit is being prepared')}
          </h1>

          <p className="text-xs sm:text-sm text-[#FCFAF7]/70 font-serif italic max-w-md mx-auto mb-6">
            {t('Your order number')} <span className="font-mono text-[#C89B3C] not-italic font-bold">{order.id || orderId}</span> {t('was placed on')} {formattedDate}.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#FCFAF7]/10 border border-[#FCFAF7]/15 rounded-full px-4 py-1.5 text-[11px] font-mono text-[#FCFAF7]">
            <Clock className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>{t('Estimated delivery: 1 - 3 business days')}</span>
          </div>
        </div>

        {/* Address & Items Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#EAE3D2]/80 pb-2.5">
              <MapPin className="w-4 h-4 text-[#C89B3C]" />
              <h3 className="font-serif text-sm font-medium text-[#1B3B2B]">{t('Delivery address')}</h3>
            </div>
            <div className="text-xs space-y-1 text-[#7C7467]">
              <p className="font-serif font-medium text-[#1B3B2B]">{address.fullName || t('Customer')}</p>
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p>{address.city}, {address.state} - {address.postalCode}</p>
              <p className="font-mono text-[11px] pt-1 text-[#1B3B2B]">{t('Phone number')}: {address.phone}</p>
            </div>
          </div>

          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#EAE3D2]/80 pb-2.5">
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              <h3 className="font-serif text-sm font-medium text-[#1B3B2B]">{t('Kit status')}</h3>
            </div>
            <div className="text-xs space-y-2 text-[#7C7467]">
              <div className="flex justify-between border-b border-[#EAE3D2]/40 pb-1.5">
                <span>{t('Status')}:</span>
                <span className="font-mono text-[#1B3B2B] font-bold uppercase">{order.status || 'PROCESSING'}</span>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D2]/40 pb-1.5">
                <span>{t('Payment')}:</span>
                <span className="font-mono text-[#1B3B2B]">{order.paymentMethod || 'ONLINE'}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="font-serif font-medium text-[#1B3B2B]">{t('Total paid')}:</span>
                <span className="font-mono text-[#C89B3C] font-bold">
                  ₹{(order.totalAmount || order.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kit Items List */}
        <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D2]/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C89B3C]" />
              <h3 className="font-serif text-base text-[#1B3B2B]">{t('Your kit items')} ({itemsList.length})</h3>
            </div>
          </div>

          <div className="divide-y divide-[#EAE3D2]/60">
            {itemsList.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className="relative w-12 h-14 bg-white border border-[#EAE3D2] rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.images?.[0]?.url || item.image ? (
                    <Image 
                      src={item.product?.images?.[0]?.url || item.image} 
                      alt={item.product?.name || item.name || 'Kit item'} 
                      fill 
                      sizes="48px"
                      className="object-cover" 
                    />
                  ) : (
                    <Box className="w-4 h-4 text-[#7C7467] m-auto" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif text-[#1B3B2B] truncate">{item.product?.name || item.name}</h4>
                  <p className="text-[10px] font-mono text-[#7C7467]">
                    {t('Quantity')}: <span className="font-bold text-[#1B3B2B]">{item.quantity}</span>
                  </p>
                </div>
                <div className="text-right font-mono text-xs font-medium text-[#1B3B2B]">
                  ₹{((item.price || item.unitPrice || 0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/account/orders"
            className="w-full sm:w-auto px-6 py-3 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-xl text-center hover:bg-[#254f3a] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('Track order status')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/kit/builder"
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#EAE3D2] text-[#1B3B2B] text-xs font-bold uppercase tracking-wider rounded-xl text-center hover:bg-[#FCFAF7] transition-all"
          >
            {t('Build another kit')}
          </Link>
        </div>

      </div>
    </div>
  );
}