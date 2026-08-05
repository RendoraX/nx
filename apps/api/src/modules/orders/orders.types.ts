export interface CreateOrderDTO {
  addressId: string;
  couponCode?: string;
  paymentMethod : string;
}

export interface UpdateOrderStatusDTO {
  status: string;
}
