import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type AuthContextType = {
  isAuth: boolean;
  login: () => void;
  logout: () => void;
} | null;

const AuthContext = createContext<AuthContextType>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 로그인 상태를 읽어옴
    const savedIsAuth = localStorage.getItem("isAuth");
    return savedIsAuth ? JSON.parse(savedIsAuth) : false;
  });

  useEffect(() => {
    // 로그인 상태가 변경될 때마다 이를 로컬 스토리지에 저장
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }, [isAuth]);

  const login = () => {
    setIsAuth(true);
  };

  const logout = () => {
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
