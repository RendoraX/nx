'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Plus, 
  Check, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Truck, 
  Receipt, 
  ShoppingBag, 
  AlertCircle,
  Phone,
  User as UserIcon,
  PackageCheck,
  Layers
} from 'lucide-react';

import { useAddressBook } from '@/hooks/useAddressBooks';
import { useOrders } from '@/hooks/secure_hook/useOrder';
import { usePayment } from '@/hooks/secure_hook/usePayment';
import { useCustomerKit } from '@/hooks/useCustomerKit';
import AddressFormDialog from '@/components/account/address/AddressFormDialouge';
import CheckoutButton from '@/components/account/checkout/checkoutButton';

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  sku: string;
  price: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  sku: string;
  isActive: boolean;
  categoryId: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface TemplateItem {
  id: string;
  templateId: string;
  productId: string;
  quantity: number;
  product?: Product;
  selectedVariant?: ProductVariant | null;
}

export interface RitualTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  curatedBy: string;
  baseBoxPrice: number;
  isActive: boolean;
  isManualPrice?: boolean;
  defaultItems: TemplateItem[];
}

export interface CustomizedItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface CreateBespokeKitPayload {
  templateId: string;
  templateName: string;
  baseBoxPrice: number;
  items: CustomizedItem[];
  totalPrice: number;
}

export interface product {
  name: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number | string;
  Product: product;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number | string;
  shippingAmount: number | string;
  totalAmount: number | string;
  addressId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItem[];
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  revoked: boolean;
  createdAt: string | Date;
  lastUsedAt: string | Date | null;
  expiresAt: string | Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  isVerified: boolean;
  phone: string | null;
  role: 'USER' | 'ADMIN' | 'DELIVERY' | 'SUPER_ADMIN';
  orders: Order[];
  cart: Cart | null;
  sessions: Session[];
  reviews: any;
  addresses: Address[];
  notifications: any;
  currentSessionId: string;
}

const SHIPPING_THRESHOLD = 500;
const STORAGE_KEY = 'active_custom_kit';

export default function KitCheckoutPage() {
  const router = useRouter();
  
  const { catalogKits, isLoading: isCatalogLoading } = useCustomerKit();
  const { addresses, addAddress } = useAddressBook();
  const { createOrder, loading: isOrderLoading, error: orderHookError } = useOrders();
  const { startPayment, loading: isPaymentLoading, error: paymentHookError } = usePayment();

  const [kitPayload, setKitPayload] = useState<CreateBespokeKitPayload | null>(null);
  const [isPayloadLoaded, setIsPayloadLoaded] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawPayload = localStorage.getItem(STORAGE_KEY);
      if (rawPayload) {
        const parsed: CreateBespokeKitPayload = JSON.parse(rawPayload);
        setKitPayload(parsed);
      }
    } catch (err) {
      console.error('Failed to parse active custom kit payload from localStorage', err);
      setCheckoutError('Invalid ritual kit data found in session.');
    } finally {
      setIsPayloadLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = (addresses as any[]).find((a: any) => a.isDefault) || addresses[0];
      if (defaultAddr?.id) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [addresses, selectedAddressId]);

  const handleCreateAddress = async (formData: any) => {
    try {
      setCheckoutError(null);
      const result: any = await addAddress(formData);
      const createdId = result?.data?.id;
      if (createdId) {
        setSelectedAddressId(createdId);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Failed to register delivery address.');
      throw err;
    }
  };

  const activeKitBlueprint = (catalogKits as any[])?.find(
    (kit: any) => kit.id === kitPayload?.templateId
  );

  const activeKitItems = (kitPayload?.items || [])
    .map((savedItem: CustomizedItem) => {
      const defaultTemplateItemMatch = activeKitBlueprint?.defaultItems?.find(
        (item: any) => item.productId === savedItem.productId
      );

      return {
        productId: savedItem.productId,
        variantId: savedItem.variantId,
        quantity: savedItem.quantity,
        product: defaultTemplateItemMatch?.product,
        selectedVariant: defaultTemplateItemMatch?.selectedVariant
      };
    })
    .filter((item) => item.quantity > 0);

  const kitBasePrice = kitPayload?.baseBoxPrice ?? activeKitBlueprint?.baseBoxPrice ?? 0;
  
  const itemsSubtotal = activeKitItems.reduce((acc, item) => {
    const unitPrice = item.selectedVariant 
      ? item.selectedVariant.price 
      : item.product?.price || 0;
    return acc + unitPrice * item.quantity;
  }, 0);

  const subtotal = kitBasePrice + itemsSubtotal;
  const shipping = subtotal >= SHIPPING_THRESHOLD || activeKitItems.length === 0 ? 0 : 40;
  const grandTotal = subtotal + shipping;

  const selectedAddress = (addresses as any[])?.find((a: any) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setCheckoutError('Please select a delivery address.');
      return;
    }

    if (!kitPayload || activeKitItems.length === 0) {
      setCheckoutError('Your bespoke kit configuration is empty.');
      return;
    }

    try {
      setCheckoutError(null);

      const createdOrder = await createOrder({
        addressId: selectedAddressId,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
        isKitOrder: true,
        kitDetails: kitPayload
      } as any);

      const orderRef = createdOrder?.order?.id || (createdOrder as any)?.id;

      if (!orderRef) {
        throw new Error('Order creation succeeded, but no valid Order ID was returned.');
      }

      const handleOrderSuccess = () => {
        localStorage.removeItem(STORAGE_KEY);
        router.push(`/account/cart/checkout/success?orderId=${orderRef}`);
      };

      if (paymentMethod === 'cod') {
        handleOrderSuccess();
        return;
      }

      await startPayment({
        orderId: orderRef,
        amount: grandTotal,
        prefill: {
          name: selectedAddress?.fullName || '',
          contact: selectedAddress?.phone || ''
        },
        onSuccess: () => {
          handleOrderSuccess();
        },
        onFailure: (err: any) => {
          setCheckoutError(err?.message || 'Payment was cancelled or failed.');
        }
      });

    } catch (err: any) {
      setCheckoutError(
        err?.response?.data?.message || err?.message || 'An unexpected error occurred during checkout processing.'
      );
    }
  };

  const isSubmittingOrder = isOrderLoading || isPaymentLoading;
  const activeError = checkoutError || orderHookError || paymentHookError;

  if (!isPayloadLoaded || isCatalogLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-widest text-[#1B3B2B] uppercase">Preparing Custom Kit Checkout...</p>
        </div>
      </div>
    );
  }

  if (!kitPayload || activeKitItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-[#1B3B2B]/5 rounded-full flex items-center justify-center mx-auto text-[#C89B3C]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl text-[#1B3B2B]">No Active Ritual Kit Selected</h2>
          <p className="text-xs text-[#7C7467]">Customize your bespoke ritual blueprint before proceeding to checkout.</p>
          <Link href="/account/kit/builder" className="inline-block px-6 py-2.5 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-lg">
            Open Kit Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1B3B2B] antialiased pb-28 sm:pb-12">
      <header className="border-b border-[#EAE3D2] bg-[#FCFAF7]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/account/kit/builder" className="flex items-center gap-1.5 text-xs font-mono text-[#7C7467] hover:text-[#1B3B2B] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline uppercase tracking-wider">Back to Builder</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
            <span className="font-serif text-sm sm:text-base font-medium tracking-tight text-[#1B3B2B]">
              Encrypted Kit Checkout
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#C89B3C] bg-[#C89B3C]/10 px-2.5 py-1 rounded-full border border-[#C89B3C]/20">
            <Lock className="w-3 h-3" />
            <span>256-BIT SSL</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeError && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-3 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-mono">{activeError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 text-left">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <section className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D2]/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1B3B2B] text-[#FCFAF7] text-xs font-mono flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="font-serif text-base sm:text-lg text-[#1B3B2B] font-medium">
                    Delivery Address
                  </h2>
                </div>

                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#C89B3C] hover:text-[#1B3B2B] uppercase tracking-wider bg-white border border-[#EAE3D2] px-3 py-1.5 rounded-lg shadow-2xs transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {(!addresses || addresses.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-[#EAE3D2] rounded-xl p-4 bg-white">
                  <MapPin className="w-8 h-8 text-[#C89B3C] mx-auto mb-2 opacity-80" />
                  <p className="text-xs text-[#7C7467] font-serif italic mb-3">No physical delivery addresses found in your ledger.</p>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-4 py-2 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    Add Delivery Target
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(addresses as any[]).map((address: any) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`relative cursor-pointer rounded-xl p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-white border-[#1B3B2B] ring-1 ring-[#1B3B2B] shadow-sm' 
                            : 'bg-white/60 border-[#EAE3D2] hover:border-[#C89B3C]/60 hover:bg-white'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-medium text-xs text-[#1B3B2B] flex items-center gap-1.5">
                              <UserIcon className="w-3 h-3 text-[#C89B3C]" />
                              {address.fullName}
                            </span>
                            {address.isDefault && (
                              <span className="text-[8px] font-mono uppercase bg-[#1B3B2B]/10 text-[#1B3B2B] px-1.5 py-0.2 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-[#7C7467] leading-relaxed line-clamp-2">
                            {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} - <span className="font-mono">{address.postalCode}</span>
                          </p>

                          <p className="text-[10px] font-mono text-[#7C7467] flex items-center gap-1 pt-0.5">
                            <Phone className="w-2.5 h-2.5 text-[#C89B3C]" />
                            {address.phone}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#EAE3D2]/40 flex items-center justify-between">
                          <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#7C7467]">
                            {isSelected ? 'Selected Target' : 'Select Target'}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-[#1B3B2B] border-[#1B3B2B] text-white' : 'border-[#EAE3D2]'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAE3D2]/80 pb-3">
                <div className="w-6 h-6 rounded-full bg-[#1B3B2B] text-[#FCFAF7] text-xs font-mono flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="font-serif text-base sm:text-lg text-[#1B3B2B] font-medium">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                    paymentMethod === 'online'
                      ? 'bg-white border-[#1B3B2B] ring-1 ring-[#1B3B2B] shadow-sm'
                      : 'bg-white/60 border-[#EAE3D2] hover:border-[#C89B3C]/60 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'online' ? 'bg-[#1B3B2B] text-[#C89B3C]' : 'bg-[#EAE3D2]/40 text-[#7C7467]'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-serif font-medium text-[#1B3B2B]">Online Payment</h3>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'online' ? 'bg-[#1B3B2B] border-[#1B3B2B] text-white' : 'border-[#EAE3D2]'
                      }`}>
                        {paymentMethod === 'online' && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[10.5px] text-[#7C7467] leading-tight">UPI, Credit/Debit Cards, NetBanking, Wallets</p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'bg-white border-[#1B3B2B] ring-1 ring-[#1B3B2B] shadow-sm'
                      : 'bg-white/60 border-[#EAE3D2] hover:border-[#C89B3C]/60 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-[#1B3B2B] text-[#C89B3C]' : 'bg-[#EAE3D2]/40 text-[#7C7467]'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-serif font-medium text-[#1B3B2B]">Cash on Delivery</h3>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'bg-[#1B3B2B] border-[#1B3B2B] text-white' : 'border-[#EAE3D2]'
                      }`}>
                        {paymentMethod === 'cod' && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[10.5px] text-[#7C7467] leading-tight">Pay upon physical hand-off at destination</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D2]/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1B3B2B] text-[#FCFAF7] text-xs font-mono flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="font-serif text-base sm:text-lg text-[#1B3B2B] font-medium">
                    Kit Manifest ({activeKitItems.length} Products)
                  </h2>
                </div>
                <Link href="/account/kit/builder" className="text-[10px] font-mono uppercase tracking-wider text-[#C89B3C] hover:underline">
                  Edit Kit
                </Link>
              </div>

              <div className="bg-white border border-[#EAE3D2] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1B3B2B]/5 text-[#C89B3C]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-medium text-sm text-[#1B3B2B]">
                        {kitPayload.templateName || activeKitBlueprint?.name}
                      </h3>
                      {activeKitBlueprint?.curatedBy && (
                        <span className="text-[9px] font-bold text-[#C89B3C] bg-[#C89B3C]/10 border border-[#C89B3C]/20 px-2 py-0.5 rounded-full">
                          {activeKitBlueprint.curatedBy}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7C7467]">Base box configuration & assembly</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#1B3B2B]">₹{kitBasePrice}</span>
              </div>

              <div className="space-y-2.5">
                {activeKitItems.map((item, index) => {
                  const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.product?.price || 0;
                  const itemImg = (item.product as any)?.images?.[0]?.url || (item.product as any)?.imageUrl || '/placeholder.png';

                  return (
                    <div key={index} className="bg-white border border-[#EAE3D2] rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 bg-[#F5F2EB] rounded-lg overflow-hidden flex-shrink-0 border border-[#EAE3D2]/60">
                          {itemImg ? (
                            <Image src={itemImg} alt={item.product?.name || 'Product'} fill className="object-cover" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-[#C89B3C] absolute inset-0 m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-medium text-[#1B3B2B] truncate">
                            {item.product?.name || 'Custom Herb/Item'}
                          </h4>
                          {item.selectedVariant && (
                            <p className="text-[10px] font-mono text-[#7C7467]">
                              Variant: {item.selectedVariant.size}
                            </p>
                          )}
                          <p className="text-[10px] font-mono text-[#7C7467]">
                            Qty: {item.quantity} × ₹{itemPrice}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#1B3B2B] flex-shrink-0">
                        ₹{itemPrice * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-5 sm:p-6 shadow-xs sticky top-20 space-y-5">
              <h2 className="font-serif text-lg text-[#1B3B2B] font-medium border-b border-[#EAE3D2]/80 pb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#C89B3C]" />
                Order Summary
              </h2>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-[#7C7467]">
                  <span>Base Box Fee</span>
                  <span>₹{kitBasePrice}</span>
                </div>
                <div className="flex justify-between text-[#7C7467]">
                  <span>Items Total ({activeKitItems.length})</span>
                  <span>₹{itemsSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#7C7467]">
                  <span>Subtotal</span>
                  <span className="text-[#1B3B2B] font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#7C7467]">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span> : `₹${shipping}`}</span>
                </div>

                <div className="border-t border-[#EAE3D2] pt-3 flex justify-between items-baseline text-sm">
                  <span className="font-serif font-medium text-[#1B3B2B]">Grand Total</span>
                  <span className="font-mono font-bold text-base text-[#1B3B2B]">₹{grandTotal}</span>
                </div>
              </div>

              <CheckoutButton
                onPlaceOrder={handlePlaceOrder}
                isSubmitting={isSubmittingOrder}
                isDisabled={isSubmittingOrder || !selectedAddressId}
              />

              <div className="pt-2 text-[10.5px] text-[#7C7467] space-y-2 border-t border-[#EAE3D2]/60 font-mono">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Standard Delivery (3-5 Business Days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Custom packaged in authentic Shri Vishwanath Box</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateAddress}
      />
    </div>
  );
}