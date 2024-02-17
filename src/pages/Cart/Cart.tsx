// import { useEffect, useState } from "react";

// import { Product } from "@/interface/product";
// import CartItem from "@/pages/Cart/CartItem";

// import { getCartItems } from "@/services/cartService";

// import { useCart } from "@/contexts/CartContext";

// import { getAuth } from "firebase/auth";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "@/firebase";

// import MainHeader from "@/components/Header/MainHeader";
// import { Button } from "@/components/ui/button";

// const Cart = () => {
//   const { cart, setCart } = useCart();
//   const [quantities, setQuantities] = useState<Record<Product["id"], number>>(
//     {}
//   ); // 각 상품의 수량을 저장하는 상태
//   const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

//   const startEditing = () => {
//     setIsEditing(true);
//   };

//   useEffect(() => {
//     console.log(cart); // 장바구니 상태 출력
//   }, [cart]);

//   useEffect(() => {
//     console.log("Local storage:", localStorage.getItem("cart")); // 로컬 스토리지 상태 출력
//   }, [cart]);

//   const saveChanges = async () => {
//     const auth = getAuth();
//     const userId = auth.currentUser?.uid;

//     if (userId) {
//       // quantities 상태에 따라 cart 상태를 업데이트합니다.
//       const updatedCartItems = cart.map((item) => ({
//         ...item,
//         quantity: quantities[item.product.id] || 0,
//       }));

//       // 수량이 0 이상인 아이템만 남깁니다.
//       const itemsToSave = updatedCartItems.filter((item) => item.quantity > 0);

//       // Firestore에 업데이트된 장바구니 아이템들을 저장합니다.
//       const cartRef = doc(db, "carts", userId);
//       await updateDoc(cartRef, { items: itemsToSave });
//     }
//   };

//   // 컴포넌트가 마운트될 때 장바구니 데이터를 불러옵니다.
//   useEffect(() => {
//     const auth = getAuth();
//     const userId = auth.currentUser?.uid;

//     if (userId) {
//       const fetchCartItems = async () => {
//         const items = await getCartItems(userId);
//         setCart(items);
//         console.log(items); // 장바구니 상태 출력
//       };

//       fetchCartItems();
//     }
//   }, []);

//   // 로컬스토리지 재호출
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     console.log("Saved cart:", savedCart); // 저장된 장바구니 상태 출력
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

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
//     console.log("Before removeFromCart:", cart);
//     setCart(cart.filter((item) => item.product.id !== productId));
//     const newQuantities = { ...quantities };
//     delete newQuantities[productId];
//     setQuantities(newQuantities);
//     console.log("After removeFromCart:", cart);
//   };

//   return (
//     <>
//       <header className="h-[78px]">
//         <MainHeader />
//       </header>
//       <main className="mt-36">
//         <div className="flex flex-col">
//           {cart.length === 0 ? (
//             <div className="mt-10 flex justify-center mb-10">
//               <div className="flex flex-col">
//                 <p>장바구니가 비어있습니다</p>
//                 {isEditing && (
//                   <Button
//                     className="flex justify-center mt-5"
//                     onClick={() => {
//                       saveChanges();
//                       setIsEditing(false);
//                     }}
//                   >
//                     완료
//                   </Button>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-3 gap-4 items-center justify-items-center ">
//                 {cart.map((item) => (
//                   <div className=" p-4 shadow border-2 rounded w-[230px] h-[380px] ">
//                     <CartItem
//                       key={item.product.id}
//                       item={item}
//                       {...(isEditing ? { updateQuantity, removeFromCart } : {})}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-10 flex justify-center mb-10">
//                 {!isEditing ? (
//                   <Button onClick={startEditing}>수정</Button>
//                 ) : (
//                   <Button
//                     onClick={() => {
//                       saveChanges();
//                       setIsEditing(false);
//                     }}
//                   >
//                     완료
//                   </Button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </>
//   );
// };

// export default Cart;

// 결제 페이지 이동

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Product } from "@/interface/product";
import CartItem from "@/pages/Cart/CartItem";

import { getCartItems } from "@/services/cartService";

import { useCart } from "@/contexts/CartContext";

import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

import MainHeader from "@/components/Header/MainHeader";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, setCart } = useCart();
  const [quantities, setQuantities] = useState<Record<Product["id"], number>>(
    {}
  ); // 각 상품의 수량을 저장하는 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  const startEditing = () => {
    setIsEditing(true);
  };

  const navigate = useNavigate();

  const goToPayment = () => {
    navigate("/pay");
  };

  useEffect(() => {
    console.log(cart); // 장바구니 상태 출력
  }, [cart]);

  useEffect(() => {
    console.log("Local storage:", localStorage.getItem("cart")); // 로컬 스토리지 상태 출력
  }, [cart]);

  const saveChanges = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (userId) {
      // quantities 상태에 따라 cart 상태를 업데이트합니다.
      const updatedCartItems = cart.map((item) => ({
        ...item,
        quantity: quantities[item.product.id] || 0,
      }));

      // 수량이 0 이상인 아이템만 남깁니다.
      const itemsToSave = updatedCartItems.filter((item) => item.quantity > 0);

      // Firestore에 업데이트된 장바구니 아이템들을 저장합니다.
      const cartRef = doc(db, "carts", userId);
      await updateDoc(cartRef, { items: itemsToSave });
    }
  };

  // 컴포넌트가 마운트될 때 장바구니 데이터를 불러옵니다.
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (userId) {
      const fetchCartItems = async () => {
        const items = await getCartItems(userId);
        setCart(items);
        console.log(items); // 장바구니 상태 출력
      };

      fetchCartItems();
    }
  }, []);

  // 로컬스토리지 재호출
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    console.log("Saved cart:", savedCart); // 저장된 장바구니 상태 출력
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 각 상품의 수량을 수정하는 함수
  const updateQuantity = (productId: Product["id"], quantity: number) => {
    if (quantity >= 0) {
      setQuantities({
        ...quantities,
        [productId]: quantity,
      });
    }
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
    <>
      <header className="h-[78px]">
        <MainHeader />
      </header>
      <main className="mt-36">
        <div className="flex flex-col">
          {cart.length === 0 ? (
            <div className="mt-10 flex justify-center mb-10">
              <div className="flex flex-col">
                <p>장바구니가 비어있습니다</p>
                {isEditing && (
                  <Button
                    className="flex justify-center mt-5"
                    onClick={() => {
                      saveChanges();
                      setIsEditing(false);
                    }}
                  >
                    완료
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center ">
                {cart.map((item) => (
                  <div className=" p-4 shadow border-2 rounded w-[230px] h-[380px] ">
                    <CartItem
                      key={item.product.id}
                      item={item}
                      {...(isEditing ? { updateQuantity, removeFromCart } : {})}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-center mb-10">
                {!isEditing ? (
                  <>
                    <Button onClick={startEditing}>수정</Button>
                    <Button onClick={goToPayment}>결제하기</Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      saveChanges();
                      setIsEditing(false);
                    }}
                  >
                    완료
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;
