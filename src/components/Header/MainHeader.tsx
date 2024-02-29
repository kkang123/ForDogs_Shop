import { FormEvent, useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { CartContext, CartContextProps } from "@/contexts/CartContext";

import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { Button } from "@/components/ui/button";

import mainlogo from "@/assets/main-logo.svg";
import basket from "@/assets/basket-buy-cart.svg";

function MainHeader() {
  const { isSeller } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const navigate = useNavigate();

  const { cart, setCart } = useContext(CartContext) as CartContextProps;
  const { resetCart } = useContext(CartContext) as CartContextProps;

  // localStorage에서 장바구니 정보를 호출
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const uniqueProductCount = new Set(cart.map((item) => item.product.id)).size;

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setIsLoggedIn(true);
        setUid(user.uid);
      } else {
        setIsLoggedIn(false);
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signOut(auth);
      resetCart();
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

  if (isLoading) {
    return (
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-40 h-20">
        <img src={mainlogo} alt="main-logo" className="w-9 h-9 pb-3 " />
        <div className="flex">
          {!isSeller && uid && (
            <Link to={`/myprofile/${uid}`}>
              <Button variant={"ghost"} size="sm">
                마이프로필
              </Button>
            </Link>
          )}
          {isSeller && (
            <Link to={`/productlist/${uid}`}>
              <Button size="sm">판매자 센터</Button>
            </Link>
          )}

          {!isSeller && (
            <Link to={isLoggedIn && uid ? `/cart/${uid}` : "#"}>
              <button className="">
                <div className="relative">
                  <img src={basket} alt="Basket" className="w-9" />
                  {uniqueProductCount > 0 && (
                    <span
                      className={`text-sm text-white absolute bottom-3.5 right-${
                        uniqueProductCount >= 10 ? "2.5" : "3.5"
                      }`}
                    >
                      {uniqueProductCount}
                    </span>
                  )}
                </div>
              </button>
            </Link>
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

  console.log(`isLoggedIn: ${isLoggedIn}, uid: ${uid}`);

  return (
    <>
      <div className="fixed px-5 py-5 top-0 left-0 right-0 flex  w-full justify-between shadow-lg  bg-white z-40 h-20">
        <button className="" onClick={Home}>
          <img src={mainlogo} alt="main-logo" className="w-9 h-9" />
        </button>

        <div className="flex">
          {!isSeller && uid && (
            <Link to={`/myprofile/${uid}`}>
              <Button variant={"ghost"} size="sm">
                마이프로필
              </Button>
            </Link>
          )}

          {isSeller && ( // isSeller가 true일 때만 '판매자 센터' 버튼을 표시합니다.
            <Link to={`/productlist/${uid}`}>
              <Button size="sm">판매자 센터</Button>
            </Link>
          )}

          {/* isSeller가 false일 때만 장바구니 표시 */}
          {!isSeller && (
            <Link to={isLoggedIn && uid ? `/cart/${uid}` : "#"}>
              <button className="">
                <div className="relative">
                  <img src={basket} alt="Basket" className="w-9 pb-3 " />
                  {uniqueProductCount > 0 && (
                    <span
                      className={`text-sm text-white absolute bottom-3.5 right-${
                        uniqueProductCount >= 10 ? "2.5" : "3.5"
                      }`}
                    >
                      {uniqueProductCount}
                    </span>
                  )}
                </div>
              </button>
            </Link>
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
}

export default MainHeader;
