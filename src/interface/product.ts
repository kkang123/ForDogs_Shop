import { Timestamp, FieldValue } from "firebase/firestore";

export interface Product {
  id: number;
  sellerId: string;
  productName: string;
  productPrice: number | null; // Here
  productQuantity: number | null; // Here
  productDescription: string;
  productCategory: string;
  productImage: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp | FieldValue;
}
