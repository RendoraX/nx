export interface AddToCartDTO {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

export interface RemoveCartItemDTO {
  itemId: string;
}
