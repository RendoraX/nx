export interface ValidateCouponDTO {
  code: string;
  subtotal: number;
}

export interface CouponRule {
  id?: string;
  code: string;
  percentage?: number | null;
  fixedAmount?: number | null;
  startsAt: Date;
  expiresAt: Date;
  usageLimit?: number | null;
}
