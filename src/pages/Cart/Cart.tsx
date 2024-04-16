import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Product } from "@/interface/product";
import CartItem from "@/pages/Cart/CartItem";

import { getCartItems } from "@/services/cartService";

import { useCart } from "@/contexts/CartContext";

import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

import SEOMetaTag from "@/components/SEOMetaTag";

import MainHeader from "@/components/Header/MainHeader";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, setCart } = useCart();
  const [quantities, setQuantities] = useState<Record<Product["id"], number>>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
  };

  const navigate = useNavigate();

  const goToPayment = () => {
    navigate("/pay");
  };

  const saveChanges = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (userId) {
      const updatedCartItems = cart.map((item) => {
        const newQuantity = quantities[item.product.id];
        return {
          ...item,
          quantity: newQuantity !== undefined ? newQuantity : item.quantity,
        };
      });

      const itemsToSave = updatedCartItems.filter((item) => item.quantity > 0);

      const cartRef = doc(db, "carts", userId);
      await updateDoc(cartRef, { items: itemsToSave });
    }
  };

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

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId: Product["id"], quantity: number) => {
    if (quantity >= 0) {
      setQuantities({
        ...quantities,
        [productId]: quantity,
      });
    }
  };

  const removeFromCart = async (productId: Product["id"]) => {
    const itemToRemove = cart.find((item) => item.product.id === productId);
    const quantityToRemove = itemToRemove ? itemToRemove.quantity : 0;

    setCart(cart.filter((item) => item.product.id !== productId));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
    const productRef = doc(db, "products", productId.toString());
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();
      if (productData && productData.productQuantity !== null) {
        await updateDoc(productRef, {
          productQuantity: productData.productQuantity + quantityToRemove,
        });
      }
    }
  };

  return (
    <>
      <header className="h-[78px]">
        <MainHeader />
        <SEOMetaTag
          title="For Dogs - Cart"
          description="장바구니 페이지입니다."
        />
      </header>
      <main className="mt-36">
        <div className="flex flex-col">
          {cart.length === 0 ? (
            <div className="mt-10 flex justify-center mb-10">
              <div className="flex flex-col">
                <p>장바구니가 비어있습니다</p>
                {isEditing && (
                  <Button
                    className="flex justify-center mt-5"
                    onClick={() => {
                      saveChanges();
                      setIsEditing(false);
                    }}
                  >
                    완료
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center ">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className=" p-4 shadow border-2 rounded w-[230px] h-[380px] "
                  >
                    <CartItem
                      item={item}
                      {...(isEditing ? { updateQuantity, removeFromCart } : {})}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-center mb-10">
                {!isEditing ? (
                  <>
                    <div className="w-full flex justify-evenly">
                      <Button onClick={startEditing}>수정</Button>
                      <Button onClick={goToPayment}>결제</Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      saveChanges();
                      setIsEditing(false);
                    }}
                  >
                    완료
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;
