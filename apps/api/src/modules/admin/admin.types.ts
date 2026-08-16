// types/ritual.ts

/**
 * Represents the structure of an item within a custom Pooja Kit.
 * Now exclusively uses variantId for precise product identification.
 */
export interface KitItemInput {
  variantId: string;
  quantity: number;
}

/**
 * The validated payload structure for creating or updating a Ritual Template.
 */
export interface RitualTemplatePayload {
  name: string;
  slug: string;
  description: string;
  baseBoxPrice: number;
  isManualPrice: boolean;
  isActive: boolean;
  curatedBy: string;
  defaultItems: KitItemInput[];
}