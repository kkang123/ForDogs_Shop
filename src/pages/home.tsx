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

  // 애니메이션 되는 커다란 이미지 div 창
  // 카테고리별 조회 4개씩 sellerid로 보는게 아닌 카테고리로 확인
  //

  return (
    <>
      <header className="z-50">
        <Header />
      </header>
      <main className="mt-36">
        <div className="">
          <ul className="">
            <div className="relative group cursor-pointer">
              Category
              <ul className="absolute hidden group-hover:block bg-gray-200 w-full z-40">
                <li>
                  <Link to={`/category/a`}>CategoryA</Link>
                </li>
                <li>CategoryB</li>
                <li>
                  <Link to={`/category/의류`}>의류</Link>
                </li>
                <li>d</li>
                <li>e</li>
              </ul>
            </div>
          </ul>
        </div>
        <div className="relative w-full h-[90vh]">
          <img
            src="src\assets\찌비.JPG"
            alt=""
            className=" absolute inset-0 w-full h-full object-cover "
          />
        </div>
        <div className="w-full h-[90vh] flex flex-col justify-start items-center ">
          <h1>Home</h1>
          <p>가장 먼저 보여지는 페이지입니다.</p>
          <div>안녕하세요 {user?.nickname} 님</div>
          <Link to={`/productdetail/1706776956553`}>123123</Link>
          <Link to={`/sellproduct/1706776956553`}>상품 판매 중</Link>
        </div>
      </main>
      <footer></footer>
    </>
  );
}
