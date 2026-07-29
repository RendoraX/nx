'use client';

import { useState, useTransition, useCallback } from 'react';
import { addressService, AddressPayload } from '@/services/address.service';
import { useAuthContext } from '@/providers/AuthProviders';

export function useAddressBook() {
  const { user, setUser } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const addresses: AddressPayload[] = user?.addresses || [];

  // Dedicated server re-fetch method
  const refetchAddresses = useCallback(async () => {
    try {
      const freshAddresses = await addressService.getAll();
      setUser((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          addresses: freshAddresses,
        };
      });
    } catch (error) {
      console.error("Failed to refetch addresses:", error);
    }
  }, [setUser]);

  const addAddress = async (newAddress: AddressPayload) => {
    setValidationErrors({});
    
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const resData = await addressService.create(newAddress);
          
          if (resData?.success) {
            // Re-fetch clean list straight from DB
            await refetchAddresses();
            resolve(resData);
          } else {
            if (resData?.error) {
              setValidationErrors(resData.error as Record<string, string[]>);
            }
            reject(new Error(resData?.message || resData?.error || "Execution error"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const removeAddress = async (id: string) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const resData = await addressService.delete(id);
          
          if (resData?.success) {
            // Re-fetch clean list straight from DB
            await refetchAddresses();
            resolve(resData);
          } else {
            reject(new Error(resData?.message || resData?.error || "Purge failed"));
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
    refetchAddresses,
  };
}