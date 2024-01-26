// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { ProtectRoute } from "./ProtectRoute";
// import Home from "../pages/home";
// import About from "@/pages/about";
// import SignUp from "@/pages/SignUp";
// import Login from "@/pages/Login";

// export default function AppRouter() {
//   const isAuth = true;
//   //false 비로그인, true 로그인

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <ProtectRoute element={<Home />} isAuth={isAuth} isPrivate /> // isPrivate 비공개 경로
//           }
//         />
//         <Route
//           path="/about"
//           element={<ProtectRoute element={<About />} isAuth={isAuth} />}
//         />
//         <Route
//           path="/signup"
//           element={<ProtectRoute element={<SignUp />} isAuth={isAuth} />}
//         />
//         <Route
//           path="/signin"
//           element={<ProtectRoute element={<Login />} isAuth={isAuth} />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

//2

// import React from "react";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "@/contexts/AuthContext";
// import Home from "../pages/home";
// import About from "@/pages/about";
// import SignUp from "@/pages/SignUp";
// import Login from "@/pages/login";
// // import ProtectRoute from "./ProtectRoute";

// const AppRouter = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={<ProtectedComponent Component={Home} isPrivate />}
//           />
//           <Route
//             path="/about"
//             element={<ProtectedComponent Component={About} />}
//           />
//           <Route
//             path="/signup"
//             element={<ProtectedComponent Component={SignUp} />}
//           />
//           <Route
//             path="/login"
//             element={<ProtectedComponent Component={Login} />}
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// // const ProtectedComponent = ({ Component, isPrivate = false }) => {
// //   const { isAuth, isSeller } = useAuth();

// //   // isPrivate가 true이면 판매자(isSeller)인지도 확인합니다.
// //   const canAccess = isPrivate ? isAuth && isSeller : isAuth || !isPrivate;

// //   return canAccess ? <Component /> : <ProtectRoute />;
// // };

// // export default AppRouter;

// const ProtectedComponent = ({ Component, isPrivate = false }) => {
//   const { isAuth } = useAuth();

//   // 인증된 사용자만이 접근할 수 있도록 합니다.
//   // isPrivate 페이지는 인증된 사용자에게만 접근을 허용합니다.
//   // 인증되지 않은 사용자는 로그인 페이지로 리디렉션됩니다.
//   if (isPrivate && !isAuth) {
//     // 인증되지 않았다면 로그인 페이지로 리디렉션합니다.
//     return <Navigate to="/login" />;
//   }

//   // 그렇지 않다면 해당 컴포넌트를 렌더링합니다.
//   return <Component />;
// };

// export default AppRouter;

//3

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Home from "../pages/home";
import About from "@/pages/about";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import MyProfile from "@/pages/MyProfile";
import Seller from "@/pages/SellerProfile";
import Product from "@/pages/Product/ProductPage";
import ProductDetail from "@/pages/Product/ProductDetail";
import { ProtectRoute } from "./ProtectRoute"; // ProtectRoute 컴포넌트를 import

const AppRouter = () => {
  const auth = useAuth(); // useAuth 훅을 사용하여 isAuth 값을 얻음
  const isAuth = auth ? auth.isAuth : false;

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
              isSeller={true}
            />
          }
        />
        <Route
          path="/signup"
          element={<ProtectRoute element={<SignUp />} isAuth={isAuth} />}
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
              isSeller={true}
            />
          }
        />
        <Route
          path="/seller"
          element={
            <ProtectRoute
              element={<Seller />}
              isAuth={isAuth}
              isPrivate={true}
            />
          }
        />
        <Route
          path="/product"
          element={
            <ProtectRoute
              element={<Product />}
              isAuth={isAuth}
              isPrivate={true}
            />
          }
        />
        <Route
          path="/productdetail"
          element={<ProtectRoute element={<ProductDetail />} isAuth={isAuth} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
