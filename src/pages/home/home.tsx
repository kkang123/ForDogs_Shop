import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { auth, storage } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
} from "firebase/firestore";

import { ref, getDownloadURL } from "firebase/storage";

import { useAuth } from "@/contexts/AuthContext";

import { Product } from "@/interface/product";

import "../../App.css";

import LazyImage from "@/components/LazyImage";

import Header from "@/components/Header/MainHeader";
import CartModal from "@/components/modals/cartModal";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SEOMetaTag from "@/components/SEOMetaTag";

export default function Home() {
  const { isSeller } = useAuth();

  const [sirials, setSirials] = useState<Product[]>([]);
  const [clothingProducts, setClothingProducts] = useState<Product[]>([]);
  const [snackProducts, setSnackProducts] = useState<Product[]>([]);
  const [toyProducts, setToyProducts] = useState<Product[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageNames = ["찌비.webp", "찌비001.webp", "찌비003.webp"];

  useEffect(() => {
    imageNames.forEach((imageName) => {
      const imageRef = ref(storage, `folder/${imageName}`);

      getDownloadURL(imageRef)
        .then((url: string) => {
          setImageURLs((prevURLs: string[]) => [...prevURLs, url]);
        })
        .catch((error: Error) => {
          console.log(error);
        });
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageURLs.length);
    }, 3000); // 3초마다 이미지 변경

    return () => clearInterval(timer);
  }, [imageURLs]);

  console.log(currentImageIndex);
  console.log(setCurrentImageIndex);

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
      <SEOMetaTag
        title="For Dogs Shop - 강아지를 위한 최고의 선택"
        description="여러분의 강아지를 위해 선물을 해주세요."
      />
      <main className="mt-36 w-full">
        <div>
          <ul className="flex space-x-2 justify-around">
            {["사료", "의류", "간식", "장난감", "용품", "영양제"].map(
              (category, index) => (
                <li
                  key={index}
                  className="relative group cursor-pointer transform transition-all duration-200 hover:scale-110"
                >
                  <Link
                    to={`/category/${category}`}
                    className="px-2 py-1 hover:bg-white"
                  >
                    {category}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="relative w-full h-[90vh] overflow-hidden mt-5">
          {imageURLs.map((url, index) => (
            <LazyImage
              key={index}
              src={url}
              alt=""
              className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
                index !== currentImageIndex ? "opacity-0" : "opacity-100"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col justify-start mt-12">
          <div className="flex">
            <h2 className="text-3xl">사료</h2>
            <Button size="sm" className="ml-3">
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
            <h2 className="text-3xl">의류</h2>
            <Button size="sm" className="ml-3">
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
            <h2 className="text-3xl">간식</h2>
            <Button size="sm" className="ml-3">
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
            <h2 className="text-3xl">장난감</h2>
            <Button size="sm" className="ml-3">
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
      <footer></footer>
    </>
  );
}
