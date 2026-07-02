export interface CreateOrderDTO {
  addressId: string;
  couponCode?: string;
}

export interface UpdateOrderStatusDTO {
  status: string;
}
