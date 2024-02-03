import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import Home from "../pages/home";
import About from "@/pages/about";
import BuyerSignUp from "@/pages/BuyerSignUp";
import SellerSignUp from "@/pages/SellerSignUp";
import Login from "@/pages/Login";
import MyProfile from "@/pages/MyProfile";
import Seller from "@/pages/SellerProfile";
import { ProtectRoute } from "./ProtectRoute";

// 판매자전용
import ProductUpload from "@/pages/Product/ProductUpload";
import ProductList from "@/pages/Product/ProductList";
import ProductDetail from "@/pages/Product/ProductDetail";
import ProductEdit from "@/pages/Product/ProductEdit";

const AppRouter = () => {
  const { isSeller, isAuth } = useAuth();
  // let uid = auth().currentUser.uid;
  console.log(isAuth);
  console.log(isSeller);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ProtectRoute element={<Home />} isAuth={isAuth} />}
        />
        <Route
          path="/about"
          element={
            <ProtectRoute
              element={<About />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true} // 판매자 전용
            />
          }
        />
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
        <Route
          path="/myprofile"
          element={
            <ProtectRoute
              element={<MyProfile />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={false} // 구매자 전용
            />
          }
        />

        {/* 판매자 페이지 */}
        <Route
          path="/seller"
          element={
            <ProtectRoute
              element={<Seller />}
              isAuth={isAuth}
              isPrivate={true}
              isProtected={true} //판매자 전용
            />
          }
        />
        <Route
          path="/productlist/:uid"
          element={
            <ProtectRoute
              element={<ProductList />}
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
