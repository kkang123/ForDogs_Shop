import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";

import { Order } from "@/interface/order";

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
        user.uid = doc.id;
        usersData.push(user);
      }
      setUsers(usersData);
    };

    fetchUsers();

    const fetchOrders = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("uid", "==", urlUid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      setOrders(
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Order)
        )
      );
    };

    fetchOrders();
  }, [uid, urlUid]);

  const cancelOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "주문 취소" });

    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: "주문 취소" } : o))
    );
  };

  function groupOrdersByGroupId(orders: Order[]): { [key: string]: Order[] } {
    return orders.reduce((acc, order) => {
      if (!acc[order.groupid]) {
        acc[order.groupid] = [];
      }
      acc[order.groupid].push(order);
      return acc;
    }, {} as { [key: string]: Order[] });
  }

  const groupedOrders = groupOrdersByGroupId(orders);

  return (
    <>
      <div>마이프로필</div>
      <div>구매 내역</div>
      <div className=" flex-col">
        {Object.entries(groupedOrders).map(([groupid, orders]) => {
          // 주문 그룹 내의 모든 주문에 대해 상품 가격을 합산
          const totalAmount = orders.reduce(
            (sum, order) =>
              sum + (order.status === "주문 취소" ? 0 : order.amount),
            0
          );
          return (
            <div key={groupid} className="flex gap-2">
              <h2 className="flex items-center">
                결제 시간:{" "}
                {orders[0].timestamp
                  .toDate() // Firestore Timestamp를 JavaScript Date로 변환
                  .toLocaleString()}{" "}
                {/* Date를 원하는 형식의 문자열로 변환 */}
              </h2>
              {orders.map((order) => (
                <div key={order.id} className="border-2">
                  <div>주문 번호: {order.id}</div>
                  <div>상품 이름: {order.item.product.productName}</div>
                  <div>상품 갯수: {order.item.quantity}</div>{" "}
                  {/* 상품 개수 출력 */}
                  <div>
                    판매자:{" "}
                    {users.find(
                      (user) => user.uid === order.item.product.sellerId
                    )?.nickname || "알 수 없음"}
                  </div>
                  <div>상품 가격: {order.item.product.productPrice}</div>
                  <div>주문 상태: {order.status}</div>
                  <div>전체 가격: {order.amount}</div>
                  {order.status === "결제 완료" && (
                    <Button size="sm" onClick={() => cancelOrder(order.id)}>
                      주문 취소
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex items-center">
                총 결제 가격: {totalAmount}원
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MyProfile;
