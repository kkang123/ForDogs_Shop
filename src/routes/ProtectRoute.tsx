import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectRouteProps {
  element: React.ReactElement;
  isAuth: boolean;
  isSeller?: boolean;
  isPrivate?: boolean;
}

export const ProtectRoute: React.FC<ProtectRouteProps> = ({
  element,
  isAuth,
  isSeller = false,
  isPrivate = false,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isPrivate && !isAuth) {
      console.log("비공개 경로입니다. 로그인해주세요.");
      navigate("/login");
    } else if (isPrivate && isAuth) {
      console.log("비공개 경로에 로그인 회원 접근");
      if (isSeller) {
        console.log("판매자 전용 페이지 접근");
      } else {
        console.log("구매자 전용 페이지 접근");
        // navigate("/"); // 구매자 전용 페이지로 수정
      }
    } else if (!isPrivate && isAuth) {
      console.log("공개 경로에 회원 접근");
    } else {
      console.log("공개 경로에 비회원 접근");
    }
  }, [isPrivate, isAuth, isSeller, navigate]);

  return element;
};
