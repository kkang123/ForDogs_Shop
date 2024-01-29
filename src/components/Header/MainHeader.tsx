import React, { FormEvent, useEffect, useState } from "react";

import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import basket from "@/assets/basket-buy-cart.svg";

function MainHeader() {
  const authContext = useAuth();
  const { logout } = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async (event: FormEvent) => {
    event.preventDefault(); // 이벤트의 기본 동작을 막아줍니다.
    try {
      await signOut(auth);
      logout(); // 로그아웃에 성공하면 logout 함수를 호출하여 isAuth 상태를 false로 변경
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Error during log out", error);
    }
  };

  const Login = (event: FormEvent) => {
    event.preventDefault();
    navigate("/login");
  };

  return (
    <>
      <div className="flex  w-full justify-between">
        <div className="">로고 이미지</div>
        <div className="flex">
          <div className=""></div>
          <button className="">
            <img src={basket} alt="Basket" />
          </button>
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