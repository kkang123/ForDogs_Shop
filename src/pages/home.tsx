import React, { FormEvent, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext"; // useAuth 훅을 import

export default function Home() {
  const authContext = useAuth();
  console.log(authContext);
  const { logout } = authContext;
  // const { logout } = useAuth(); // useAuth 훅을 사용하여 logout 함수를 얻음

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(true);
      } else {
        console.log(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // 로그아웃
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

  return (
    <div>
      <h1>Home</h1>
      <p>가장 먼저 보여지는 페이지입니다.</p>
      <button onClick={logOut}>로그아웃</button>
    </div>
  );
}
