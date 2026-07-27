import api from "@/lib/axios";
import { CreateAddressDTO } from "../components/account/address/AddressFormDialouge";
import { CacheAxiosResponse } from "axios-cache-interceptor";

export const addressService = {
  // Fetch all addresses for the authenticated user
  async getAll(): Promise<CacheAxiosResponse> {
    const res = await api.get('http://localhost:4000/api/account/addresses');
    return res;
  },

  // Save a new address profile to database
  async create(payload: CreateAddressDTO): Promise<CacheAxiosResponse> {
    console.log("Address creation payload ", payload);
    const res = await api.post('http://localhost:4000/api/account/address', payload);
    console.log("Res address", res.data.address);
    return res;
  },

  // Purge a target allocation node from ledger
  async delete(id: string): Promise<CacheAxiosResponse> {
const response = await api.delete(`http://localhost:4000/api/account/address/${id}/d`)
    return response
  }
};