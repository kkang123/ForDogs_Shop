// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useInfiniteQuery } from "react-query";
// import { useInView } from "react-intersection-observer";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   limit,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "@/firebase";
// import { Product } from "@/interface/product";
// import ProductHeader from "@/components/Header/ProductHeader";

// function ProductList() {
//   const { uid } = useParams<{ uid: string }>();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const fetchProducts = async () => {
//     const productsRef = collection(db, "products");
//     const q = query(
//       productsRef,
//       where("sellerId", "==", uid),
//       orderBy("updatedAt", "desc"),
//       limit(9)
//     );

//     const querySnapshot = await getDocs(q);
//     const products: Product[] = [];
//     querySnapshot.forEach((doc) => {
//       const productData = doc.data() as Product;
//       products.push(productData);
//     });

//     const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

//     if (!lastDoc) {
//       return { data: products, nextStart: undefined };
//     }

//     const lastDocRef = doc(db, "products", lastDoc.id);
//     const lastDocData = await getDoc(lastDocRef);

//     return {
//       data: products,
//       nextStart: lastDocData.exists ? lastDocData : undefined,
//     };
//   };

//   const {
//     data,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     isError,
//     error,
//     isLoading,
//   } = useInfiniteQuery("products", fetchProducts, {
//     getNextPageParam: (lastPage) =>
//       lastPage.nextStart ? lastPage.nextStart : undefined,
//   });

//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     console.error(error);
//     return <div>Error occurred.</div>;
//   }
//   return (
//     <>
//       <header className="h-[78px]">
//         <ProductHeader showHomeButton={true} showUploadButton={true} />
//       </header>
//       <main>
//         <div>
//           <p>현재 페이지의 파라미터는 {uid} 입니다.</p>
//           <div className="flex flex-wrap justify-between">
//             {" "}
//             {data?.pages.map((group, i) => (
//               <React.Fragment key={i}>
//                 {group.data.map((product: Product, index: number) => (
//                   <Link
//                     key={index}
//                     to={`/productdetail/${product.id}`}
//                     className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
//                   >
//                     {" "}
//                     <div className="shadow border-2 rounded h-[380px]  ">
//                       {product.productImage[currentImageIndex] ? (
//                         <img
//                           className="w-full h-[300px] rounded "
//                           src={product.productImage[currentImageIndex]}
//                           alt={`Uploaded image ${currentImageIndex + 1}`}
//                         />
//                       ) : null}
//                       <div className="m-1">
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productName}
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productPrice}원
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
//                           남은 수량 : {product.productQuantity}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </React.Fragment>
//             ))}
//             <div ref={ref}></div>
//           </div>
//         </div>
//         {isFetchingNextPage && <div>Loading more...</div>}
//       </main>
//     </>
//   );
// }

// export default ProductList;

// 2

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useInfiniteQuery } from "react-query";
// import { useInView } from "react-intersection-observer";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   limit,
//   startAfter,
// } from "firebase/firestore";
// import { db } from "@/firebase";
// import { Product } from "@/interface/product";
// import ProductHeader from "@/components/Header/ProductHeader";

// function ProductList() {
//   const { uid } = useParams<{ uid: string }>();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const fetchProducts = async ({ pageParam = null }) => {
//     const productsRef = collection(db, "products");
//     let q = query(
//       productsRef,
//       where("sellerId", "==", uid),
//       orderBy("updatedAt", "desc"),
//       limit(9)
//     );

//     if (pageParam) {
//       q = query(
//         productsRef,
//         where("sellerId", "==", uid),
//         orderBy("updatedAt", "desc"),
//         startAfter(pageParam),
//         limit(9)
//       );
//     }

//     const querySnapshot = await getDocs(q);
//     const products: Product[] = [];
//     querySnapshot.forEach((doc) => {
//       const productData = doc.data() as Product;
//       products.push(productData);
//     });

//     const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

//     return { data: products, nextStart: lastDoc ? lastDoc.id : undefined };
//   };

//   const {
//     data,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     isError,
//     isLoading,
//   } = useInfiniteQuery("products", fetchProducts, {
//     getNextPageParam: (lastPage) => lastPage.nextStart,
//   });

//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error occurred.</div>;
//   }

//   return (
//     <>
//       <header className="h-[78px]">
//         <ProductHeader showHomeButton={true} showUploadButton={true} />
//       </header>
//       <main>
//         <div>
//           <p>현재 페이지의 파라미터는 {uid} 입니다.</p>
//           <div className="flex flex-wrap justify-between">
//             {data?.pages.map((group, i) => (
//               <React.Fragment key={i}>
//                 {group.data.map((product: Product, index: number) => (
//                   <Link
//                     key={index}
//                     to={`/productdetail/${product.id}`}
//                     className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
//                   >
//                     <div className="shadow border-2 rounded h-[380px]">
//                       {product.productImage[currentImageIndex] ? (
//                         <img
//                           className="w-full h-[300px] rounded"
//                           src={product.productImage[currentImageIndex]}
//                           alt={`Uploaded image ${currentImageIndex + 1}`}
//                         />
//                       ) : null}
//                       <div className="m-1">
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productName}
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productPrice}원
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
//                           남은 수량 : {product.productQuantity}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </React.Fragment>
//             ))}
//             <div ref={ref}></div>
//           </div>
//           {hasNextPage && (
//             <button onClick={() => fetchNextPage()}>다음 페이지</button>
//           )}
//         </div>
//         {isFetchingNextPage && <div>Loading more...</div>}
//       </main>
//     </>
//   );
// }

// export default ProductList;

//3

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
import ProductHeader from "@/components/Header/ProductHeader";

function ProductList() {
  const { uid } = useParams<{ uid: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProducts = async ({ pageParam = null }) => {
    const productsRef = collection(db, "products");

    let q;

    if (pageParam) {
      q = query(
        productsRef,
        where("sellerId", "==", uid),
        orderBy("updatedAt", "desc"),
        startAfter(pageParam),
        limit(9)
      );
    } else {
      q = query(
        productsRef,
        where("sellerId", "==", uid),
        orderBy("updatedAt", "desc"),
        limit(9)
      );
    }

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as Product;
      products.push(productData);
    });

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { data: products, nextStart: lastDoc ? lastDoc.id : undefined };
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred.</div>;
  }

  return (
    <>
      <header className="h-[78px]">
        <ProductHeader showHomeButton={true} showUploadButton={true} />
      </header>
      <main className="mt-16">
        <div>
          <p>현재 페이지의 파라미터는 {uid} 입니다.</p>
          <div className="flex flex-wrap justify-between">
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((product: Product, index: number) => (
                  <Link
                    key={index}
                    to={`/productdetail/${product.id}`}
                    className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
                  >
                    <div className="shadow border-2 rounded h-[380px]">
                      {product.productImage[currentImageIndex] ? (
                        <img
                          className="w-full h-[300px] rounded"
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
      </main>
    </>
  );
}

export default ProductList;
