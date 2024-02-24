import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CartItem as CartItemType } from "@/interface/cart";
import { Product } from "@/interface/product";

import { Button } from "@/components/ui/button";

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

  const [quantity, setQuantity] = useState<number>(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <div className="w-48 h-48">
      <Link to={`/sellproduct/${product.id}`}>
        <img
          className="w-48 h-48"
          src={product.productImage[0]}
          alt={product.productName}
        />
        <div className="mt-2">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            상품 이름 : {product.productName}
          </p>
          <p>상품 가격 : {product.productPrice}</p>
          <p>수량 : {quantity}</p>
        </div>
      </Link>
      {updateQuantity && removeFromCart && (
        <>
          <div className="flex justify-between">
            <Button
              size="sm"
              onClick={() => {
                updateQuantity(product.id, quantity + 1);
                setQuantity(quantity + 1);
              }}
            >
              갯수 증가
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (quantity > 0) {
                  updateQuantity(product.id, quantity - 1);
                  setQuantity(quantity - 1);
                }
              }}
            >
              갯수 감소
            </Button>
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFromCart(product.id)}
            >
              삭제
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItem;
