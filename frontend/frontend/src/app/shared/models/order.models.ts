export interface OrderItem {
  itemId: number;
  quantity: number;
  itemName?: string;
  price?: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  userInfo?: {
    name: string;
    surename: string;
    email: string;
  };
}

export interface OrderCreateDto {
  userId: number;
  orderItems: OrderItem[];
}

export interface OrderUpdateDto {
  status: string;
  userId?: number;
  orderItems?: OrderItem[];
}
