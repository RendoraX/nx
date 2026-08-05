// apps/web/app/account/components/AccountOrdersTab.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, Tag, CreditCard, ChevronDown, ChevronRight, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image?: string;
}

interface ProductAttribute {
  label: string;
  value: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number | string;
  product?: Product;
  attributes?: ProductAttribute[];
}

interface Order {
  id: string;
  status: string;
  totalAmount: number | string;
  createdAt: string | Date;
  items?: OrderItem[];
}

interface AccountOrdersTabProps {
  orders?: Order[];
  isLoading?: boolean;
}

export default function AccountOrdersTab({ orders, isLoading = false }: AccountOrdersTabProps) {
  const displayedOrders = orders && orders.length > 0 ? orders : [];
  
  // Track open state IDs. First item open by default for a better user experience.
  const [openOrderIds, setOpenOrderIds] = useState<string[]>(
    displayedOrders.length > 0 ? [displayedOrders[0].id] : []
  );

  const toggleOrder = (orderId: string) => {
    setOpenOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Format Status into readable string
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  // Skeleton Loader for fetching state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in text-left">
        {/* Banner Skeleton */}
        <div className="bg-[#1B3B2B] border border-[#1B3B2B] rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm">
          <div className="space-y-3 text-center sm:text-left w-full sm:w-1/2">
            <div className="h-7 w-48 bg-[#FCFAF7]/10 rounded-md animate-pulse"></div>
            <div className="h-3 w-3/4 bg-[#FCFAF7]/10 rounded-md animate-pulse"></div>
          </div>
          <div className="mt-6 sm:mt-0 bg-[#FCFAF7]/10 backdrop-blur-sm border border-[#FCFAF7]/20 rounded-lg px-6 py-4 flex items-center gap-4 min-w-[200px]">
            <div className="h-8 w-8 bg-[#C89B3C]/30 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-2.5 w-20 bg-[#FCFAF7]/20 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-[#FCFAF7]/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Orders Card Skeletons */}
        <div className="space-y-6">
          {[1, 2].map((idx) => (
            <div key={idx} className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#1B3B2B]/5 px-6 py-5 border-b border-[#EAE3D2] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="h-4 w-32 bg-[#1A1A1A]/20 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-[#1B3B2B]/20 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-28 bg-[#1B3B2B]/10 rounded-md border border-[#EAE3D2] animate-pulse"></div>
              </div>
              <div className="p-6 bg-white divide-y divide-[#EAE3D2]/60">
                <div className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FCFAF7] border border-[#EAE3D2] rounded-md animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-64 bg-[#1A1A1A]/15 rounded animate-pulse"></div>
                      <div className="h-3 w-40 bg-[#A39785]/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-[#1A1A1A]/15 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="bg-[#1B3B2B] border border-[#1B3B2B] rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <h2 className="font-serif text-2xl font-semibold text-[#FCFAF7] tracking-tight">Your Orders</h2>
          <p className="text-xs text-[#EAE3D2] tracking-wide max-w-md">
            View your recent order history, track shipments, and access purchase details.
          </p>
        </div>
        <div className="relative z-10 mt-6 sm:mt-0 bg-[#FCFAF7]/10 backdrop-blur-sm border border-[#FCFAF7]/20 rounded-lg px-6 py-4 flex items-center gap-4 text-[#FCFAF7]">
          <ShoppingBag className="h-8 w-8 text-[#C89B3C]" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#EAE3D2] block font-mono">Total Orders</span>
            <span className="text-2xl font-bold tracking-tight font-serif">{displayedOrders.length} Orders</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {displayedOrders.length === 0 ? (
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-20 text-center shadow-sm max-w-xl mx-auto">
            <Package className="h-12 w-12 text-[#A39785] mx-auto mb-4 stroke-[1.5]" />
            <h4 className="font-serif text-lg text-[#1B3B2B] font-medium">No Orders Placed Yet</h4>
            <p className="text-sm text-[#7C7467] font-light mt-1">When you place an order, it will appear here with complete delivery details.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayedOrders.map((order) => {
              const isOpen = openOrderIds.includes(order.id);
              const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

              return (
                <div key={order.id} className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:border-[#1B3B2B]/20">
                  
                  {/* Clean Header Row */}
                  <div 
                    onClick={() => toggleOrder(order.id)}
                    className="bg-[#1B3B2B]/5 px-6 py-4 border-b border-[#EAE3D2] flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-[#1B3B2B]/10 transition-colors group select-none"
                  >
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-[#7C7467]">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#1B3B2B]/10 p-1.5 rounded-md text-[#1B3B2B]">
                          <ChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A39785] block font-semibold uppercase tracking-[0.05em] mb-0.5">Order Date</span>
                          <span className="text-[#1A1A1A] font-semibold flex items-center gap-1 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-[#C89B3C]" />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A39785] block font-semibold uppercase tracking-[0.05em] mb-0.5">Total Amount</span>
                        <span className="text-[#1B3B2B] font-extrabold text-sm flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-[#C89B3C]" />
                          ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A39785] block font-semibold uppercase tracking-[0.05em] mb-0.5">Items</span>
                        <span className="text-[#1A1A1A] font-semibold">
                          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded border bg-white border-[#EAE3D2] text-[#1B3B2B] shadow-sm">
                        {formatStatus(order.status)}
                      </span>
                      <Link 
                        href={`/account/order/${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-[#1B3B2B]/10 text-[#A39785] hover:text-[#1B3B2B] transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="View Full Order Details"
                      >
                        <span className="hidden sm:inline">Details</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Collapsible Container Segment */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                    <div className="overflow-hidden">
                      <div className="p-6 divide-y divide-[#EAE3D2]/60 bg-white">
                        {order.items?.map((item, index) => (
                          <Link
                            href={`/account/order/${order.id}`}
                            key={item.id || index} 
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 group/item cursor-pointer"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-[#FCFAF7] border border-[#EAE3D2] rounded-md flex items-center justify-center flex-shrink-0 text-[#1B3B2B] group-hover/item:border-[#1B3B2B]/30 transition-colors">
                                <Tag className="h-5 w-5 stroke-[1.5] text-[#C89B3C]" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-serif font-medium text-sm text-[#1A1A1A] group-hover/item:text-[#1B3B2B] transition-colors">
                                  {item.product?.name || 'Product Item'}
                                </p>
                                {item.attributes && item.attributes.map((attr, idx) => (
                                  <p key={idx} className="text-[11px] text-[#A39785]">
                                    {attr.label}: <span className="text-[#7C7467]">{attr.value}</span>
                                  </p>
                                ))}
                                <div className="flex items-center gap-3 text-xs text-[#7C7467] pt-0.5">
                                  <span>Quantity: <strong className="text-[#1A1A1A] font-mono font-bold">{item.quantity}</strong></span>
                                  <span>•</span>
                                  <span>Price: ₹{Number(item.price).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 self-end sm:self-auto">
                              <span className="text-sm font-bold text-[#1A1A1A] font-mono">
                                ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                              </span>
                              <ChevronRight className="h-4 w-4 text-[#A39785] hidden sm:block opacity-0 group-hover/item:opacity-100 transition-all transform translate-x-[-4px] group-hover/item:translate-x-0" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}