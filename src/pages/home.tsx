import React, { FormEvent, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext"; // useAuth 훅을 import

import "../App.css";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    <>
      <div>
        <h1>Home</h1>
        <p>가장 먼저 보여지는 페이지입니다.</p>
        <button onClick={logOut}>로그아웃</button>
      </div>
      <div className="w-full h-screen flex flex-col justify-start items-center">
        <Alert>
          <AlertTitle>안녕하세요 수강생 여러분 반갑습니다.</AlertTitle>
          <AlertDescription>
            항해99 취업 리부트 프로그램에 오신걸 환영합니다.
          </AlertDescription>
        </Alert>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="mt-5">
              버튼을 눌러주세요.
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                프로젝트 셋팅을 완료하셨습니다.
              </AlertDialogTitle>
              <AlertDialogDescription>
                이제 1주차 기능 구현 과제들을 구현해주세요. 화이팅입니다!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction>완료</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
