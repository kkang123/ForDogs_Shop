import React, { createContext, useState, useContext, useEffect } from "react";
import { Product } from "@/interface/product";

interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextProps {
  cart: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (productId: Product["id"]) => void;
  resetCart: () => void;
  setCart: (cart: CartItem[]) => void;
}

export const CartContext = createContext<CartContextProps>(
  {} as CartContextProps
);

export const CartProvider = ({ children }: React.PropsWithChildren) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existItemIndex = prevCart.findIndex(
        (item) => item.product.id === newItem.product.id
      );
      if (existItemIndex > -1) {
        // 상품이 이미 카트에 있는 경우, 수량 갱신
        const updatedCart = [...prevCart];
        updatedCart[existItemIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        // 새로운 상품 추가
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: Product["id"]) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const resetCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, resetCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
