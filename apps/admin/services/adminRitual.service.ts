// adminRitual.service.ts
import api from "@/lib/interceptor/axiosRES";

export interface TemplateItemInput {
  productId: string;
  quantity: number;
  variantId?: string | null;
}

export interface CreateTemplateInput {
  name: string;
  slug: string;
  description: string;
  curatedBy: string;
  baseBoxPrice: number;
  isManualPrice: boolean; // Dynamic price recalculation toggle state flag
  isActive?: boolean;
  defaultItems: TemplateItemInput[];
}

export interface UpdateTemplateInput {
  name?: string;
  slug?: string;
  description?: string;
  curatedBy?: string;
  baseBoxPrice?: number;
  isManualPrice?: boolean;
  isActive?: boolean;
  defaultItems?: TemplateItemInput[];
}

export class AdminRitualService {
  private static BASE_URL = 'http://localhost:4000/api';

  // 1. Get all templates with complete dynamic item pricing and data configurations
  static async getAdminTemplates() {
    const response = await api.get(`${this.BASE_URL}/custkits`);
    return response.data.kits;
  }

  // 2. Transmit state parameters to finalize creation of a new blueprint configuration
  static async createTemplate(data: CreateTemplateInput) {
    const response = await api.post(`${this.BASE_URL}/admin/custkits`, data);
    console.log(response.data);
    return response.data.record;
  }

  // 3. Dispatch data modifications to update structural properties and inventory rules
  static async updateTemplate(id: string, data: UpdateTemplateInput) {
    const response = await api.patch(`${this.BASE_URL}/admin/custkits/${id}`, data);
    return response.data.record;
  }

  // 4. Send a request to remove a template configuration entirely from the data clusters
  static async deleteTemplate(id: string) {
    const response = await api.delete(`${this.BASE_URL}/admin/custkits/${id}`);
    return response.data;
  }
}