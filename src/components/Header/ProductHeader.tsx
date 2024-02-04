import { FormEvent, useEffect, useState } from "react";

import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  showEditButton?: boolean; // 기본값 false
  showDeleteButton?: boolean;
  showHomeButton?: boolean;
  showBackspaseButton?: boolean;
  showUploadButton?: boolean;
  showPageBackSpaceButton?: boolean;
  onDelete?: () => void; // 삭제 함수를 받는 prop 추가
  onEdit?: () => void;
}

// function ProductHeader() {
const ProductHeader: React.FC<ProductHeaderProps> = ({
  showEditButton = false,
  showDeleteButton = false,
  showHomeButton = false,
  showBackspaseButton = false,
  showUploadButton = false,
  showPageBackSpaceButton = false,
  onDelete,
  onEdit,
}) => {
  const authContext = useAuth();
  const { logout } = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 추가
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const goToProductListPage = () => {
    if (userId) navigate(`/productlist/${userId}`);
  };

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setUserId(user.uid); // uid 상태에 저장
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async (event: FormEvent) => {
    event.preventDefault(); // 이벤트의 기본 동작을 막아줍니다.
    try {
      await signOut(auth);
      logout(); // 로그아웃에 성공하면 logout 함수를 호출하여 isAuth 상태를 false로 변경
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Error during log out", error);
    }
  };

  const Login = (event: FormEvent) => {
    event.preventDefault();
    navigate("/login");
  };

  const Home = (event: FormEvent) => {
    event.preventDefault();
    navigate("/");
  };

  const Backspace = (event: FormEvent) => {
    event.preventDefault();
    goToProductListPage();
  };
  const Upload = (event: FormEvent) => {
    event.preventDefault();
    navigate("/productupload");
  };

  const PageBackSpaceButton = (event: FormEvent) => {
    event.preventDefault();
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between border-b-2 shadow-lg shadow-blue-500/70 bg-white">
        <button className="">로고 이미지</button>
        <div className="flex">
          {showEditButton && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              수정하기
            </Button>
          )}
          {showDeleteButton && (
            <Button variant="ghost" size="sm" onClick={onDelete}>
              삭제하기
            </Button>
          )}

          <div className=" inline-block ml-2 mr-2">
            <Button variant="outline" size="sm" onClick={logOut}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between border-b-2 shadow-lg shadow-blue-500/70 bg-white">
        {showHomeButton && (
          <button className="" onClick={Home}>
            로고 이미지
          </button>
        )}
        {showBackspaseButton && (
          <button className="" onClick={Backspace}>
            뒤로가기
          </button>
        )}
        {showPageBackSpaceButton && (
          <button className="" onClick={PageBackSpaceButton}>
            유저 사용 : 뒤로가기
          </button>
        )}

        <div className="flex">
          {showUploadButton && (
            <Button variant="ghost" size="sm" onClick={Upload}>
              상품 등록
            </Button>
          )}
          {showEditButton && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              수정하기
            </Button>
          )}
          {showDeleteButton && (
            <Button variant="ghost" size="sm" onClick={onDelete}>
              삭제하기
            </Button>
          )}

          <div className=" inline-block ml-2 mr-2">
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={logOut}>
                로그아웃
              </Button>
            ) : (
              <Button size="sm" onClick={Login}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductHeader;
