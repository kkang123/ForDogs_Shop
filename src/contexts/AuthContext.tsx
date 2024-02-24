import {
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
  uid: string | null;
  nickname: string | null;
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
  const [uid, setUid] = useState<string | null>(null); // uid 상태를 추가합니다.
  const [nickname, setNickname] = useState<string | null>(null);

  const [isAuth, setIsAuth] = useState(() => {
    const savedIsAuth = localStorage.getItem("isAuth");
    return savedIsAuth ? JSON.parse(savedIsAuth) : false;
  });
  const [isSeller, setIsSeller] = useState(() => {
    const savedIsSeller = localStorage.getItem("isSeller");
    return savedIsSeller && savedIsSeller !== "undefined"
      ? JSON.parse(savedIsSeller)
      : false;
  });

  useEffect(() => {
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }, [isAuth]);

  useEffect(() => {
    localStorage.setItem("isSeller", JSON.stringify(isSeller));
  }, [isSeller]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setIsSeller(userSnap.data().isSeller);
          setIsAuth(true);
          setUid(user.uid);
        }

        const userDocSnap = await getDoc(userDocRef);

        setNickname(userDocSnap.data()?.nickname || null);
      } else {
        setIsSeller(false);
        setNickname(null);
        setIsAuth(false);
        setUid(null);
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
    <AuthContext.Provider
      value={{ isAuth, isSeller, uid, nickname, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
