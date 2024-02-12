import { useEffect, useState } from "react";

import { CartItem as CartItemType } from "@/interface/cart";
import { Product } from "@/interface/product";
import CartItem from "@/pages/Cart/CartItem";

import { getAuth } from "firebase/auth";
import { getCartItems } from "@/services/cartService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Cart = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [quantities, setQuantities] = useState<Record<Product["id"], number>>(
    {}
  ); // 각 상품의 수량을 저장하는 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  const startEditing = () => {
    setIsEditing(true);
  };

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
      };

      fetchCartItems();
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
    <div className="flex flex-col w-48 h-48">
      {cart.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          // 수정 모드일 때만 updateQuantity와 removeFromCart prop을 전달합니다.
          {...(isEditing ? { updateQuantity, removeFromCart } : {})}
        />
      ))}
      {!isEditing ? (
        <button onClick={startEditing}>수정</button> // 수정 버튼
      ) : (
        <button
          onClick={() => {
            saveChanges();
            setIsEditing(false);
          }}
        >
          완료
        </button> // 완료 버튼
      )}
    </div>
  );
};

export default Cart;