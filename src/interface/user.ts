import { Timestamp } from "firebase/firestore";

export interface UserType {
  //   id: number;
  id: string;
  email: string;
  isSeller: boolean;
  nickname: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
