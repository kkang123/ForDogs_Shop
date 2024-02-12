import React from "react";
import { Link } from "react-router-dom";

import { CartItem as CartItemType } from "@/interface/cart";
import { Product } from "@/interface/product";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (productId: Product["id"], newQuantity: number) => void;
  removeFromCart: (productId: Product["id"]) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeFromCart,
}) => {
  const { product, quantity } = item;
  console.log("CartItem props:", item, updateQuantity, removeFromCart);

  return (
    <div>
      <Link to={`/sellproduct/${product.id}`}>
        <img src={product.productImage[0]} alt={product.productName} />
        <p>상품 이름: {product.productName}</p>
        <p>상품 가격: {product.productPrice}</p>
      </Link>
      <p>수량: {quantity}</p>
      <button onClick={() => updateQuantity(product.id, quantity + 1)}>
        갯수 증가
      </button>
      <button
        onClick={() => quantity > 0 && updateQuantity(product.id, quantity - 1)}
      >
        갯수 감소
      </button>
      <button onClick={() => removeFromCart(product.id)}>삭제</button>
    </div>
  );
};

export default CartItem;
