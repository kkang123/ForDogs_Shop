import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/interface/product";

import { useAuth } from "@/contexts/AuthContext";

import ProductHeader from "@/components/Header/ProductHeader";
import CartModal from "@/components/modals/cartModal";
import SEOMetaTag from "@/components/SEOMetaTag";

import { Button } from "@/components/ui/button";

function Category() {
  const { isSeller } = useAuth();
  const { productCategory } = useParams<{ productCategory: string }>();

  const [sortType, setSortType] = useState<"updatedAt" | "productPrice">(
    "updatedAt"
  );
  const [currentImageIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const fetchProducts = async ({ pageParam = null }) => {
    const productsRef = collection(db, "products");
    let q = query(
      productsRef,
      where("productCategory", "==", productCategory),
      orderBy(sortType, sortType === "updatedAt" ? "desc" : "asc"),
      limit(3)
    );

    if (pageParam) {
      q = query(q, startAfter(pageParam));
    }

    const querySnapshot = await getDocs(q);
    const qproducts: Product[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as Product;
      qproducts.push(productData);
    });

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { data: qproducts, nextStart: lastDoc };
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
    remove, // 이전 데이터 삭제
    refetch,
  } = useInfiniteQuery("products", fetchProducts, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextStart;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    remove();
    refetch();
  }, [sortType]);

  if (isLoading) {
    return (
      <>
        <header className="h-[78px]">
          <ProductHeader showHomeButton={true} />
        </header>
        <main className="flex justify-center pt-5">
          <div>상품을 불러오는 중입니다.</div>
        </main>
        <footer></footer>
      </>
    );
  }

  if (isError) {
    return <div>Error occurred.</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showHomeButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - Category"
          description="카테고리 페이지입니다.."
        />
      </header>
      <main className="mt-16">
        <div>
          <h1 className="text-4xl px-4">{productCategory}</h1>
          <div className="flex justify-end gap-2 pr-7">
            <Button
              variant={sortType === "updatedAt" ? "default" : "ghost"}
              size={"sm"}
              onClick={() => setSortType("updatedAt")}
            >
              최신순
            </Button>
            <Button
              variant={sortType === "productPrice" ? "default" : "ghost"}
              size={"sm"}
              onClick={() => setSortType("productPrice")}
            >
              가격순
            </Button>
          </div>

          <div className="flex flex-wrap justify-start min-w-[452px] overflow-x-auto">
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((product: Product, index: number) => (
                  <Link
                    key={index}
                    to={`/sellproduct/${product.id}`}
                    className="flex justify-center items-center w-full md:w-1/2 lg:w-1/3 p-4"
                  >
                    <div className=" shadow border-2 rounded w-[380px] h-[380px]">
                      {product.productImage[currentImageIndex] ? (
                        <img
                          className="w-full h-[300px] rounded "
                          src={product.productImage[currentImageIndex]}
                          alt={`Uploaded image ${currentImageIndex + 1}`}
                        />
                      ) : null}
                      <div className="m-1">
                        <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
                          {product.productName}
                        </div>
                        <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
                          {product.productPrice}원
                        </div>
                        <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
                          남은 수량 : {product.productQuantity}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </React.Fragment>
            ))}
            <div ref={ref}></div>
          </div>
          {hasNextPage && (
            <button onClick={() => fetchNextPage()}>다음 페이지</button>
          )}
        </div>
        {isFetchingNextPage && <div>Loading more...</div>}
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
    </>
  );
}

export default Category;
