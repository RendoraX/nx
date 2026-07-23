'use client';
import React, { useRef, useState } from 'react';
import { Product, ProductImage } from '@/types/product';
import { Upload, Star, Trash2 } from 'lucide-react';

interface SubProps { 
  data: Partial<Product>; 
  onChange: (fields: Partial<Product>) => void; 
}

export function ProductImages({ data, onChange }: SubProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImages = data.images || [];
  const [isDragging, setIsDragging] = useState(false);

  const addRemoteImage = async (remoteUrl: string, position: number): Promise<ProductImage> => {
    const normalizedUrl = remoteUrl.startsWith('//') ? `https:${remoteUrl}` : remoteUrl;

    try {
      // Attempting to convert the cross-tab image URL into an actual File Object
      const response = await fetch(normalizedUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('CORS restriction');

      const blob = await response.blob();
      const fileName = normalizedUrl.split('/').pop()?.split('?')[0] || `dragged-asset-${position}.jpg`;
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

      return {
        url: URL.createObjectURL(blob),
        alt: fileName,
        position,
        file,
      };
    } catch (error) {
      // CRITICAL FAIL-SAFE: If the remote site blocks CORS, we still store the raw URL 
      // so it shows up on your screen instead of completely disappearing.
      return {
        url: normalizedUrl,
        alt: 'External Chrome Dragged Link Asset',
        position,
      };
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stops Chrome from opening the image file in a new window
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Lock down the drop layout completely
    setIsDragging(false);
    
    const freshCollection: ProductImage[] = [];
    const baseIndex = currentImages.length;

    // 1. Process local files dropped from the computer desktop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      
      if (droppedFiles.length > 0) {
        droppedFiles.forEach((file, idx) => {
          freshCollection.push({
            url: URL.createObjectURL(file),
            alt: file.name,
            position: baseIndex + idx,
            file,
          });
        });
        onChange({ images: [...currentImages, ...freshCollection].sort((a, b) => a.position - b.position) });
        return;
      }
    }

    // 2. Extract URLs from cross-tab Chrome/Google Images dragging actions
    const htmlText = e.dataTransfer.getData('text/html');
    const uriList = e.dataTransfer.getData('text/uri-list');
    const plainText = e.dataTransfer.getData('text/plain');

    let resolvedRemoteUrl = '';

    // HTML matches get priority because Chrome embeds the exact source string inside it
    if (htmlText) {
      const srcMatch = htmlText.match(/src="([^"]+)"/)?.[1];
      if (srcMatch) resolvedRemoteUrl = srcMatch;
    }
    
    if (!resolvedRemoteUrl && uriList) {
      resolvedRemoteUrl = uriList.split(/\r?\n/)[0].trim();
    }
    
    if (!resolvedRemoteUrl && plainText && /^(https?:\/\/|\/\/)/i.test(plainText.trim())) {
      resolvedRemoteUrl = plainText.trim();
    }

    if (resolvedRemoteUrl) {
      const remoteImageNode = await addRemoteImage(resolvedRemoteUrl, baseIndex);
      onChange({ images: [...currentImages, remoteImageNode].sort((a, b) => a.position - b.position) });
    }
  };

  const removeImage = (index: number) => {
    const modified = currentImages
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, position: i }));
    onChange({ images: modified });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Media Gallery</h3>
        <p className="text-xs text-gray-400">Drag images out of other browser tabs, Google Images search window, or upload straight from your computer desktop.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[150px] transition-all ${
          isDragging ? 'border-emerald-500 bg-emerald-50/70 scale-[0.98]' : 'border-gray-200 hover:border-emerald-500 bg-white'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          onChange={e => {
            if (e.target.files) {
              const arr = Array.from(e.target.files).map((f, i) => ({ 
                url: URL.createObjectURL(f), 
                alt: f.name, 
                position: currentImages.length + i, 
                file: f 
              }));
              onChange({ images: [...currentImages, ...arr].sort((a, b) => a.position - b.position) });
            }
          }} 
          className="hidden" 
          accept="image/*" 
        />
        <Upload className="w-5 h-5 text-gray-400 mb-2" />
        <p className="text-xs text-gray-600 font-semibold">Drop items cross-tab or choose local image files here</p>
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
          {currentImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden group shadow-2xs">
              <img src={img.url} alt={img.alt || 'Catalog Media'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button 
                type="button" 
                onClick={() => removeImage(idx)} 
                className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              {img.position === 0 && (
                <span className="absolute bottom-1 left-1 bg-emerald-600 text-white px-1.5 py-0.5 text-[8px] rounded font-bold uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                  <Star className="w-2 h-2 fill-current" /> Cover Target
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}