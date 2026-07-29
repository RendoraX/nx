// services/address.service.ts
import api from "@/lib/axios";

export interface AddressPayload {
  id?: string;
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

export const addressService = {
  async getAll(): Promise<AddressPayload[]> {
    // Use relative paths since baseURL is already configured
    const res = await api.get('/api/account/addresses', {
      cache: false,
    });
    return res.data.addresses || res.data;
  },

  async create(payload: AddressPayload) {
    const res = await api.post('/api/account/address', payload);
    return res.data;
  },

  async delete(id: string) {
    const res = await api.delete(`/api/account/address/${id}/d`);
    return res.data;
  }
};