import React from "react";
import { CartItem as CartItemType } from "@/interface/cart";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <div>
      <img src={item.product.productImage[0]} alt={item.product.productName} />
      <p>상품 이름: {item.product.productName}</p>
      <p>상품 가격: {item.product.productPrice}</p>
      <p>수량: {item.quantity}</p>
    </div>
  );
};

export default CartItem;
