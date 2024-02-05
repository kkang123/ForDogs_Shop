import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "@/interface/product";
import { UserType } from "@/interface/user";

import ProductHeader from "@/components/Header/ProductHeader";

import { Button } from "@/components/ui/button";
import leftbtn from "@/assets/left-arrow.svg";
import rightbtn from "@/assets/right-arrow.svg";

import Swal from "sweetalert2";

function SellProductDetail() {
  const auth = getAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 이미지 인덱스 상태 추가
  const [user, setUser] = useState<UserType | null>(null);
  const [count, setCount] = useState<number>(0);

  // const goToProductPage = () => navigate("/productlist");
  const goToProductPage = () => navigate("/");

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

  // 버튼 클릭 핸들러 함수 추가
  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleNextClick = () => {
    if (product && product.productImage) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < product.productImage.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
  };

  if (!product) {
    return <div>상품을 불러오는 중...</div>;
  }

  return (
    <>
      <header className="h-[78px]">
        <ProductHeader showPageBackSpaceButton={true} />
      </header>
      <main style={{ minWidth: "1300px" }} className="center">
        <div className="flex  w-full gap-4 pt-[70px] pb-[80px] justify-center">
          <div className="flex flex-col">
            {product.productImage[currentImageIndex] ? (
              <img
                className="w-[600px] h-[600px]"
                src={product.productImage[currentImageIndex]}
                alt={`Uploaded image ${currentImageIndex + 1}`}
              />
            ) : null}
            <div className="flex justify-between">
              <button
                onClick={handlePrevClick}
                className="mt-2 w-16 ml-2 hover:bg-LightBlue-500 hover:border-[color] bg-white  rounded-full flex justify-center"
              >
                <img
                  src={leftbtn}
                  alt="left-btn"
                  className=" w-10    rounded-full"
                />
              </button>
              <button
                onClick={handleNextClick}
                className="mt-2 w-16 mr-2 hover:bg-LightBlue-500 hover:border-[color] bg-white  rounded-full flex justify-center"
              >
                <img
                  src={rightbtn}
                  alt="right-btn"
                  className=" w-10   rounded-full"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-12 text-right w-[600px]">
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
              {/* "count" 값이 0보다 클 때만 "-" 버튼이 작동하도록 했습니다. */}
              {/* "-" 버튼을 누르면 count가 1 감소합니다. */}
              <div className=" border-2 w-5">{count}</div>
              <button
                className=" "
                onClick={() => count < 30 && setCount(count + 1)}
              >
                +
              </button>
              {/* "+" 버튼을 누르면 count가 1 증가합니다. */}
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
                #{product.productCategory}
              </button>

              <div className="flex justify-around ml-4 mt-1">
                <Button
                  size={"customsize"}
                  className="hover:bg-LightBlue-500 text-white bg-LightBlue-200 text-2xl"
                >
                  장바구니
                </Button>
                <Button
                  size={"customsize"}
                  className="hover:bg-LightBlue-500 text-white bg-LightBlue-200 text-2xl"
                >
                  구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-36 text-4xl">상품 설명</div>
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

export default SellProductDetail;