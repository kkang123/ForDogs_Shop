import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { collection, setDoc, doc, Timestamp } from "firebase/firestore";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";

import Swal from "sweetalert2";
import { db } from "@/firebase";

interface PaymentData {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  amount: number;
  name: string;
  buyer_name: string;
  buyer_tel: string;
  buyer_email: string;
}

interface PaymentResponse {
  success: boolean;
  error_msg?: string;
}

interface IMP {
  init: (key: string) => void;
  request_pay: (
    data: PaymentData,
    callback: (response: PaymentResponse) => void
  ) => void;
}

declare global {
  interface Window {
    IMP: IMP;
  }
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { uid, nickname } = useAuth();

  const [buyerInfo, setBuyerInfo] = useState({
    name: nickname || "",
    tel: "",
    email: "",
  });

  // 새로고침 시 nickname 항상 표시
  useEffect(() => {
    setBuyerInfo((prev) => ({ ...prev, name: nickname || "" }));
  }, [nickname]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBuyerInfo({
        ...buyerInfo,
        [e.target.name]: e.target.value,
      });
    },
    [buyerInfo]
  );

  const { cart } = useCart(); // 카트 상태 가져오기

  const onClickPayment = useCallback(() => {
    console.log(uid);
    if (nickname === null) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { IMP } = window;
    IMP?.init(import.meta.env.VITE_APP_IMP_KEY);

    // 카트의 상품 가격 합계 계산
    const amount = cart.reduce(
      (total, item) => total + (item.product.productPrice || 0) * item.quantity,
      0
    );

    // 카트의 상품 이름 목록 만들기
    const name = cart.map((item) => item.product.productName).join(", ");

    const data = {
      pg: "nice",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount, // 결제 가격
      name, // 결제 상품 이름
      buyer_name: buyerInfo.name,
      buyer_tel: buyerInfo.tel,
      buyer_email: buyerInfo.email,
    };

    IMP?.request_pay(data, async (response) => {
      if (response.success) {
        try {
          const docRef = doc(collection(db, "orders")); // orders collection의 새로운 document reference를 생성
          await setDoc(docRef, {
            uid,
            buyer_name: buyerInfo.name,
            // buyer_tel: buyerInfo.tel,
            // buyer_email: buyerInfo.email, // 개인정보이기 때문에 제거
            amount, // 총 결제 금액
            items: cart, // 결제한 상품 목록
            timestamp: Timestamp.fromDate(new Date()), // 주문 시간
            status: "PAID", // 주문 상태
          });

          Swal.fire("결제 성공", "주문이 완료되었습니다.", "success").then(
            () => {
              navigate("/"); // 홈 화면으로 이동
            }
          );
        } catch (error) {
          console.error("주문 정보 저장 실패:", error);
        }
      } else {
        Swal.fire("결제 실패", `오류 메시지: ${response.error_msg}`, "error");
      }
    });
  }, [buyerInfo, cart, navigate, uid]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-2 w-1/2">
        <div>{buyerInfo.name}</div>
        <input
          type="tel"
          name="tel"
          value={buyerInfo.tel}
          onChange={handleChange}
          placeholder="전화번호"
        />
        <input
          type="email"
          name="email"
          value={buyerInfo.email}
          onChange={handleChange}
          placeholder="이메일"
        />
        <Button size="sm" onClick={onClickPayment}>
          결제하기
        </Button>
      </div>
    </div>
  );
};

export default Payment;
