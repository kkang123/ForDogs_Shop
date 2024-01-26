// import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "@/firebase";
// import {
//   createUserWithEmailAndPassword,
//   UserCredential,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { getDocs, collection } from "firebase/firestore";
// import { db } from "@/firebase";

// interface User {
//   id: number;
//   email: string;
//   isSeller: boolean;
//   nickname: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export default function SignUp() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [init, setInit] = useState<boolean>(false);

//   const [user, setUser] = useState<User>({
//     id: Date.now(),
//     email: "",
//     isSeller: false,
//     nickname: "",
//     password: "",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setIsLoggedIn(true);
//         // 사용자가 로그인한 상태라면 다른 페이지로 리디렉션할 수 있습니다.
//         // 예: navigate("/dashboard");
//       } else {
//         setIsLoggedIn(false);
//       }
//       setInit(true);
//     });

//     return () => unsubscribe(); // clean-up 함수로 구독 해제
//   }, [navigate]);

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

//   const signUp = async (event: FormEvent) => {
//     event.preventDefault();

//     try {
//       const userCredential: UserCredential =
//         await createUserWithEmailAndPassword(auth, email, password);
//       navigate("/signin");
//       console.log("user SignUp", userCredential.user);
//     } catch (error) {
//       console.log("error with signUp", error); // 이미 가입한 아이디 비번이면 에러, 이메일 형식 아니여도 출력
//     }
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
//         <button onClick={signUp}>완료</button>
//       </form>
//     </div>
//   );
// }

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

// Firestore에 저장될 User 인터페이스 정의
interface User {
  id: number;
  email: string;
  isSeller: boolean;
  nickname: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setnickname] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);

  const navigate = useNavigate();

  // 사용자의 로그인 상태를 확인합니다.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        // navigate("/"); // 로그인한 사용자를 대시보드로 리디렉션
      } else {
        setIsLoggedIn(false);
      }
      setInit(true); // 애플리케이션 초기화가 완료되었음을 설정
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, [navigate]);

  // 입력 필드의 변경 사항을 처리합니다.
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "nickname") setnickname(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  // 회원가입 처리
  const signUp = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // Firebase Authentication을 통해 사용자를 생성합니다.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore에 사용자 정보를 저장합니다.
      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: Date.now(),
        email: email,
        isSeller: false,
        nickname: nickname, // 닉네임은 입력을 받아야 합니다.
        createdAt: Timestamp.fromDate(new Date()), // 현재 시간
        updatedAt: Timestamp.fromDate(new Date()), // 현재 시간
      });

      console.log("User created with UID:", userCredential.user.uid);
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // alert를 사용하여 사용자에게 이미 사용 중인 이메일임을 알립니다.
        alert(
          "이 이메일 주소는 이미 사용 중입니다. 다른 이메일 주소를 사용해 주세요."
        );
      } else {
        // 다른 종류의 오류에 대한 처리
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 사용자 인터페이스
  return (
    <div className="App">
      <h2>회원가입 페이지</h2>
      <form onSubmit={signUp}>
        <div>
          <label htmlFor="email">이름:</label>
          <input
            id="nickname"
            type="text"
            name="nickname"
            value={nickname}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button onClick={signUp}>완료</button>
      </form>
    </div>
  );
}
