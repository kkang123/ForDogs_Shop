import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "@/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import {
  collection,
  getDocs,
  where,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");

  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // 사용자 정보에 따라 로그인 상태면 로그인으로 못들어게 막는 역할
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const buyersignUp = (event: FormEvent) => {
    event.preventDefault();
    navigate("/buyersignup");
  };
  const sellersignUp = (event: FormEvent) => {
    event.preventDefault();
    navigate("/sellersignup");
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();

    const userDocQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userDocQuery);
    let userDoc: QueryDocumentSnapshot<DocumentData> | null = null;

    querySnapshot.forEach((doc) => {
      userDoc = doc;
    });

    if (!userDoc) {
      Swal.fire({
        icon: "error",
        title: "",
        text: "회원정보를 찾을 수 없습니다.",
      });
      return;
    }

    const userData = userDoc.data();
    if (tab === "buyer" && userData.isSeller) {
      Swal.fire({
        icon: "error",
        title: "로그인 오류",
        text: "구매자 계정으로 로그인 해주세요.",
      });
      return;
    }

    if (tab === "seller" && !userData.isSeller) {
      Swal.fire({
        icon: "error",
        title: "로그인 오류",
        text: "판매자 계정으로 로그인 해주세요.",
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("user with signIn", userCredential.user);
      login(); // 로그인에 성공하면 login 함수를 호출하여 isAuth 상태를 true로 변경
    } catch (error) {
      console.error("error with signIn", error);
      Swal.fire({
        icon: "error",
        title: "",
        text: "이메일 또는 비밀번호가 틀립니다.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="mt-64 mb-0 text-3xl font-bold text-gray-700">Login</h2>
      {/* 구매자 / 판매자 btn */}
      <div className="w-full md:w-1/2 lg:w-1/3 m-auto mt-10 ">
        <div
          role="tablist"
          className="w-full"
          aria-label="구매자/판매자 로그인"
        >
          <button
            type="button"
            role="tab"
            className={`w-1/2 px-4 py-2 rounded-tl-lg ${
              tab === "buyer"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            aria-selected={tab === "buyer"}
            onClick={() => setTab("buyer")}
          >
            구매자
          </button>
          <button
            type="button"
            role="tab"
            className={`w-1/2 px-4 py-2 rounded-tr-lg ${
              tab === "seller"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            aria-selected={tab === "seller"}
            onClick={() => setTab("seller")}
          >
            판매자
          </button>
        </div>
        {/* 구매자 */}
        {tab === "buyer" ? (
          <form className="p-5 bg-white rounded-b-lg shadow-lg w-full noValidate">
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700 text-left"
                htmlFor="email"
              >
                이메일
              </label>
              <input
                id="email"
                className="w-full px-3 py-2  text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="email"
                value={email}
                name="email"
                onChange={onChange}
                placeholder="이메일을 입력해주세요."
              ></input>
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-bold text-gray-700 text-left"
                htmlFor="password"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  aria-hidden={!passwordShown}
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  value={password}
                  name="password"
                  onChange={onChange}
                  placeholder="비밀번호를 입력해주세요."
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-4 py-2 text-xs leading-tight text-gray-700 bg-transparent border-none cursor-pointer focus:outline-none"
                  onClick={togglePasswordVisiblity}
                >
                  {passwordShown ? "비밀번호 숨기기" : "비밀번호 표시하기"}
                </button>
              </div>
            </div>

            <div className="w-full flex flex-nowrap justify-center gap-10 ">
              <button
                className="w-[100px] px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                onClick={signIn}
              >
                로그인
              </button>
              <button
                className=" w-[100px] px-4 py-2 mt-5 font-bold text-gray-700 bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:shadow-outline"
                onClick={buyersignUp}
                type="button"
              >
                회원가입
              </button>
            </div>
          </form>
        ) : (
          // 판매자
          <form className="p-5 bg-white rounded-b-lg shadow-lg w-full">
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700 text-left"
                htmlFor="email"
              >
                이메일
              </label>
              <input
                id="email"
                className="w-full px-3 py-2  text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="email"
                value={email}
                name="email"
                onChange={onChange}
                placeholder="이메일을 입력해주세요."
              ></input>
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-bold text-gray-700 text-left"
                htmlFor="password"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  aria-hidden={!passwordShown}
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  value={password}
                  name="password"
                  onChange={onChange}
                  placeholder="비밀번호를 입력해주세요."
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-4 py-2 text-xs leading-tight text-gray-700 bg-transparent border-none cursor-pointer focus:outline-none"
                  onClick={togglePasswordVisiblity}
                >
                  {passwordShown ? "비밀번호 숨기기" : "비밀번호 표시하기"}
                </button>
              </div>
            </div>

            <div className="w-full flex flex-nowrap justify-center gap-10 ">
              <button
                className="w-[100px] px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                onClick={signIn}
              >
                로그인
              </button>
              <button
                className=" w-[100px] px-4 py-2 mt-5 font-bold text-gray-700 bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:shadow-outline"
                onClick={sellersignUp}
                type="button"
              >
                회원가입
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
