import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectRoute } from "./ProtectRoute";

import Home from "../pages/home/home";
import BuyerSignUp from "@/pages/SignUp/BuyerSignUp";
import SellerSignUp from "@/pages/SignUp/SellerSignUp";
import Login from "@/pages/Login/Login";
import MyProfile from "@/pages/SignUp/MyProfile";

// 상품 판매
import SellProductDetail from "@/pages/Product/SellProductDetail";

// 판매자전용
import ProductUpload from "@/pages/Product/ProductUpload";
import ProductList from "@/pages/Product/ProductList";
import ProductDetail from "@/pages/Product/ProductDetail";
import ProductEdit from "@/pages/Product/ProductEdit";
import ProductManagement from "@/pages/Product/ProductManagement";

// 카테고리
import CategoryA from "@/pages/Category/Category";

// 장바구니
import Cart from "@/pages/Cart/Cart";

// 결제
import Pay from "@/api/Payment";

const AppRouter = () => {
  const { isSeller, isAuth } = useAuth();
  console.log(isAuth);
  console.log(isSeller);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/pay"
          element={<ProtectRoute element={<Pay />} isAuth={isAuth} />}
        />
        <Route
          path="/"
          element={<ProtectRoute element={<Home />} isAuth={isAuth} />}
        />

        {/* 로그인, 회원 가입 */}

        <Route
          path="/buyersignup"
          element={<ProtectRoute element={<BuyerSignUp />} isAuth={isAuth} />}
        />
        <Route
          path="/sellersignup"
          element={<ProtectRoute element={<SellerSignUp />} isAuth={isAuth} />}
        />
        <Route
          path="/login"
          element={<ProtectRoute element={<Login />} isAuth={isAuth} />}
        />

        {/* 카테고리 */}

        <Route
          path="/category/:productCategory"
          element={<ProtectRoute element={<CategoryA />} isAuth={isAuth} />}
        />

        {/* 장바구니 */}
        <Route
          path="/cart/:uid"
          element={<ProtectRoute element={<Cart />} isAuth={isAuth} />}
        />

        {/* 구매자 */}

        <Route
          path="/myprofile/:uid"
          element={
            <ProtectRoute
              element={<MyProfile />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={false} // 구매자 전용
            />
          }
        />

        {/* 상품 판매 */}
        <Route
          path="/sellproduct/:id"
          element={
            <ProtectRoute element={<SellProductDetail />} isAuth={isAuth} />
          }
        />

        {/* 판매자 페이지 */}
        <Route
          path="/productlist/:uid"
          element={
            <ProtectRoute
              element={<ProductList />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true} // 판매자 전용
            />
          }
        />
        <Route
          path="/productmanagement/:uid"
          element={
            <ProtectRoute
              element={<ProductManagement />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true}
            />
          }
        />
        <Route
          path="/productdetail/:id"
          element={
            <ProtectRoute
              element={<ProductDetail />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true} // 판매자 전용
            />
          }
        />
        <Route
          path="/productedit/:id"
          element={
            <ProtectRoute
              element={<ProductEdit />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true} // 판매자 전용
            />
          }
        />
        <Route
          path="/productupload"
          element={
            <ProtectRoute
              element={<ProductUpload />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true} // 판매자 전용
              // isProtected={isSeller} // 판매자 전용
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

//isProtected true든 false 비공개 페이지면 꼭 걸어주어야함
