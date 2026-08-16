// useAdminRitual.ts
import { useState, useEffect } from 'react';
import { AdminRitualService, CreateTemplateInput, UpdateTemplateInput } from '@/services/adminRitual.service';

export interface AdminProductSummary {
  id: string;
  name: string;
  sku: string;
  price: number;
}

export interface AdminTemplateItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: AdminProductSummary;
}

export interface AdminRitualTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  curatedBy: string;
  baseBoxPrice: any;
  isManualPrice: boolean;
  isActive: boolean;
  defaultItems: AdminTemplateItem[];
}

export function useAdminRitual() {
  const [templates, setTemplates] = useState<AdminRitualTemplate[]>([]);
  const [activeModalTemplate, setActiveModalTemplate] = useState<AdminRitualTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  // Synchronize state array with backend storage records on context initialization
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const data = await AdminRitualService.getAdminTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to load active layout configurations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleOpenCreate = () => {
    setActiveModalTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (template: AdminRitualTemplate) => {
    setActiveModalTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setActiveModalTemplate(null);
    setIsModalOpen(false);
  };

  // Process data mutations using client-side service endpoints
  const handleSaveData = async (formData: CreateTemplateInput | UpdateTemplateInput) => {
    setIsMutating(true);
    try {
      const targetId = activeModalTemplate ? activeModalTemplate.id : null;
      let savedRecord: AdminRitualTemplate;

      if (targetId) {
        // Dispatch modification network requests
        savedRecord = await AdminRitualService.updateTemplate(targetId, formData as UpdateTemplateInput);
        setTemplates(prev => prev.map(t => t.id === targetId ? savedRecord : t));
      } else {
        // Dispatch structural element initialization requests
        savedRecord = await AdminRitualService.createTemplate(formData as CreateTemplateInput) as any;
        setTemplates(prev => [savedRecord, ...prev]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Admin ritual transaction network mutation fault:", error);
    } finally {
      setIsMutating(false);
    }
  };

  // Dispatch elimination signal layer down to structural data arrays
  const handleDeleteTemplate = async (id: string) => {
    try {
      await AdminRitualService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error(`Failed to completely drop configuration element ${id}:`, error);
    }
  };

  return {
    templates,
    setTemplates,
    activeModalTemplate,
    isModalOpen,
    isLoading,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSaveData,
    handleDeleteTemplate
  };
}