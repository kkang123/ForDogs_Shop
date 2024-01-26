// import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "@/firebase";
// import {
//     onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { getDocs, collection } from "firebase/firestore";
// import { db } from "@/firebase";

// export default function SignIn() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     auth.currentUser; // 현재 로그인한 정보 확인 가능
//   });

//   useEffect(() => {
//     const fetchDocs = async () => {
//       const querySnapshot = await getDocs(collection(db, "user")); // db에서 user 호출
//       querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${doc.data()}`); // 아이디와 데이터가 잘 나오는지 확인
//       });
//     };

//     fetchDocs();
//   }, []);

//   const onChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const {
//       target: { name, value },
//     } = event;
//     if (name === "email") {
//       setEmail(value);
//     }
//     if (name === "password") {
//       setPassword(value);
//     }
//   };

//   //회원가입 버튼 클릭 시 페이지 이동
//   const signUp = (event: FormEvent) => {
//     event.preventDefault();
//     navigate("/signup"); // '/signup'으로 이동
//   };

//   // 로그인
//   const signIn = async (event: FormEvent) => {
//     event.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       navigate("/");
//       console.log("user with signIn", userCredential.user);
//     } catch (error) {
//       console.error("error with signIn", error);
//     }
//   };
//   const logOut = async (event: FormEvent) => {
//     event.preventDefault();
//     await signOut(auth);
//   };

//   return (
//     <div className="App">
//       <h2>로그인 페이지</h2>
//       <form>
//         <div>
//           <label>이메일 : </label>
//           <input
//             type="email"
//             value={email}
//             name="email"
//             onChange={onChange}
//             required
//           ></input>
//         </div>
//         <div>
//           <label>비밀번호 : </label>
//           <input
//             type="password"
//             value={password}
//             name="password"
//             onChange={onChange}
//             required
//           ></input>
//         </div>
//         <button onClick={signUp}>회원가입</button>
//         <button onClick={signIn}>로그인</button>
//         <button onClick={logOut}>로그아웃</button>
//       </form>
//     </div>
//   );
// }

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext"; // useAuth 훅을 import

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth(); // useAuth 훅을 사용하여 login 함수를 얻음

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  //회원가입 버튼 클릭 시 페이지 이동
  const signUp = (event: FormEvent) => {
    event.preventDefault();
    navigate("/signup"); // '/signup'으로 이동
  };

  // 로그인
  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("user with signIn", userCredential.user);
      login(); // 로그인에 성공하면 login 함수를 호출하여 isAuth 상태를 true로 변경
      navigate("/");
    } catch (error) {
      console.error("error with signIn", error);
    }
  };

  return (
    <div className="App">
      <h2>로그인 페이지</h2>
      <form>
        <div>
          <label>이메일 : </label>
          <input
            type="email"
            value={email}
            name="email"
            onChange={onChange}
            required
          ></input>
        </div>
        <div>
          <label>비밀번호 : </label>
          <input
            type="password"
            value={password}
            name="password"
            onChange={onChange}
            required
          ></input>
        </div>
        <button onClick={signUp}>회원가입</button>
        <button onClick={signIn}>로그인</button>
      </form>
    </div>
  );
}
