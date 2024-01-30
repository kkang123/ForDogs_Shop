// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // getAuth 사용
import { getFirestore } from "firebase/firestore"; // firestore
import { getStorage } from "firebase/storage";
// import { FirebaseApp, initializeApp } from "firebase/app";
// import { Auth, getAuth } from "firebase/auth";
// import { Firestore, getFirestore } from "firebase/firestore";
// TS 타입 체크 활용, 타입 명시 app, auth, db 객체의 타입 명시 코드 안정성, 가독성 상승
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // 테스트용
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
