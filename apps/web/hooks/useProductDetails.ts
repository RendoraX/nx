// hooks/useProductDetails.ts
import { useState, useEffect } from 'react';
import { ProductService } from '@/services/product.service';
import { DetailedProduct } from '@/types/product';

export function useProductDetails(slug: string) {
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductService.getProductBySlug(slug);
        
        // Append related data method to the product object
        if (data) {
          (data as any).getRelatedByCategory = async (categoryId: string) => {
            return await ProductService.getRelatedProducts(categoryId);
          };
        }
        
        setProduct(data);
        if (data?.images?.length > 0) {
          const sortedImages = [...data.images].sort((a, b) => (a.position || 0) - (b.position || 0));
          setSelectedImage(sortedImages[0].url);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while retrieving this item.');
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  // Handle stock calculation based on variant or base product
  const getInventory = () => {
    // If a variant is selected, use its inventory (if nested) or product inventory
    const inventory = product?.inventory;
    const stock = inventory?.stock ?? 0;
    const reserved = inventory?.reserved ?? 0;
    return Math.max(0, stock - reserved);
  };

  const availableStock = getInventory();

  const stockConfig = (() => {
    if (availableStock === 0) {
      return { 
        label: 'Out of Stock', 
        className: 'bg-white text-[#7C7467] border-[#EAE3D2]', 
        isAvailable: false 
      };
    }
    if (availableStock < 10) {
      return { 
        label: `Limited: Only ${availableStock} Left`, 
        className: 'bg-[#C89B3C]/5 text-[#C89B3C] border-[#C89B3C]/30', 
        isAvailable: true 
      };
    }
    return { 
      label: 'In Stock & Ready', 
      className: 'bg-[#1F5E3B]/5 text-[#1F5E3B] border-[#1F5E3B]/20', 
      isAvailable: true 
    };
  })();

  const discountPercentage = product?.comparePrice && Number(product.comparePrice) > Number(product.price)
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0;

  return {
    product,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    stockConfig,
    availableStock,
    discountPercentage,
  };
}