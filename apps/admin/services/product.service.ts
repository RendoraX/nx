import api from '@/lib/interceptor/axiosRES';
import { Product } from '@/types/product';

interface ProductFilters {
  searchQuery?: string;
  statusFilter?: string;
}

class ProductService {

  /**
   * Fetch all catalog products with integrated text filters & status criteria pipelines
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    console.log("backend url" , process.env.BACKEND_URL)
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.append('search', filters.searchQuery);
    if (filters?.statusFilter && filters.statusFilter !== 'all') {
      params.append('status', filters.statusFilter);
    }

    const response = await api.get(`/api/products` , {withCredentials : true});

    return response.data.products;
  }

  /**
   * Extract a complete singular product blueprint matrix by database identifier
   */
  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Failed to locate product resource node ID: ${id}`);
    return response.json();
  }

  /**
   * Commit a newly composed framework entity, converting media file drops to backend storage streams
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    // Process form data payloads seamlessly to transparently ship native Blob files alongside texts
    const formData = new FormData();

    
    
    // Split native file objects apart from standard external link arrays
    data.images?.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      } else if (img.url) {
        formData.append("imageUrls", img.url);
      }
    });
    
    
    // Deconstruct fields safely out into payload wrappers
    formData.append('payload', JSON.stringify({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive,
      status: data.status,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      hasVariants: data.hasVariants,
      variants: data.variants || [],
      tags: data.tags || []
    }));
    
    
    const response = await api.post("/api/products" , formData , {
      withCredentials : true
    })
    
    return response.data;
  }

  /**
   * Patch and modify parameters of an active infrastructure catalog branch node
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const formData = new FormData();
    formData.append('payload', JSON.stringify({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive,
      status: data.status,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      hasVariants: data.hasVariants,
      variants: data.variants || [],
      tags: data.tags || []
    }));

    if (data.images) {
      data.images.forEach((img, idx) => {
        if (img.url || img.file) {
          formData.append(`image_file_${idx}`, img.file as any || img.url);
        } else {
          formData.append(`image_url_${idx}`, JSON.stringify(img));
        }
      });
    }
    
    const response = await api.put(`/api/products/${id}` , {data})

    return response.data;
  }

  /**
   * Delete or soft-archive target database product node instance context
   */
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/api/products/${id}`, {
      withCredentials : true
    });

    if (!response.data) throw new Error(`Execution error dropping target structural node index: ${id}`);
    return response.data;
  }
}

export const productService = new ProductService();