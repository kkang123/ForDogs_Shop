import React, { useState, useEffect, useCallback } from "react";

import { useCart } from "@/contexts/CartContext";
// import { useUser } from "@/contexts/AuthContext";

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
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    tel: "",
    email: "",
  });

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src = "https://cdn.iamport.kr/v1/iamport.js";
  //   script.async = true;
  //   document.head.appendChild(script);
  // }, []);

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
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
  // const user = useUser();

  const onClickPayment = useCallback(() => {
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

    IMP?.request_pay(data, (response) => {
      if (response.success) {
        // 서버에 결제 완료 요청을 보내고, 주문 정보를 DB에 저장
        alert("결제 성공");
      } else {
        // 결제 실패 처리
        alert(`결제 실패: ${response.error_msg}`);
      }
    });
  }, [buyerInfo, cart]); // 의존성 배열에 cart 추가

  return (
    <div>
      <input
        type="text"
        name="name"
        value={buyerInfo.name}
        onChange={handleChange}
        placeholder="이름"
      />
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
      <button onClick={onClickPayment}>결제하기</button>
    </div>
  );
};

export default Payment;
