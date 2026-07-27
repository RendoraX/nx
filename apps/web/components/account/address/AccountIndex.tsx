'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Home, Loader2, Compass, ShieldCheck } from 'lucide-react';
import AddressFormDialog from './AddressFormDialouge';
import { useAddressBook } from '@/hooks/useAddressBooks';
import { useAuthContext } from '@/providers/AuthProviders';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export default function AccountAddressesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { loading, refreshSession } = useAuthContext();
  const { 
    addAddress: onAddAddress, 
    removeAddress: onDeleteAddress, 
    addresses,
    isProcessing 
  } = useAddressBook();

  // Guard against SSR hydration mismatches
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleCreateAddress = async (newAddressData: any) => {
    try {
      setIsSyncing(true);
      await onAddAddress(newAddressData);
      // Re-fetch fresh profile & address state from server
      await refreshSession();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Could not register address:", error);
      alert("Failed to save the address. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this target address from your allocation profile?")) return;
    try {
      setIsSyncing(true);
      await onDeleteAddress(id);
      // Re-fetch fresh profile & address state from server
      await refreshSession();
    } catch (error) {
      console.error("Could not remove address:", error);
      alert("Failed to delete the address.");
    } finally {
      setIsSyncing(false);
    }
  };

  // 1. Skeleton Loading State
  if (!hasMounted || loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="bg-[#1B3B2B] border border-[#1B3B2B]/40 rounded-2xl p-8 flex items-center justify-between shadow-lg">
          <div className="space-y-3">
            <div className="h-7 w-56 bg-white/10 rounded-md"></div>
            <div className="h-3 w-80 bg-white/10 rounded-md"></div>
          </div>
          <div className="h-11 w-40 bg-white/10 rounded-xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-8 h-56 flex items-center justify-center shadow-sm">
            <Loader2 className="w-6 h-6 text-[#C89B3C] animate-spin" />
          </div>
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-8 h-56 flex items-center justify-center shadow-sm">
            <Loader2 className="w-6 h-6 text-[#C89B3C] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const typedAddresses = (addresses || []) as Address[];
  const isBusy = isProcessing || isSyncing;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-[#11291D] via-[#1B3B2B] to-[#11291D] border border-[#C89B3C]/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-xl">
        {/* Subtle Luxury Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        
        {/* Ambient Gold Glow Effect */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C89B3C]/15 border border-[#C89B3C]/30 rounded-full text-[10px] font-semibold text-[#C89B3C] uppercase tracking-widest mb-1">
            <Compass className="w-3 h-3" /> Private Registry
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#FCFAF7] tracking-tight">Delivery Coordinates</h2>
          <p className="text-xs text-[#EAE3D2]/80 tracking-wide max-w-md font-light leading-relaxed">
            Manage your verified destination points and primary delivery dispatch targets.
          </p>
        </div>
        
        <button 
          onClick={() => setIsDialogOpen(true)}
          disabled={isBusy}
          className="relative z-10 mt-6 sm:mt-0 px-6 py-3.5 bg-gradient-to-r from-[#C89B3C] to-[#B38730] text-[#FCFAF7] hover:brightness-110 text-xs font-semibold uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2.5 cursor-pointer border border-[#C89B3C]/40 active:scale-[0.98] disabled:opacity-50"
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Plus className="h-4 w-4 stroke-[2.5]" />
          )}
          <span>Add New Location</span>
        </button>
      </div>

      {/* Address Grid or Empty State */}
      <div>
        {typedAddresses.length === 0 ? (
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-16 text-center max-w-xl mx-auto shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 bg-[#1B3B2B]/5 rounded-2xl flex items-center justify-center text-[#C89B3C] mx-auto mb-5 border border-[#C89B3C]/20 shadow-inner">
              <MapPin className="h-8 w-8 stroke-[1.25]" />
            </div>
            <h4 className="font-serif text-xl text-[#1B3B2B] font-semibold tracking-tight">No Locations Registered</h4>
            <p className="text-xs text-[#7C7467] font-light mt-2 max-w-xs mx-auto leading-relaxed">
              Your profile currently has no destination points attached. Register an address to enable tailored logistics.
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-6 px-5 py-3 border border-[#1B3B2B] text-[#1B3B2B] hover:bg-[#1B3B2B] hover:text-[#FCFAF7] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
            >
              Set Up First Location
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {typedAddresses.map((address) => (
              <div 
                key={address.id}
                className={`group bg-white border rounded-2xl p-7 shadow-sm hover:shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  address.isDefault 
                    ? 'border-[#C89B3C] ring-1 ring-[#C89B3C]/30 bg-gradient-to-b from-[#FCFAF7] to-white' 
                    : 'border-[#EAE3D2] hover:border-[#1B3B2B]/30'
                }`}
              >
                {/* Gold Accent Bar for Default Card */}
                {address.isDefault && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C89B3C] via-[#E8C878] to-[#C89B3C]"></div>
                )}

                <div className="space-y-5">
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        address.isDefault 
                          ? 'bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30' 
                          : 'bg-[#1B3B2B]/5 text-[#1B3B2B] border border-[#1B3B2B]/10 group-hover:border-[#C89B3C]/40 group-hover:text-[#C89B3C]'
                      }`}>
                        <MapPin className="h-5 w-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <h4 className="font-serif font-semibold text-base text-[#1B3B2B] tracking-tight">{address.fullName}</h4>
                        <p className="text-[11px] font-mono text-[#A39785] mt-0.5 tracking-wide">{address.phone}</p>
                      </div>
                    </div>

                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#C89B3C] uppercase tracking-widest bg-[#C89B3C]/10 border border-[#C89B3C]/30 px-3 py-1 rounded-full shadow-2xs">
                        <Home className="h-3 w-3 stroke-[2]" /> Primary
                      </span>
                    )}
                  </div>

                  {/* Address Body */}
                  <div className="text-xs text-[#524B42] space-y-1 font-light leading-relaxed pl-1">
                    <p className="font-medium text-[#1A1A1A]">{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.state}</p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#1B3B2B] bg-[#FCFAF7] border border-[#EAE3D2] px-2 py-0.5 rounded-md text-[11px]">
                        {address.postalCode}
                      </span>
                      <span className="text-[#A39785] text-[11px] font-medium uppercase tracking-wider">{address.country}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-[#EAE3D2]/60 pt-4 mt-6 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#A39785] font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#1B3B2B]" /> Verified Coordinate
                  </span>
                  
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isBusy}
                    className="p-2 text-[#A39785] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-40"
                    title="Remove Address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressFormDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateAddress}
      />
    </div>
  );
}