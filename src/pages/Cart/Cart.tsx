import React from "react";
import { useParams } from "react-router-dom";

import CartItem from "./CartItem";
import useCartItems from "@/hook/useCartItems";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { uid } = useParams<{ uid: string | undefined }>();
  const items = useCartItems(uid);

  return (
    <div className="flex  w-48 h-48">
      {items.map((item) => (
        <Link key={item.product.id} to={`/sellproduct/${item.product.id}`}>
          <CartItem key={item.product.id} item={item} />
        </Link>
      ))}
    </div>
  );
};

export default Cart;
