import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Product } from "@/interface/product";
import { UserType } from "@/interface/user";
import { getCartItems } from "@/services/cartService";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

import SEOMetaTag from "@/components/SEOMetaTag";

import ProductHeader from "@/components/Header/ProductHeader";
import CartModal from "@/components/modals/cartModal";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Swal from "sweetalert2";

function SellProductDetail() {
  const auth = getAuth();
  const { isSeller } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [count, setCount] = useState<number>(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { addToCart: addToCartContext } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const firebaseUserDocRef = doc(db, "users", firebaseUser?.uid);
        const firebaseUserSnap = await getDoc(firebaseUserDocRef);
        if (firebaseUserSnap.exists()) {
          const userData = firebaseUserSnap.data();
          if (userData) {
            setUser({
              id: firebaseUser.uid,
              email: userData.email,
              isSeller: userData.isSeller,
              nickname: userData.nickname,
              createdAt: userData.createdAt,
              updatedAt: userData.updateAt,
            });
          }
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;

          setProduct(productData);
        }
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "products"),
            where("productCategory", "==", product.productCategory),
            where("__name__", "!=", id),
            limit(3)
          )
        );

        const relatedProductList: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          let idNumber: number;
          try {
            idNumber = Number(doc.id);
            if (isNaN(idNumber)) {
              throw new Error("ID is not a number");
            }
          } catch (error) {
            console.error(error);
            return;
          }

          const productData: Product = {
            id: idNumber,
            sellerId: data.sellerId,
            productName: data.productName,
            productPrice: data.productPrice,
            productQuantity: data.productQuantity,
            productDescription: data.productDescription,
            productCategory: data.productCategory,
            productImage: data.productImage,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
          relatedProductList.push(productData);
        });
        setRelatedProducts(relatedProductList);
      }
    };

    fetchRelatedProducts();
  }, [product, id]);

  const addToCart = async () => {
    if (user && product) {
      if (count <= 0) {
        Swal.fire({
          icon: "error",
          title: "수량 오류",
          text: "한개 이상의 상품을 선택해주세요.",
        });
        return;
      }

      const cartItem = { product, quantity: count };
      addToCartContext(cartItem);

      const cartRef = doc(db, "carts", user.id);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        let cartData = await getCartItems(user.id);

        if (!Array.isArray(cartData)) {
          cartData = [];
        }

        const existingItemIndex = cartData.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingItemIndex > -1) {
          cartData[existingItemIndex].quantity += count;
        } else {
          cartData.push(cartItem);
        }

        await updateDoc(cartRef, { items: cartData });
      } else {
        await setDoc(cartRef, { items: [cartItem] });
      }

      if (
        product.productQuantity !== null &&
        product.productQuantity >= count
      ) {
        const productRef = doc(db, "products", product.id.toString());
        await updateDoc(productRef, {
          productQuantity: product.productQuantity - count,
        });

        setProduct({
          ...product,
          productQuantity: product.productQuantity - count,
        });

        Swal.fire({
          icon: "success",
          title: "상품 추가",
          text: "장바구니에 상품이 추가되었습니다.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "재고 부족",
          text: "남아있는 상품 수량이 부족합니다.",
        });
      }
    }
  };

  if (!product) {
    return <div>상품을 불러오는 중...</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showPageBackSpaceButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - SellProductDetail"
          description="판매 중인 상품 상세보기 페이지입니다."
        />
      </header>
      <main style={{ minWidth: "1300px" }} className="center">
        <div className="flex  w-full gap-12 pt-[70px] pb-[80px] justify-center">
          <div className="w-[580px] h-[580px]">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full "
            >
              <CarouselContent>
                {product.productImage.map((image, index) => (
                  <CarouselItem key={index} className=" ">
                    <div className="">
                      <img
                        src={image}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-[580px] h-[580px]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="flex flex-col gap-9 text-right w-[600px]">
            <p className="font-bold text-4xl mt-8">{product.productName}</p>
            <p className="text-3xl mt-3">{product.productPrice}원</p>
            <p className="text-3xl mt-8">
              남은 갯수 : {product.productQuantity}개
            </p>
            <div className="flex text-5xl justify-evenly">
              <button
                className=""
                onClick={() => count > 0 && setCount(count - 1)}
              >
                -
              </button>
              <div className="  w-5">{count}</div>
              <button
                className=" "
                onClick={() => count < 30 && setCount(count + 1)}
              >
                +
              </button>
            </div>
            <div className="border-b-2"></div>
            <div className="flex items-end justify-between mx-2 text-2xl ">
              <div>총 상품 구매</div>
              <div className="flex items-end ">
                구매 수량{" "}
                <span className="mx-1 text-LightBlue-500">{count}</span> |
                <span className="ml-1 text-LightBlue-500 text-4xl">
                  {product && product.productPrice
                    ? product.productPrice * count
                    : null}
                </span>
                원
              </div>
            </div>

            <div className="flex flex-col">
              <button className="text-2xl text-gray-500 flex justify-end mr-2">
                <Link to={`/category/${product.productCategory}`}>
                  #{product.productCategory}
                </Link>
              </button>

              <div className="flex justify-around ml-4 mt-1">
                <Button
                  onClick={addToCart}
                  size={"customsize"}
                  className="w-[250px] hover:bg-LightBlue-500 text-white bg-LightBlue-200 text-2xl"
                >
                  장바구니 추가
                </Button>
                <Button
                  size={"customsize"}
                  className="w-[250px] hover:bg-LightBlue-500 text-white bg-LightBlue-200 text-2xl"
                >
                  구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-12 text-4xl ">상품 설명</div>
          <p
            className="mx-10 mt-3 border-4 border-LightBlue-500 rounded  overflow-y-auto overflow-x-hidden word-wrap: break-word"
            style={{ height: "8em" }}
          >
            {product.productDescription}
          </p>
        </div>
        {!isSeller && (
          <div>
            <Button
              onClick={toggleModal}
              className="fixed flex justify-center items-center bottom-8 left-8 z-50 rounded-full bg-zinc-800"
            >
              장바구니 보기
            </Button>
            <CartModal isOpen={isModalOpen} toggleModal={toggleModal} />
          </div>
        )}
      </main>
      <footer className="pt-[100px]">
        <div className="">
          <h2 className="text-2xl font-bold mb-4">이 카테고리의 다른 상품들</h2>
          {relatedProducts.map((relatedProduct: Product) => (
            <div key={relatedProduct.id} className="mb-4">
              <Link
                to={`/sellproduct/${relatedProduct.id}`}
                className="flex items-center p-3"
              >
                {relatedProduct.productImage &&
                relatedProduct.productImage.length > 0 ? (
                  <img
                    src={relatedProduct.productImage[0]}
                    alt={relatedProduct.productName}
                    className="w-16 h-16 object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 mr-4"></div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {relatedProduct.productName}
                  </h3>
                  <p className="text-lg font-medium">
                    {relatedProduct.productPrice}원
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}

export default SellProductDetail;
