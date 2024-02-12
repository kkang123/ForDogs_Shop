import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CartItem as CartItemType } from "@/interface/cart";
import { Product } from "@/interface/product";

interface CartItemProps {
  item: CartItemType;
  updateQuantity?: (productId: Product["id"], newQuantity: number) => void;
  removeFromCart?: (productId: Product["id"]) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeFromCart,
}) => {
  const { product } = item;

  // 로컬 상태로 수량을 관리합니다.
  const [quantity, setQuantity] = useState<number>(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <div>
      <Link to={`/sellproduct/${product.id}`}>
        <img src={product.productImage[0]} alt={product.productName} />
        <p>상품 이름: {product.productName}</p>
        <p>상품 가격: {product.productPrice}</p>
        <p>수량: {quantity}</p>
      </Link>
      {updateQuantity &&
        removeFromCart && ( // 수정 모드일 때만 버튼을 표시합니다.
          <>
            <button
              onClick={() => {
                updateQuantity(product.id, quantity + 1);
                setQuantity(quantity + 1);
              }}
            >
              갯수 증가
            </button>
            <button
              onClick={() => {
                if (quantity > 0) {
                  updateQuantity(product.id, quantity - 1);
                  setQuantity(quantity - 1);
                }
              }}
            >
              갯수 감소
            </button>
            <button onClick={() => removeFromCart(product.id)}>삭제</button>
          </>
        )}
    </div>
  );
};

export default CartItem;
