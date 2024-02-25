import { FormEvent, useEffect, useState } from "react";

import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import mainlogo from "@/assets/main-logo.svg";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showHomeButton?: boolean;
  showBackspaseButton?: boolean;
  showUploadButton?: boolean;
  showPageBackSpaceButton?: boolean;
  showProductManagement?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  showEditButton = false,
  showDeleteButton = false,
  showHomeButton = false,
  showBackspaseButton = false,
  showUploadButton = false,
  showPageBackSpaceButton = false,
  showProductManagement = false,
  onDelete,
  onEdit,
}) => {
  const authContext = useAuth();
  const { logout } = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        setUserId(user.uid);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signOut(auth);
      logout();
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
  const Management = (event: FormEvent) => {
    event.preventDefault();
    navigate("/productmanagement/${uid}");
  };

  const PageBackSpaceButton = (event: FormEvent) => {
    event.preventDefault();
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-50 h-20">
        <button className="" onClick={Home}>
          <img src={mainlogo} alt="main-logo" className="w-9  " />
        </button>
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
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-50 h-20">
        {showHomeButton && (
          <button className="" onClick={Home}>
            <img src={mainlogo} alt="main-logo" className="w-9  " />
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
          {showProductManagement && (
            <Button variant="ghost" size="sm" onClick={Management}>
              판매 내역 관리
            </Button>
          )}
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
