import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { db } from "@/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";

import { Order } from "@/interface/order";

import SEOMetaTag from "@/components/SEOMetaTag";

import { Button } from "@/components/ui/button";
import ProductHeader from "@/components/Header/ProductHeader";

interface UserType {
  uid: string;
  email: string;
  isSeller: boolean;
  nickname: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function ProductManagement() {
  const { uid } = useAuth() as { uid: string };
  const { uid: urlUid } = useParams<{ uid: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>(
    {}
  );

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
      const querySnapshot = await getDocs(ordersRef);
      const fetchedOrders = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Order)
      );
      const sellerOrders = fetchedOrders.filter((order) => {
        return order.item.product.sellerId === uid;
      });
      const sortedSellerOrders = sellerOrders.sort((a, b) => {
        return b.timestamp.seconds - a.timestamp.seconds;
      });
      setOrders(sortedSellerOrders);
    };

    fetchOrders();
  }, [uid, urlUid]);

  const orderStatusOptions = [
    "구매 확인",
    "발송 대기",
    "발송 시작",
    "주문 취소",
    "판매 완료",
  ];

  const updateOrderStatus = async (orderId: string, status: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const handleStatusChange = (orderId: string, status: string) => {
    setSelectedStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus, [orderId]: status };
      return updatedStatus;
    });
  };

  const applyStatusChange = async (orderId: string) => {
    if (selectedStatus[orderId]) {
      try {
        console.log("Updating status in Firestore...");
        await updateOrderStatus(orderId, selectedStatus[orderId]);
        console.log("Updated status in Firestore.");
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    } else {
      console.log("No selected status for this order.");
    }
  };

  return (
    <>
      <header className="h-20">
        <ProductHeader showPageBackSpaceButton={true} />
        <SEOMetaTag
          title="For Dogs - ProductMangement"
          description="결제 진행 중인 상품을 관리하는 페이지입니다."
        />
      </header>
      <main className="mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  ">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="border p-4">
                <div>
                  구매 시간:{" "}
                  {new Date(order.timestamp.seconds * 1000).toLocaleString()}
                </div>
                <div>주문 번호: {order.id}</div>
                <div>
                  <div>상품 이름: {order.item.product.productName}</div>
                  <div>상품 판매 갯수: {order.item.quantity}</div>
                  <div>
                    판매자:{" "}
                    {users.find(
                      (user) => user.uid === order.item.product.sellerId
                    )?.nickname || "알 수 없음"}
                  </div>
                  <div>
                    구매자:{" "}
                    {users.find((user) => user.uid === order.uid)?.nickname ||
                      "알 수 없음"}
                  </div>
                  <div>결제 금액: {order.amount}</div>
                </div>
                <div>주문 상태: {order.status}</div>
                <select
                  value={selectedStatus[order.id] || order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border-2 border-black rounded h-9"
                >
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <Button
                  size="sm"
                  onClick={() => applyStatusChange(order.id)}
                  className="ml-2"
                >
                  적용
                </Button>
              </div>
            ))
          ) : (
            <div>주문이 없습니다.</div>
          )}
        </div>
      </main>
    </>
  );
}

export default ProductManagement;
