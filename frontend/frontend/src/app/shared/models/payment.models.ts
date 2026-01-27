export interface Payment {
  id: number;
  orderId: number;
  userId: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  timestamp: string;
  paymentAmount: number;
}

export interface PaymentRequest {
  orderId: number;
  userId: number;
  paymentAmount: number;
}
