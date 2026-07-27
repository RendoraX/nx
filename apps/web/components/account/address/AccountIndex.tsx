'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Home } from 'lucide-react';
import AddressFormDialog from './AddressFormDialouge';
import { useAddressBook } from '@/hooks/useAddressBooks';

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
  isDefault: boolean;
}

interface AccountAddressesTabProps {
  initialAddresses?: Address[];
  onAddAddress?: (address: Omit<Address, 'id'>) => Promise<Address | void>;
  onDeleteAddress?: (id: string) => Promise<void>;
}

export default function AccountAddressesTab({ 
  initialAddresses, 
}: AccountAddressesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // No local state synchronization needed anymore!
  const { addAddress: onAddAddress, removeAddress: onDeleteAddress, addresses } = useAddressBook();

  const handleCreateAddress = async (newAddressData: Address) => {
    try {
      await onAddAddress(newAddressData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Could not register address:", error);
      alert("Failed to save the address. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this target address from your allocation profile?")) return;
    try {
      await onDeleteAddress(id);
    } catch (error) {
      console.error("Could not remove address:", error);
      alert("Failed to delete the address.");
    }
  };


  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="bg-[#1B3B2B] border border-[#1B3B2B] rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <h2 className="font-serif text-2xl font-semibold text-[#FCFAF7] tracking-tight">Delivery Registry</h2>
          <p className="text-xs text-[#EAE3D2] tracking-wide max-w-md">
            Manage your spatial target coordinates and default distribution profiles for fast order placement processing.
          </p>
        </div>
        
        {(addresses as any).length > 0 && (
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="relative z-10 mt-6 sm:mt-0 px-5 py-3 bg-[#FCFAF7] text-[#1B3B2B] hover:bg-[#EAE3D2] text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer border border-[#EAE3D2]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Add New Address
          </button>
        )}
      </div>

      {/* <div>
        {addresses.length === 0 ? (
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-20 text-center max-w-xl mx-auto shadow-sm">
            <MapPin className="h-12 w-12 text-[#A39785] mx-auto mb-4 stroke-[1.5]" />
            <h4 className="font-serif text-lg text-[#1B3B2B] font-medium">No Address Matrix Registered</h4>
            <p className="text-sm text-[#7C7467] font-light mt-1 max-w-xs mx-auto">
              Your profile doesn't map to active delivery coordinates yet. Add an allocation point to enable shipments.
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-6 px-4 py-2.5 border border-[#1B3B2B] text-[#1B3B2B] text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1B3B2B]/5 transition-all cursor-pointer"
            >
              Configure First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div 
                key={address.id}
                className={`bg-[#FCFAF7] border rounded-xl p-6 shadow-sm flex flex-col justify-between gap-6 transition-all hover:border-[#1B3B2B]/20 relative ${
                  address.isDefault ? 'border-[#C89B3C]' : 'border-[#EAE3D2]'
                }`}
              >
                {address.isDefault && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[9px] font-bold text-[#C89B3C] uppercase tracking-widest bg-[#C89B3C]/10 border border-[#C89B3C]/20 px-2 py-0.5 rounded-full">
                    <Home className="h-2.5 w-2.5" /> Primary Default
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#1B3B2B]/5 rounded-md flex items-center justify-center text-[#1B3B2B] flex-shrink-0 mt-0.5 border border-[#1B3B2B]/10">
                      <MapPin className="h-4 w-4 text-[#C89B3C]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#1A1A1A]">{address.fullName}</h4>
                      <p className="text-xs font-mono text-[#7C7467] mt-0.5">{address.phone}</p>
                    </div>
                  </div>

                  <div className="text-xs text-[#7C7467] space-y-1 pl-11 font-light leading-relaxed">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.state}</p>
                    <p className="font-mono text-[#1A1A1A] font-medium">{address.postalCode}, {address.country}</p>
                  </div>
                </div>

                <div className="border-t border-[#EAE3D2]/60 pt-4 flex justify-end pl-11">
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-1.5 text-[#A39785] hover:text-red-500 hover:bg-red-500/5 rounded-md transition-all cursor-pointer"
                    title="Delete Coordinate Profile"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <AddressFormDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateAddress}
      />
    </div>
  );
}