'use client';

import { useState, useTransition } from 'react';
import { deleteAddressAction } from '../app/(store)/account/actions/Address';
import { addressService, AddressPayload } from '@/services/address.service';
import { useAuthContext } from '@/providers/AuthProviders';

export function useAddressBook() {
  const { user, setUser } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // 1. Single Source of Truth: Derive directly from context.
  // Fallback to empty array prevents "cannot read length of undefined"
  const addresses: AddressPayload[] = user?.addresses || [];

  const addAddress = async (newAddress: AddressPayload): Promise<AddressPayload | void> => {
    setValidationErrors({});
    
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await addressService.create(newAddress);
          
          if (result.data?.success && result.data) {
            const typedAddress: AddressPayload = {
              line2: result.data.line2 ?? null,
              ...result.data.address,
            };

            // 2. Fixed Syntax: Wrap in parentheses () to return the object correctly
            setUser((prev: any) => {
              if (!prev) return prev;

              // Handle toggling other defaults if the new address is the primary default
              const cleanExistingAddresses = typedAddress.isDefault
                ? (prev.addresses || []).map((item: any) => ({ ...item, isDefault: false }))
                : (prev.addresses || []);

              return {
                ...prev, // Keep existing user fields safe
                addresses: [...cleanExistingAddresses, typedAddress],
              };
            });

            resolve(typedAddress);
          } else {
            if (result.data?.error) {
              setValidationErrors(result.data.error as Record<string, string[]>);
            }
            reject(new Error(result.data?.error || "Execution processing intercept"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const removeAddress = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await deleteAddressAction(id);
          
          if (result.success) {
            // Update context state safely
            setUser((prev: any) => {
              if (!prev) return prev;
              return {
                ...prev,
                addresses: (prev.addresses || []).filter((item: any) => item.id !== id),
              };
            });
            resolve();
          } else {
            reject(new Error(result.error || "Purge transaction failed"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  return {
    addresses,
    isProcessing: isPending,
    validationErrors,
    addAddress,
    removeAddress,
  };
}