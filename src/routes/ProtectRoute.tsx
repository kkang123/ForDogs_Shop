import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectRouteProps {
  element: React.ReactElement;
  isAuth: boolean;
  isProtected?: boolean;
  isPrivate?: boolean;
}

export const ProtectRoute: React.FC<ProtectRouteProps> = ({
  element,
  isAuth,
  isProtected = false,
  isPrivate = false,
}) => {
  const navigate = useNavigate();
  const { isSeller } = useAuth();

  useEffect(() => {
    if (isPrivate && !isAuth) {
      navigate("/login");
    } else if (isPrivate && isAuth && isProtected !== isSeller) {
      navigate("/");
    }
  }, [isPrivate, isAuth, isSeller, isProtected, navigate]);

  return element;
};
