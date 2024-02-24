import { Product } from "@/interface/product";
import React, { createContext, useState, useContext, useEffect } from "react";

interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  resetCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartProvider = ({ children }: React.PropsWithChildren) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const resetCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
