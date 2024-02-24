import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";

import {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
} from "firebase/firestore";

import { Product } from "@/interface/product";

import "../App.css";

import Header from "@/components/Header/MainHeader";
import CartModal from "@/modals/cartModal";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const user = useAuth();

  const [sirials, setSirials] = useState<Product[]>([]);
  const [clothingProducts, setClothingProducts] = useState<Product[]>([]);
  const [snackProducts, setSnackProducts] = useState<Product[]>([]);
  const [toyProducts, setToyProducts] = useState<Product[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchProducts = async (
      category: string,
      setProducts: React.Dispatch<React.SetStateAction<Product[]>>
    ) => {
      const db = getFirestore();
      const productRef = collection(db, "products");
      const q = query(productRef, where("productCategory", "==", category));

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        let idNumber: number;
        try {
          idNumber = Number(doc.id);
          if (isNaN(idNumber)) {
            throw new Error("Document ID is not a number");
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
        products.push(productData);
      });
      setProducts(products);
    };

    fetchProducts("사료", setSirials);
    fetchProducts("간식", setSnackProducts);
    fetchProducts("의류", setClothingProducts);
    fetchProducts("장난감", setToyProducts);
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(true);
        console.log(user);
      } else {
        console.log(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="mt-36">
        <div>
          <ul>
            <div className="relative group cursor-pointer">
              Category
              <ul className="absolute hidden group-hover:block bg-gray-200 w-full z-40">
                <li>
                  <Link to={`/category/사료`}>사료</Link>
                </li>
                <li>
                  <Link to={`/category/간식`}>간식</Link>
                </li>
                <li>
                  <Link to={`/category/의류`}>의류</Link>
                </li>
                <li>d</li>
                <li>e</li>
              </ul>
            </div>
          </ul>
        </div>
        <div className="relative w-full h-[90vh]">
          <img
            src="src\assets\찌비.JPG"
            alt=""
            className=" absolute inset-0 w-full h-full object-cover "
          />
        </div>

        <div className="w-full h-[50vh] flex flex-col justify-start items-center ">
          <h1>Home</h1>
          <p>가장 먼저 보여지는 페이지입니다.</p>
          <div>안녕하세요 {user?.nickname} 님</div>
          <Link to={`/productdetail/1706776956553`}>123123</Link>
          <Link to={`/sellproduct/1706776956553`}>상품 판매 중</Link>
        </div>

        <div className="flex flex-col justify-start">
          <div className="flex">
            <h2>사료</h2>
            <Button size="sm">
              <Link to={`/category/사료`}>더보기</Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            <CarouselContent>
              {sirials.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                >
                  <div className="m-3">
                    <Link to={`/sellproduct/${product.id}`} className="m-1">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-72 h-72"
                      />
                      <p>{product.productName}</p>
                      <p>{product.productPrice}원</p>
                      <p>남은 수량: {product.productQuantity}</p>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex flex-col justify-start">
          <div className="flex">
            <h2>의류</h2>
            <Button size="sm">
              <Link to={`/category/의류`}>더보기</Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            <CarouselContent>
              {clothingProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                >
                  <div className="m-3">
                    <Link to={`/sellproduct/${product.id}`} className="m-1">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-72 h-72"
                      />
                      <p>{product.productName}</p>
                      <p>{product.productPrice}원</p>
                      <p>남은 수량: {product.productQuantity}</p>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex flex-col justify-start">
          <div className="flex">
            <h2>간식</h2>
            <Button size="sm">
              <Link to={`/category/간식`}>더보기</Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            <CarouselContent>
              {snackProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                >
                  <div className="m-3">
                    <Link to={`/sellproduct/${product.id}`} className="m-1">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-72 h-72"
                      />
                      <p>{product.productName}</p>
                      <p>{product.productPrice}원</p>
                      <p>남은 수량: {product.productQuantity}</p>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex flex-col justify-start">
          <div className="flex">
            <h2>장난감</h2>
            <Button size="sm">
              <Link to={`/category/장난감`}>더보기</Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            <CarouselContent>
              {toyProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                >
                  <div className="m-3">
                    <Link to={`/sellproduct/${product.id}`} className="m-1">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-72 h-72"
                      />
                      <p>{product.productName}</p>
                      <p>{product.productPrice}원</p>
                      <p>남은 수량: {product.productQuantity}</p>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </main>
      <footer>
        <div>
          <Button onClick={toggleModal}>장바구니 보기</Button>
          <CartModal isOpen={isModalOpen} toggleModal={toggleModal} />
        </div>
      </footer>
    </>
  );
}
