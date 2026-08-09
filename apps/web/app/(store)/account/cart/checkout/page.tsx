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
  CheckCircle2, 
  AlertCircle,
  Phone,
  User,
  PackageCheck
} from 'lucide-react';

import { useCart } from '@/providers/CartProvider';
import { useAddressBook } from '@/hooks/useAddressBooks';
import { useOrders } from '@/hooks/secure_hook/useOrder';
import { usePayment } from '@/hooks/secure_hook/usePayment';
import AddressFormDialog from '@/components/account/address/AddressFormDialouge';
import CheckoutButton from '@/components/account/checkout/checkoutButton';
import { Address } from '@/types/checkout';
import { paymentService } from '@/services/payment.service';

const SHIPPING_THRESHOLD = 500;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, error: cartError } = useCart();
  const { addresses, isProcessing: isAddressProcessing, addAddress } = useAddressBook();
  const { createOrder, loading: isOrderLoading, error: orderHookError } = useOrders();
  const { startPayment, loading: isPaymentLoading, error: paymentHookError } = usePayment();

  // Selected state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const items = cart?.items || [];

  // Auto-select default address or first address when loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: Address) => a.isDefault) || addresses[0];
      const targetId = defaultAddr?.id || defaultAddr?.id;
      if (targetId) {
        setSelectedAddressId(targetId);
      }
    }
  }, [addresses, selectedAddressId]);

  // Handle live address creation from dialog
  const handleCreateAddress = async (formData: any) => {
    try {
      setCheckoutError(null);
      const result: any = await addAddress(formData);
      const createdId = result?.data?.id || result?.data?._id;
      if (createdId) {
        setSelectedAddressId(createdId);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Failed to register delivery address.');
      throw err;
    }
  };

  // Calculations derived directly from shared context
  const subtotal = cart?.subtotal || items.reduce((acc, item) => acc + (item.variant?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD || items.length === 0 ? 0 : 40;
  const grandTotal = subtotal + shipping;

  const selectedAddress = addresses.find((a: Address) => (a.id || a._id) === selectedAddressId);
const handlePlaceOrder = async () => {
  // 1. Validation
  if (!selectedAddressId) {
    setCheckoutError("Please select a delivery address.");
    return;
  }

  try {
    setCheckoutError(null);
    console.log("🚀 [1/5] Starting Checkout Process...");
    console.log("📍 Selected Address ID:", selectedAddressId);
    console.log("💳 Payment Method:", paymentMethod);
    console.log("💰 Grand Total:", grandTotal);

    // 2. Create Order in DB
    console.log("⏳ [2/5] Calling createOrder DB mutation...");
    const createdOrder = await createOrder({
      addressId: selectedAddressId,
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
    });

    console.log("📦 Raw Created Order Response:", JSON.stringify(createdOrder, null, 2));

    // Safely resolve the DB Primary Key
    const orderRef = createdOrder?.order?.id || (createdOrder as any)?.id || createdOrder?.orderId;
    console.log("🔑 Resolved Internal DB Order Ref (Foreign Key):", orderRef);

    if (!orderRef) {
      console.error("❌ CRITICAL: Order creation succeeded but no valid ID was resolved!");
      throw new Error("Order creation succeeded, but no valid DB Order ID was returned.");
    }

    // COD FLOW
    if (paymentMethod === 'cod') {
      console.log("✅ COD selected. Redirecting to success page with orderRef:", orderRef);
      router.push(`/account/cart/checkout/success?orderId=${orderRef}`);
      return;
    }

    // 3. Create Payment Order (Razorpay)
    console.log("⏳ [3/5] Requesting Razorpay Payment Order from backend for DB Order:", orderRef);




    // 4. Trigger Razorpay Payment Modal
    await startPayment({
      orderId: orderRef,
      amount: grandTotal,
      prefill: {
        name: selectedAddress?.fullName || "",
        contact: selectedAddress?.phone || "",
      },
      onSuccess: (verifyResponse) => {
        console.log("🎉 [5/5] Payment Successful! Verification response:", verifyResponse);
        router.push(`/account/cart/checkout/success?orderId=${orderRef}`);
      },
      onFailure: (err: any) => {
        console.error("❌ Payment Failed or Cancelled:", err);
        const failureMessage = err?.message || "Payment was cancelled or failed.";
        setCheckoutError(failureMessage);
      },
    });

  } catch (err: any) {
    console.error("💥 Checkout Flow Exception Caught:", err);
    const errorMessage = err?.response?.data?.message || err?.message || "An unexpected error occurred during checkout processing.";
    setCheckoutError(errorMessage);
  }
};
  const isSubmittingOrder = isOrderLoading || isPaymentLoading;
  const activeError = cartError || checkoutError || orderHookError || paymentHookError;

  // Loading Skeleton State
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-widest text-[#1B3B2B] uppercase">Preparing Bespoke Checkout...</p>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-[#1B3B2B]/5 rounded-full flex items-center justify-center mx-auto text-[#C89B3C]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl text-[#1B3B2B]">Your Vault is Empty</h2>
          <p className="text-xs text-[#7C7467]">Add items to your selection before proceeding to checkout.</p>
          <Link href="/products" className="inline-block px-6 py-2.5 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-lg">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1B3B2B] antialiased pb-28 sm:pb-12">
      
      {/* Header Bar */}
      <header className="border-b border-[#EAE3D2] bg-[#FCFAF7]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-1.5 text-xs font-mono text-[#7C7467] hover:text-[#1B3B2B] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline uppercase tracking-wider">Back to Cart</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
            <span className="font-serif text-sm sm:text-base font-medium tracking-tight text-[#1B3B2B]">
              Encrypted Checkout
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#C89B3C] bg-[#C89B3C]/10 px-2.5 py-1 rounded-full border border-[#C89B3C]/20">
            <Lock className="w-3 h-3" />
            <span>256-BIT SSL</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Error Alert Banner */}
        {activeError && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-3 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-mono">{activeError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 text-left">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Step 1: Delivery Address */}
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

              {/* Address Cards List */}
              {addresses.length === 0 ? (
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
                  {addresses.map((address: Address) => {
                    const addrId = address.id || address._id || '';
                    const isSelected = selectedAddressId === addrId;
                    return (
                      <div
                        key={addrId}
                        onClick={() => setSelectedAddressId(addrId)}
                        className={`relative cursor-pointer rounded-xl p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-white border-[#1B3B2B] ring-1 ring-[#1B3B2B] shadow-sm' 
                            : 'bg-white/60 border-[#EAE3D2] hover:border-[#C89B3C]/60 hover:bg-white'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-medium text-xs text-[#1B3B2B] flex items-center gap-1.5">
                              <User className="w-3 h-3 text-[#C89B3C]" />
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

                        {/* Selection Radio Circle */}
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

            {/* Step 2: Payment Method */}
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
                
                {/* Online Gateway Option */}
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

                {/* Cash on Delivery Option */}
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

            {/* Step 3: Item Review List */}
            <section className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D2]/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1B3B2B] text-[#FCFAF7] text-xs font-mono flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="font-serif text-base sm:text-lg text-[#1B3B2B] font-medium">
                    Order Items ({items.length})
                  </h2>
                </div>
                <Link href="/cart" className="text-[10px] font-mono uppercase tracking-wider text-[#C89B3C] hover:underline">
                  Edit Items
                </Link>
              </div>

              <div className="divide-y divide-[#EAE3D2]/60">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-white border border-[#EAE3D2] rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0]?.url ? (
                        <Image 
                          src={item.product.images[0].url} 
                          alt={item.product.name} 
                          fill 
                          sizes="(max-width: 640px) 48px, 48px"
                          className="object-cover" 
                        />
                      ) : (
                        <ShoppingBag className="w-4 h-4 text-[#7C7467] m-auto" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-xs font-serif text-[#1B3B2B] truncate">{item.product?.name}</h4>
                      <p className="text-[10px] font-mono text-[#7C7467]">
                        {item.variant?.title} × <span className="font-bold text-[#1B3B2B]">{item.quantity}</span>
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs font-medium text-[#1B3B2B]">
                      ₹{((item.variant?.price || 0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#1B3B2B] text-[#FCFAF7] border border-[#1B3B2B] rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl sticky top-20">
              
              <div className="border-b border-[#FCFAF7]/15 pb-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-[#C89B3C] font-bold">
                      Order Overview
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-[#FCFAF7]">Final Valuation</h3>
                </div>
                <PackageCheck className="w-4 h-4 text-[#C89B3C]" />
              </div>

              {/* Selected Target Summary */}
              {selectedAddress && (
                <div className="bg-[#FCFAF7]/5 border border-[#FCFAF7]/10 p-3 rounded-xl text-xs space-y-1">
                  <span className="text-[9px] font-mono uppercase text-[#C89B3C] tracking-wider block">Dispatching To</span>
                  <p className="font-serif text-[#FCFAF7] truncate">{selectedAddress.fullName}</p>
                  <p className="text-[10.5px] text-[#FCFAF7]/70 truncate">{selectedAddress.line1}, {selectedAddress.city}</p>
                </div>
              )}

              {/* Price Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[#FCFAF7]/80">
                  <span className="font-serif italic">Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center text-[#FCFAF7]/80">
                  <span className="font-serif italic">Shipping</span>
                  <span className="font-mono">
                    {shipping === 0 ? (
                      <span className="text-[#C89B3C] font-mono text-[9px] font-bold uppercase tracking-wider bg-[#C89B3C]/15 px-2 py-0.5 rounded border border-[#C89B3C]/30">
                        Complimentary
                      </span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t border-[#FCFAF7]/15 pt-3 flex justify-between items-end">
                  <div>
                    <span className="font-serif text-base font-normal text-[#FCFAF7] block">Total Payable</span>
                    <span className="text-[8.5px] text-[#FCFAF7]/50 font-mono tracking-wider uppercase block">Taxes included</span>
                  </div>
                  <span className="font-mono text-xl font-bold text-[#C89B3C]">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Desktop Checkout Button */}
              <CheckoutButton
                onPlaceOrder={handlePlaceOrder}
                isSubmitting={isSubmittingOrder}
                isDisabled={isAddressProcessing || !selectedAddressId}
              />

              {/* Trust Badges */}
              <div className="pt-2 border-t border-[#FCFAF7]/15 space-y-2 text-[10.5px] text-[#FCFAF7]/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span className="font-serif italic">Insured Bespoke Transit Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span className="font-serif italic">Express Priority Dispatch Guaranteed</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Live Address Creation Dialog */}
      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateAddress}
      />

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1B3B2B]/95 backdrop-blur-md border-t border-[#C89B3C]/30 px-3 py-2.5 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono uppercase tracking-widest text-[#FCFAF7]/60">Total</span>
          <span className="font-mono font-bold text-base text-[#C89B3C]">
            ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <CheckoutButton
          isMobile
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmittingOrder}
          isDisabled={isAddressProcessing || !selectedAddressId}
          label="Confirm Order"
        />
      </div>

    </div>
  );
}