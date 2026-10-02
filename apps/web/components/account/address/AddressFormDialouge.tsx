// apps/web/app/account/components/AddressFormDialog.tsx
'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function AddressFormDialog({ isOpen, onClose, onSubmit }: AddressFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await onSubmit({
        ...data,
        isDefault: formData.get('isDefault') === 'true',
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Surface */}
      <div className="relative bg-white border border-[#EAE3D2] w-full max-w-lg rounded-xl shadow-xl overflow-hidden flex flex-col animate-scale-up text-left">
        <div className="bg-[#1B3B2B] px-6 py-4 flex items-center justify-between border-b border-[#1B3B2B]">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#FCFAF7]">{t('Add delivery address')}</h3>
            <p className="text-[11px] text-[#EAE3D2]/80">{t('Add an address for future deliveries.')}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#FCFAF7]/80 hover:text-[#FCFAF7] p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('Full name')}</label>
              <input required name="fullName" type="text" placeholder="John Doe" className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('Phone number')}</label>
              <input required name="phone" type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('Address line 1')}</label>
            <input required name="line1" type="text" placeholder={t('House or flat, building, street')} className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('Address line 2 (optional)')}</label>
            <input name="line2" type="text" placeholder={t('Landmark or area')} className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('City')}</label>
              <input required name="city" type="text" placeholder="Mumbai" className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('State')}</label>
              <input required name="state" type="text" placeholder="Maharashtra" className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('Postal code')}</label>
              <input required name="postalCode" type="text" placeholder="400001" className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1B3B2B] uppercase tracking-wider block">{t('Country')}</label>
              <input required name="country" type="text" placeholder="India" className="w-full px-3 py-2 border border-[#EAE3D2] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1B3B2B] bg-[#FCFAF7]/30" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input id="isDefault" name="isDefault" type="checkbox" value="true" className="w-4 h-4 rounded text-[#1B3B2B] border-[#EAE3D2] focus:ring-[#1B3B2B]" />
            <label htmlFor="isDefault" className="text-xs text-[#7C7467] font-medium selection:bg-transparent">{t('Use as my default address')}</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE3D2]/60">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-[#7C7467] uppercase tracking-wider hover:bg-[#1B3B2B]/5 rounded-md transition-colors"
            >
              {t('Cancel')}
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#1B3B2B] text-[#FCFAF7] text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1B3B2B]/90 transition-all flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              {t('Save address')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}