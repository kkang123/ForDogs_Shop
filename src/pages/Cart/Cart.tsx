// import React from "react";
// import { useParams } from "react-router-dom";

// import CartItem from "./CartItem";
// import useCartItems from "@/hook/useCartItems";
// import { Link } from "react-router-dom";

// const Cart: React.FC = () => {
//   const { uid } = useParams<{ uid: string | undefined }>();
//   const items = useCartItems(uid);

//   const updateQuantity = async (productId: string, newQuantity: number) => {};

//   const removeFromCart = async (productId: string) => {};

//   return (
//     <div className="flex  w-48 h-48">
//       {items.map((item) => (
//         <Link key={item.product.id} to={`/sellproduct/${item.product.id}`}>
//           <CartItem
//             key={item.product.id}
//             item={item}
//             updateQuantity={(productId, newQuantity) =>
//               updateQuantity(productId, newQuantity)
//             }
//             removeFromCart={(productId) => removeFromCart(productId)}
//           />
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default Cart;

// // 2

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import firebase from "firebase/app";
// import "firebase/firestore"; // Firestore를 사용하기 위해 import

// import CartItem from "./CartItem";

// const Cart: React.FC = () => {
//   const { uid } = useParams<{ uid: string | undefined }>();
//   const [items, setItems] = useState([]); // 장바구니 아이템을 저장할 상태
//   const [loading, setLoading] = useState(false);

//   // Firestore에서 장바구니 아이템을 불러오는 함수
//   const getCartItems = async () => {
//     setLoading(true);
//     const db = firebase.firestore();
//     const cartItems = await db.collection("cart").where("uid", "==", uid).get();
//     setItems(cartItems.docs.map((doc) => doc.data()));
//     setLoading(false);
//   };

//   useEffect(() => {
//     getCartItems();
//   }, [uid]);

//   // Firestore에서 장바구니 아이템의 수량을 업데이트하는 함수
//   const updateQuantity = async (productId: string, newQuantity: number) => {
//     setLoading(true);
//     const db = firebase.firestore();
//     await db
//       .collection("cart")
//       .doc(productId)
//       .update({ quantity: newQuantity });
//     setLoading(false);
//   };

//   // Firestore에서 장바구니 아이템을 삭제하는 함수
//   const removeFromCart = async (productId: string) => {
//     setLoading(true);
//     const db = firebase.firestore();
//     await db.collection("cart").doc(productId).delete();
//     setLoading(false);
//   };

//   return (
//     <div className="flex w-48 h-48">
//       {items.map((item) => (
//         <CartItem
//           key={item.product.id}
//           item={item}
//           updateQuantity={(productId, newQuantity) =>
//             updateQuantity(productId, newQuantity)
//           }
//           removeFromCart={(productId) => removeFromCart(productId)}
//         />
//       ))}
//       {loading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default Cart;

// 3

// import React, { useState } from "react";
// import { CartItem } from "@/interface/cart";
// import { Product } from "@/interface/product";

// const Cart = () => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [quantities, setQuantities] = useState<Record<Product["id"], number>>(
//     {}
//   ); // 각 상품의 수량을 저장하는 상태

//   // 각 상품의 수량을 수정하는 함수
//   const updateQuantity = (productId: Product["id"], quantity: number) => {
//     if (quantity >= 0) {
//       setQuantities({
//         ...quantities,
//         [productId]: quantity,
//       });
//     }
//   };

//   // 특정 상품을 장바구니에서 삭제하는 함수
//   const removeFromCart = (productId: Product["id"]) => {
//     setCart(cart.filter((item) => item.product.id !== productId));
//     const newQuantities = { ...quantities };
//     delete newQuantities[productId];
//     setQuantities(newQuantities);
//   };

//   return (
//     <div className="flex flex-col w-48 h-48">
//       {cart.map((item) => (
//         <div
//           key={item.product.id}
//           className="flex items-center justify-between my-2"
//         >
//           <div>{item.product.productName}</div>
//           <div>
//             <button
//               onClick={() =>
//                 updateQuantity(
//                   item.product.id,
//                   (quantities[item.product.id] || 0) - 1
//                 )
//               }
//             >
//               -
//             </button>
//             <span>{quantities[item.product.id] || 0}</span>
//             <button
//               onClick={() =>
//                 updateQuantity(
//                   item.product.id,
//                   (quantities[item.product.id] || 0) + 1
//                 )
//               }
//             >
//               +
//             </button>
//           </div>
//           <button onClick={() => removeFromCart(item.product.id)}>삭제</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Cart;

// 4

import { useEffect, useState } from "react";

import { CartItem as CartItemType } from "@/interface/cart";
import { Product } from "@/interface/product";
import CartItem from "@/pages/Cart/CartItem";

import { getAuth } from "firebase/auth";
import { getCartItems } from "@/services/cartService";

const Cart = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [quantities, setQuantities] = useState<Record<Product["id"], number>>(
    {}
  ); // 각 상품의 수량을 저장하는 상태

  // 컴포넌트가 마운트될 때 장바구니 데이터를 불러옵니다.
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (userId) {
      const fetchCartItems = async () => {
        const items = await getCartItems(userId);
        setCart(items);
        console.log("Fetched cart items:", items);
      };

      fetchCartItems();
    }
  }, []);

  // 각 상품의 수량을 수정하는 함수
  const updateQuantity = (productId: Product["id"], quantity: number) => {
    console.log("Before updateQuantity:", quantities);
    if (quantity >= 0) {
      setQuantities({
        ...quantities,
        [productId]: quantity,
      });
    }
    console.log("After updateQuantity:", quantities);
  };

  // 특정 상품을 장바구니에서 삭제하는 함수
  const removeFromCart = (productId: Product["id"]) => {
    console.log("Before removeFromCart:", cart);
    setCart(cart.filter((item) => item.product.id !== productId));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
    console.log("After removeFromCart:", cart);
  };

  return (
    <div className="flex flex-col w-48 h-48">
      {cart.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      ))}
    </div>
  );
};

export default Cart;
