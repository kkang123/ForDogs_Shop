import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";

interface OrderItem {
  product: {
    productName: string;
    sellerId: string;
    productPrice: number;
  };
  quantity: number;
}

interface Order {
  id: string;
  uid: string;
  buyer_name: string;
  amount: number;
  items: OrderItem[];
  timestamp: Timestamp;
  status: string;
}

interface UserType {
  uid: string;
  email: string;
  isSeller: boolean;
  nickname: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function MyProfile() {
  const { uid } = useAuth();
  const { uid: urlUid } = useParams<{ uid: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const usersData: UserType[] = [];
      for (const doc of usersSnapshot.docs) {
        const user = doc.data() as UserType;
        user.uid = doc.id; // 문서 ID를 uid 필드에 저장
        usersData.push(user);
      }
      setUsers(usersData);
      console.log(usersData); // users 상태를 콘솔에 출력
    };

    fetchUsers();

    const fetchOrders = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("uid", "==", urlUid));
      const querySnapshot = await getDocs(q);
      setOrders(
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Order)
        )
      );
    };

    fetchOrders();
  }, [uid]);

  const cancelOrder = async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "CANCELED" });
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "CANCELED" } : order
      )
    );
  };

  return (
    <>
      <div>마이프로필</div>
      <div>구매 내역</div>
      <div className="flex flex-wrap gap-4 ">
        {orders.map((order) => (
          <div key={order.id}>
            <div>주문 번호: {order.id}</div>
            {order.items.map((item, index) => (
              <div key={index}>
                <div>상품 이름: {item.product.productName}</div>
                <div>
                  판매자:{" "}
                  {users.find((user) => user.uid === item.product.sellerId)
                    ?.nickname || "알 수 없음"}
                </div>
                <div>상품 가격: {item.product.productPrice}</div>{" "}
              </div>
            ))}
            <div>주문 상태: {order.status}</div>
            <div>전체 가격: {order.amount}</div> {/* 전체 가격 표시 */}
            {order.status === "PAID" && (
              <Button size="sm" onClick={() => cancelOrder(order.id)}>
                주문 취소
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default MyProfile;
