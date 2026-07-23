// apps/web/app/account/services/addressService.ts

import api from "@/lib/axios";
import { CacheAxiosResponse } from "axios-cache-interceptor";

export interface AddressPayload {
  id : string
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


/**
 * Handles all network operations communicating with your Prisma backend endpoint
 */
export const addressService = {
  // Fetch all addresses for the authenticated user
  async getAll(): Promise<CacheAxiosResponse[]> {
    const res = await api.get('http://localhost:4000/api/account/addresses');
    return res.data.addresses
  },

  // Save a new address profile to database
  async create(payload: AddressPayload): Promise<CacheAxiosResponse> {
    const res = await api.post('http://localhost:4000/api/account/address' , payload);
    return res
  },

  // Purge a target allocation node from ledger
  async delete(id: string): Promise<void> {
    const res = await fetch(`http://localhost:4000/api/account/addresses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to purge selected address record');
  }
};