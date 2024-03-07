import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

import SEOMetaTag from "@/components/SEOMetaTag";

import Swal from "sweetalert2";

export default function SellerSignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [nickname, setnickname] = useState<string>("");

  const [nameMessage, setNameMessage] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] =
    useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "nickname") setnickname(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "passwordConfirm") setPasswordConfirm(value);
  };

  const validate = async () => {
    let isValid = true;
    const easyPasswords = ["123", "abc", "password"];
    const specialCharPattern = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
    const upperCasePattern = /[A-Z]/g;
    const lowerCasePattern = /[a-z]/g;
    const numberPattern = /[0-9]/g;
    const emailPrefix = email.substring(0, email.indexOf("@"));

    if (nickname === "") {
      setNameMessage("이름을 입력해주세요.");
      isValid = false;
    } else {
      setNameMessage("");
    }

    const emailRegex =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*.[A-Za-z]{2,3}$/i;

    if (!emailRegex.test(email)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
      isValid = false;
    } else {
      const methods = await fetchSignInMethodsForEmail(getAuth(), email);
      if (methods.length > 0) {
        setEmailMessage(
          "이미 가입된 이메일입니다. 다른 이메일을 선택해주세요."
        );
        isValid = false;
      } else {
        setEmailMessage("");
      }
    }

    if (password.length < 10) {
      setPasswordMessage("비밀번호는 최소 10자리 이상이어야 합니다.");
    } else if (password.length > 16) {
      setPasswordMessage("비밀번호는 최대 16자리 이하이어야 합니다.");
    } else if (password === email) {
      setPasswordMessage("비밀번호에 이메일을 사용할 수 없습니다.");
    } else if (password.includes(emailPrefix)) {
      setPasswordMessage("비밀번호에 아이디값을 사용할 수 없습니다.");
    } else {
      if (
        [
          specialCharPattern,
          upperCasePattern,
          lowerCasePattern,
          numberPattern,
        ].filter((pattern) => password.match(pattern)).length < 2
      ) {
        setPasswordMessage(
          "비밀번호는 영어 대문자/소문자, 숫자, 특수문자 중 2종류 이상의 문자 조합이어야 합니다."
        );
      } else if (
        easyPasswords.some((easyPassword) => password.includes(easyPassword))
      ) {
        setPasswordMessage(
          "비밀번호에는 쉬운 문자열(ex :123, abc, password 등)이 포함되지 않아야 합니다."
        );
        isValid = false;
      } else {
        setPasswordMessage("비밀번호가 일치합니다.");
      }
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setPasswordConfirmMessage("");
    }

    return isValid;
  };

  const usersignUp = async (event: FormEvent) => {
    event.preventDefault();

    if (!(await validate())) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await signOut(auth);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: Date.now(),
        email: email,
        isSeller: true,
        nickname: nickname,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "auth/email-already-in-use") {
          Swal.fire({
            icon: "warning",
            title: "",
            html: "이미 사용 중인 이메일입니다.</br> 다른 이메일을 사용해 주세요.",
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "",
            html: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
          });
        }
      }
    }
  };

  return (
    <>
      <header>
        <SEOMetaTag
          title="For Dogs - SellerSignUp"
          description="판매자 회원가입 페이지입니다."
        />
      </header>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="mt-5 text-3xl font-bold text-gray-700">
          판매자 회원가입
        </h2>
        <form
          className="p-5 bg-white rounded shadow-lg w-1/2"
          onSubmit={usersignUp}
          noValidate
        >
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="nickname"
            >
              이름
            </label>
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={nickname}
              onChange={onChange}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="이름을 입력해주세요."
            />
            {nameMessage && (
              <p className="text-red-500 text-xs text-left ml-1 mt-1">
                {nameMessage}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="email"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="이메일을 입력해주세요."
            />
            {emailMessage && (
              <p className="text-red-500 text-xs text-left ml-1 mt-1">
                {emailMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="비밀번호를 입력해주세요."
            />
            {passwordMessage && (
              <p className="text-red-500 text-xs text-left ml-1 mt-1">
                {passwordMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 text-left"
              htmlFor="passwordConfirm"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={onChange}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="비밀번호를 다시 입력해주세요."
            />
            {passwordConfirmMessage && (
              <p
                className={
                  passwordConfirmMessage === "비밀번호가 일치합니다"
                    ? "text-blue-500 text-xs text-left ml-1 mt-1"
                    : "text-red-500 text-xs text-left ml-1 mt-1"
                }
              >
                {passwordConfirmMessage}
              </p>
            )}
          </div>

          <div className="flex  justify-center">
            <button
              className="w-[100px] px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline "
              onClick={usersignUp}
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
