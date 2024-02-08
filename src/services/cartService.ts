import { CartItem } from "@/interface/cart";
import { Product } from "@/interface/product";
import {
  collection,
  addDoc,
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";

// Firestore 초기화
const db = getFirestore();

// 장바구니에 상품을 추가하는 함수
export const addToCart = async (
  userId: string,
  product: Product,
  quantity: number
): Promise<void> => {
  if (quantity <= 0) {
    console.log("값이 0이면 함수 종료");
    return;
  }

  // 장바구니에 추가할 아이템 정보를 생성합니다.
  const cartItem: CartItem = {
    product: product,
    quantity: quantity, // 사용자가 선택한 수량
  };

  // Firestore의 'carts' 컬렉션에 아이템을 추가합니다.
  const cartsRef = collection(db, "carts");
  await addDoc(cartsRef, {
    userId: userId,
    items: [cartItem],
  });
};

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) {
    // 장바구니가 비어있는 경우 빈 배열을 반환합니다.
    return [];
  }

  // 장바구니 데이터를 가져옵니다.
  const cartData = cartSnap.data();
  return cartData.items;
};
