import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "@/firebase";
import { setDoc, doc, Timestamp, deleteDoc } from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

import SEOMetaTag from "@/components/SEOMetaTag";

import { Button } from "@/components/ui/button";

import Swal from "sweetalert2";

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

interface DaumPostcodeData {
  address: string;
  zonecode: string;
}

interface IMP {
  init: (key: string) => void;
  request_pay: (
    data: PaymentData,
    callback: (response: PaymentResponse) => void
  ) => void;
}

interface DaumPostcode {
  open: () => void;
}

interface Daum {
  postcode: {
    load: (callback: () => void) => void;
  };
  Postcode: new (options: {
    oncomplete: (data: DaumPostcodeData) => void;
  }) => DaumPostcode;
}

declare global {
  interface Window {
    IMP: IMP;
    daum: Daum;
  }
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { uid, nickname } = useAuth();
  const { cart, resetCart } = useCart();

  const [buyerInfo, setBuyerInfo] = useState({
    name: nickname || "",
    tel: "",
    email: "",
    addr: "",
    postcode: "",
  });

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

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const openPostcode = useCallback(() => {
    window.daum.postcode.load(function () {
      new window.daum.Postcode({
        oncomplete: function (data: DaumPostcodeData) {
          setBuyerInfo((prev) => ({
            ...prev,
            addr: data.address,
            postcode: data.zonecode,
          }));
        },
      }).open();
    });
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

  const onClickPayment = useCallback(() => {
    if (!uid || nickname === null) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { IMP } = window;
    IMP?.init(import.meta.env.VITE_APP_IMP_KEY);

    const amount = cart.reduce(
      (total, item) => total + (item.product.productPrice || 0) * item.quantity,
      0
    );

    const name = cart.map((item) => item.product.productName).join(", ");

    const data = {
      pg: "nice",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      amount,
      name,
      buyer_name: buyerInfo.name,
      buyer_tel: buyerInfo.tel,
      buyer_email: buyerInfo.email,
      buyer_addr: buyerInfo.addr,
      buyer_postcode: buyerInfo.postcode,
    };

    IMP?.request_pay(data, async (response) => {
      if (response.success) {
        try {
          const groupid = `group_${new Date().getTime()}`;

          for (const item of cart) {
            const docId = `order_${new Date().getTime()}`;
            const docRef = doc(db, "orders", docId);
            await setDoc(docRef, {
              uid,
              buyer_name: buyerInfo.name,
              amount: (item.product.productPrice || 0) * item.quantity,
              item,
              timestamp: Timestamp.fromDate(new Date()),
              status: "결제 완료",
              groupid,
            });
          }

          if (uid) {
            const cartRef = doc(db, "carts", uid);
            await deleteDoc(cartRef);
          }

          Swal.fire("결제 성공", "주문이 완료되었습니다.", "success").then(
            () => {
              resetCart();
              navigate("/");
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
    <>
      <header>
        <SEOMetaTag
          title="For Dogs - Pay"
          description="결제 진행 페이지입니다."
        />
      </header>
      <main>
        <div className="flex justify-center mt-20">
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

            <button
              className="hover:bg-gray-200"
              type="button"
              onClick={openPostcode}
            >
              주소 검색
            </button>

            <input
              type="text"
              name="addr"
              value={buyerInfo.addr}
              onChange={handleChange}
              placeholder="주소"
            />

            <input
              type="text"
              name="postcode"
              value={buyerInfo.postcode}
              onChange={handleChange}
              placeholder="우편번호"
            />
            <Button size="sm" onClick={onClickPayment}>
              결제하기
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Payment;
