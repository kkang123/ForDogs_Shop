import { useCart } from "@/contexts/CartContext";

interface CartModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, toggleModal }) => {
  const { cart } = useCart();

  if (!isOpen) return null;

  const total = cart.reduce((sum, cartItem) => {
    const price = cartItem.product.productPrice || 0;
    return sum + price * cartItem.quantity;
  }, 0);

  return (
    <div
      onClick={toggleModal}
      className="flex items-center justify-center h-screen"
    >
      <div
        className="shadow-2xl p-2 inline-block min-w-1/2 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {cart.map((cartItem) => (
          <div key={cartItem.product.id}>
            <h2>{cartItem.product.productName}</h2>
            <p>가격: {cartItem.product.productPrice}</p>
            <p>수량: {cartItem.quantity}</p>
          </div>
        ))}
        <p className="mt-2">총 가격: {total}원</p>
      </div>
    </div>
  );
};

export default CartModal;
