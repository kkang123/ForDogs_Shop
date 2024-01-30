import React, { useState } from "react";

import { auth, storage } from "@/firebase";
import {
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

import ProductHeader from "@/components/Header/ProductHeader";

const productCreate: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    // select된 파일을 여기서 다룸

    // ref로 통해 스토리지에 저장 가능, 유저정보에 따른 파일 저장
    // const imageRef = ref(
    //   storage,
    //   `${auth.currentUser.uid}/${selectedFile.name}`
    // );
    if (selectedFile && auth.currentUser) {
      const imageRef = ref(
        storage,
        `${auth.currentUser.uid}/${selectedFile.name}`
      );

      // selectedFile : 실제 업로드 할 파일
      await uploadBytes(imageRef, selectedFile);

      const downloadURL = await getDownloadURL(imageRef);
      console.log("downloadURL", downloadURL);
    }
  };

  return (
    <>
      <ProductHeader showEditButton={false} />
      <div className="flex-col  mt-48 h-screen  ">
        <h2 className="bg-red-400">파일 업로드 컴포넌트</h2>
        <input
          className="bg-blue-300"
          type="file"
          onChange={handleFileSelect}
        />
        <button onClick={handleUpload}>Upload</button>
        <div>상품 이미지 여러장</div>
        <div>상품 이름</div>
        <div>상품 가격</div>
        <div>남은 상품 수량</div>
        <div>상품 설명</div>
        <div>상품 카테고리</div>
      </div>
    </>
  );
};

export default productCreate;
