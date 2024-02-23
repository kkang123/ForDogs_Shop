import { Timestamp } from "firebase/firestore";

export interface OrderItem {
  product: {
    productName: string;
    sellerId: string;
    productPrice: number;
  };
  quantity: number;
}

export interface Order {
  id: string;
  uid: string;
  buyerId: string;
  buyer_name: string;
  amount: number;
  item: OrderItem;
  timestamp: Timestamp;
  status: string;
  groupid: string;
}
