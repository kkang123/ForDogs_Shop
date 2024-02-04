import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext"; // useAuth 훅을 import

import "../App.css";

import Header from "@/components/Header/MainHeader";
import { Link } from "react-router-dom";

export default function Home() {
  const user = useAuth();
  console.log(user);

  // const { logout } = useAuth(); // useAuth 훅을 사용하여 logout 함수를 얻음

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(true);
        console.log(user);
      } else {
        console.log(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />

      <div className="w-full h-[90vh] flex flex-col justify-start items-center mt-20">
        <h1>Home</h1>
        <p>가장 먼저 보여지는 페이지입니다.</p>
        <div>안녕하세요 {user?.nickname} 님</div>
        <Link to={`/productdetail/1706776956553`}>123123</Link>
        <Link to={`/sellproduct/1706776956553`}>상품 판매 중</Link>
      </div>
    </>
  );
}
