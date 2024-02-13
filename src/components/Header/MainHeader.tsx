import React, { FormEvent, useEffect, useState } from "react";

import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import basket from "@/assets/basket-buy-cart.svg";

function MainHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 추가
  const [uid, setUid] = useState<string | null>(null);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setIsLoggedIn(true);
        setUid(user.uid); // 로그인한 경우 uid를 설정
      } else {
        setIsLoggedIn(false);
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async (event: FormEvent) => {
    event.preventDefault(); // 이벤트의 기본 동작을 막아줍니다.
    try {
      await signOut(auth);
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Error during log out", error);
    }
  };

  const Login = (event: FormEvent) => {
    event.preventDefault();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white">
        <div className="">로고 이미지</div>
        <div className="flex">
          <div className=""></div>
          <button className="">
            <img src={basket} alt="Basket" />
          </button>
          <div className=" inline-block ml-2 mr-2">
            <Button variant="outline" size="sm" onClick={logOut}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log(`isLoggedIn: ${isLoggedIn}, uid: ${uid}`); // 로그인 상태와 uid 값을 출력

  return (
    <>
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-50">
        <Link to={`/`}>
          <div className="">로고 이미지</div>
        </Link>
        <div className="flex">
          <div className=""></div>
          <Link to={isLoggedIn && uid ? `/cart/${uid}` : "#"}>
            <button className="">
              <img src={basket} alt="Basket" />
            </button>
          </Link>
          <div className=" inline-block ml-2 mr-2">
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={logOut}>
                로그아웃
              </Button>
            ) : (
              <Button size="sm" onClick={Login}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainHeader;
