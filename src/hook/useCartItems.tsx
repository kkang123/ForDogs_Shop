import { useState, useEffect } from "react";
import { getCartItems } from "@/services/cartService";
import { CartItem as CartItemType } from "@/interface/cart";

const useCartItems = (uid: string | undefined): CartItemType[] => {
  const [items, setItems] = useState<CartItemType[]>([]);

  useEffect(() => {
    if (uid) {
      const fetchItems = async () => {
        const cartItems = await getCartItems(uid);
        setItems(cartItems);
      };

      fetchItems();
    }
  }, [uid]);

  return items;
};

export default useCartItems;

// useCartItems hook은 장바구니에 담긴 상품 목록을 가져오는 기능을 구현 중

// 용도: 이 hook은 장바구니에 담긴 상품 목록을 가져와서 이를 상태로 관리합니다. 이 상태는 장바구니 페이지에서 장바구니에 담긴 상품 목록을 보여주는 데 사용됩니다.
// 사용 방법: 이 hook은 장바구니 페이지의 컴포넌트에서 호출됩니다. 이 hook을 호출하면 장바구니에 담긴 상품 목록을 상태로 반환합니다. 이 상태를 사용하여 장바구니 페이지에서 장바구니에 담긴 상품 목록을 보여줍니다.
