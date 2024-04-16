import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import {getStorage, deleteObject, ref } from "firebase/storage";

import { useAuth } from "@/contexts/AuthContext";

import { Product } from "@/interface/product";
import { UserType } from "@/interface/user";

import SEOMetaTag from "@/components/SEOMetaTag";

import ProductHeader from "@/components/Header/ProductHeader";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Swal from "sweetalert2";

function ProductDetail() {
  const auth = getAuth();
  const { uid } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storage = getStorage();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const goToProductPage = () => navigate(`/productlist/${uid}`);

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
  }, []);

  useEffect(() => {
    if (user) {
      const userId = user.id;

      const fetchProduct = async () => {
        if (id) {
          const productRef = doc(db, "products", id);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const productData = productSnap.data() as Product;

            if (productData.sellerId === userId) {
              setProduct(productData);
            } else {
              Swal.fire({
                icon: "error",
                title: "접근 권한이 없습니다",
                text: "해당 제품의 판매자만 열람이 가능합니다",
              }).then((result) => {
                if (result.isConfirmed) {
                  goToProductPage();
                }
              });
            }
          }
        }
      };

      fetchProduct();
    }
  }, [id, user]);


  const handleDelete = async () => {
    if (id) {
      const productRef = doc(db, "products", id);
      const productSnapshot = await getDoc(productRef);
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        if (productData && productData.productImage) {
          productData.productImage.forEach(async (imageURL: string) => {
            const imageRef = ref(storage, imageURL);
            try {
              await deleteObject(imageRef);
            } catch (error) {
              console.error("이미지 삭제 실패: ", error);
 
            }
          });
        }
      }
      
      await deleteDoc(productRef);
      Swal.fire({
        icon: "success",
        title: "제품 삭제 완료",
        text: "제품이 성공적으로 삭제되었습니다.",
      }).then((result) => {
        if (result.isConfirmed) {
          goToProductPage();
        }
      });
    }
  };

  const handleEdit = () => {
    navigate(`/productedit/${id}`);
  };

  if (!product) {
    return (
      <div className="flex justify-center mt-10">
        상품을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader
          showBackspaseButton={true}
          showEditButton={true}
          showDeleteButton={true}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <SEOMetaTag
          title="For Dogs - ProductDetail"
          description="판매 상품 상세보기 페이지입니다."
        />
      </header>
      <main style={{ minWidth: "1300px" }}>
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

          <div className="flex flex-col gap-20 text-right w-[600px] ">
            <p className="font-bold text-4xl mt-8">{product.productName}</p>
            <p className="text-3xl mt-3">{product.productPrice}원</p>
            <p className="text-3xl mt-8">
              남은 갯수 : {product.productQuantity}개
            </p>
            <div className="border-b-2"></div>

            <button className="text-2xl text-gray-500 flex justify-end mr-2">
              <Link to={`/category/${product.productCategory}`}>
                #{product.productCategory}
              </Link>
            </button>
          </div>
        </div>

        <div>
          <div className="mx-12 text-4xl">상품 설명</div>
          <p
            className="mx-10 mt-3 border-4 border-LightBlue-500 rounded  overflow-y-auto overflow-x-hidden word-wrap: break-word"
            style={{ height: "8em" }}
          >
            {product.productDescription}
          </p>
        </div>
      </main>
      <footer className="pt-[100px]"></footer>
    </>
  );
}

export default ProductDetail;
