import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";

import { Product } from "@/interface/product";
import { UserType } from "@/interface/user";

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
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  // const goToProductPage = () => navigate("/productlist");
  const goToProductPage = () => navigate(`/productlist/${uid}`);

  // 새로고침 시 데이터 유실 방지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // setUser(firebaseUser); // onAuthStateChanged 콜백에서 setUser를 호출하여 사용자 정보를 상태로 저장
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
              // 다른 필드들도 이와 같이 할당하세요.
            });
          }
        }
      } else {
        setUser(null);
      }
      console.log(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // user 상태가 null이 아닐 때만 fetchProduct를 호출
    if (user) {
      const userId = user.id; // 지역 변수에 user.id 저장

      const fetchProduct = async () => {
        console.log(user);

        if (id) {
          const productRef = doc(db, "products", id);
          const productSnap = await getDoc(productRef);
          console.log(user);
          console.log(id);

          if (productSnap.exists()) {
            const productData = productSnap.data() as Product;
            console.log(productData.sellerId);
            console.log(userId); // 지역 변수 사용
            if (productData.sellerId === userId) {
              // 지역 변수 사용
              console.log(productData.sellerId);
              console.log(userId); // 지역 변수 사용
              console.log(user);
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

  // 삭제하기 기능 구현
  const handleDelete = async () => {
    if (id) {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      Swal.fire({
        icon: "success",
        title: "제품 삭제 완료",
        text: "제품이 성공적으로 삭제되었습니다.",
      }).then((result) => {
        // 확인 버튼을 클릭했을 때의 동작
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
    return <div>상품을 불러오는 중...</div>;
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
