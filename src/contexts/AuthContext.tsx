import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

type AuthContextType = {
  isAuth: boolean;
  isSeller: boolean;
  login: () => void;
  logout: () => void;
} | null;

const AuthContext = createContext<AuthContextType>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(() => {
    const savedIsAuth = localStorage.getItem("isAuth");
    return savedIsAuth ? JSON.parse(savedIsAuth) : false;
  });
  const [isSeller, setIsSeller] = useState(() => {
    const savedIsSeller = localStorage.getItem("isSeller");
    return savedIsSeller && savedIsSeller !== "undefined"
      ? JSON.parse(savedIsSeller)
      : false;
  }); // 로컬 스토리지에서 isSeller 값을 읽어옵니다.

  useEffect(() => {
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }, [isAuth]);

  useEffect(() => {
    localStorage.setItem("isSeller", JSON.stringify(isSeller)); // isSeller 상태가 변경될 때마다 이를 로컬 스토리지에 저장합니다.
  }, [isSeller]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setIsSeller(userSnap.data().isSeller);
        }
      } else {
        setIsSeller(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = () => {
    setIsAuth(true);
  };

  const logout = () => {
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, isSeller, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
