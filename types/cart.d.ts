export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
}