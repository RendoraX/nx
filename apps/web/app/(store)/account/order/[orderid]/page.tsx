// app/account/order/[orderid]/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

interface ProductAttribute {
  label: string;
  value: string;
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  attributes: ProductAttribute[];
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  createdAt: string;
  status: OrderStatus;
  statusLabel: string;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: OrderItem[];
}

const mockOrderData: OrderDetail = {
  id: "54stg47851sa963",
  createdAt: "May 25, 2026",
  status: "PENDING",
  statusLabel: "Pending Approval",
  totalAmount: 124.50,
  subtotal: 114.50,
  tax: 5.00,
  shippingFee: 5.00,
  shippingAddress: {
    fullName: "Samuel Wilson",
    line1: "123 Premium Lane, Suite 400",
    city: "Los Angeles",
    state: "California",
    postalCode: "90001"
  },
  items: [
    {
      id: "item-1",
      productId: "prod-1",
      name: "Red Bali Premium Botanical Extract (Size 10)",
      attributes: [
        { label: "Capsule size", value: "00 (500mg-600mg per capsule)" },
        { label: "Capsule quantity", value: "100 capsules" }
      ],
      quantity: 1,
      price: 40.50
    }
  ]
};

export default function OrderDetailPage({ params }: { params: { orderid: string } }) {
  const [order, setOrder] = useState<OrderDetail>(mockOrderData);
  const [isCancelling, setIsCancelling] = useState(false);

  // Business Protection Guard: Only allow user cancellation during the 'PENDING' phase.
  // Once status maps to CONFIRMED, PACKED, or beyond, self-service cancellation closes down.
  const isCancellable = order.status === 'PENDING';

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your order? We process things quickly, so this action cannot be undone."
    );
    if (!confirmCancel) return;
    
    setIsCancelling(true);
    
    // Simulate database update
    setTimeout(() => {
      setOrder(prev => ({
        ...prev,
        status: 'CANCELLED',
        statusLabel: 'Cancelled & Refunded'
      }));
      setIsCancelling(false);
    }, 800);
  };

  // Humanizes status labels gracefully for customer presentation layers
  const getFriendlyStatusLabel = (status: OrderStatus): string => {
    const mapping: Record<OrderStatus, string> = {
      PENDING: 'Order Placed',
      CONFIRMED: 'Confirmed & Preparing',
      PACKED: 'Packed & Sealed',
      SHIPPED: 'Dispatched to Courier',
      OUT_FOR_DELIVERY: 'Out for Delivery Today',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled & Refunded'
    };
    return mapping[status];
  };

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
              <Calendar className="h-3.5 w-3.5 text-[#C89B3C]" /> Registered: {order.createdAt}
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
            
            {order.items.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-5 shadow-sm transition-all hover:border-[#1B3B2B]/30 flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white border border-[#EAE3D2] rounded-lg flex items-center justify-center text-[#1B3B2B] flex-shrink-0">
                    <Package className="h-6 w-6 stroke-[1.25] text-[#C89B3C]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-serif font-medium text-sm text-[#1A1A1A] leading-snug">{item.name}</h4>
                    <div className="space-y-1">
                      {item.attributes.map((attr, idx) => (
                        <p key={idx} className="text-xs text-[#7C7467]">
                          <span className="font-medium text-[#A39785]">{attr.label}:</span> {attr.value}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end sm:justify-start gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#EAE3D2]/60">
                  <span className="text-sm font-bold text-[#1A1A1A] font-mono">
                    ₹{item.price.toFixed(2)} <span className="text-xs text-[#7C7467] font-normal font-sans">x {item.quantity}</span>
                  </span>
                  
                  <Link
                    href={`/products/${item.productId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B3B2B] hover:text-[#C89B3C] uppercase tracking-wider transition-colors mt-auto group"
                  >
                    View Product <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Stack: Address & Summary Info */}
          <div className="space-y-6">
            
            <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em] border-b border-[#EAE3D2] pb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#C89B3C]" /> Shipping Address
              </h4>
              <div className="text-xs text-[#7C7467] space-y-1 font-light leading-relaxed">
                <p className="font-semibold text-[#1A1A1A]">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p className="font-mono">{order.shippingAddress.postalCode}</p>
              </div>
            </div>

            <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em] border-b border-[#EAE3D2] pb-2">
                Payment Summary
              </h4>
              <div className="space-y-3 text-xs divide-y divide-[#EAE3D2]/60">
                <div className="flex justify-between text-[#7C7467] pt-1">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7C7467] pt-2">
                  <span>Shipping & Handling:</span>
                  <span className="font-mono">₹{order.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7C7467] pt-2">
                  <span>Estimated Tax:</span>
                  <span className="font-mono">₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1B3B2B] font-bold text-sm pt-3">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-base">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}