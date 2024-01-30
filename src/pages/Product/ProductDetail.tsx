import React from "react";

import ProductHeader from "@/components/Header/ProductHeader";

function productDetail() {
  return (
    <>
      <ProductHeader />
      <div className="flex  mt-48 h-screen  ">
        <div className="bg-blue-300 w-1/2 h-[640px] rounded ">상품 이미지</div>
        <div className="flex-col w-1/2 p-12 h-[640px]">
          <div>상품 이름</div>
          <div>상품 가격</div>
          <div>상품 수량</div>
          <div className="flex justify-center">
            <div>상품 장바구니</div>
            <div>상품 구매하기</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default productDetail;
