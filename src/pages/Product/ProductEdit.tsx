import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth, storage } from "@/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { onAuthStateChanged } from "firebase/auth";
import { Product } from "@/interface/product";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import photo from "@/assets/icon-photo.svg";
import ProductHeader from "@/components/Header/ProductHeader";

function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState<number | null>(null);
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productImage, setProductImage] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 파이어베이스는 문서의 id 일반적으로 문자열을 가짐
  if (id === undefined) {
    throw new Error("ID is missing");
  }

  const idNumber = Number(id);

  const [editedProduct, setEditedProduct] = useState<Product>({
    id: idNumber,
    sellerId: sellerId,
    productName: productName,
    productPrice: productPrice,
    productQuantity: productQuantity,
    productDescription: productDescription,
    productCategory: productCategory,
    productImage: [],
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  });

  // 버튼 클릭
  const handlePrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + productImage.length) % productImage.length
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImage.length);
  };

  // Load the product data
  useEffect(() => {
    const loadProductData = async () => {
      const productSnap = await getDoc(doc(db, "products", id));

      if (productSnap.exists()) {
        const productData = productSnap.data() as Product;
        setSellerId(productData.sellerId);
        setProductName(productData.productName);
        setProductPrice(productData.productPrice);
        setProductQuantity(productData.productQuantity);
        setProductDescription(productData.productDescription);
        setProductCategory(productData.productCategory);
        setProductImage(productData.productImage);
        setEditedProduct(productData);
      }

      setIsLoading(false);
    };

    loadProductData();
  }, [id]);

  // ... onSubmit, onChange, handleFileSelect, handleUpload 함수는 그대로 사용 ...

  const handleSaveProduct = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (
      !productName ||
      productPrice === null ||
      productPrice <= 0 ||
      productPrice >= 100000000 ||
      productQuantity === null ||
      productQuantity <= 0 ||
      !productDescription ||
      !productCategory ||
      productImage.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "비어있는 상품 정보를 작성해주세요.",
      });
      return; // 이 부분이 중요합니다. 에러 메시지를 보여준 후 함수를 종료합니다.
    }

    await setEditedProduct((prevProduct) => ({
      ...prevProduct,
      productImage: productImage,
      sellerId: sellerId,
      productName: productName,
      productPrice: productPrice ? productPrice : 0,
      productQuantity: productQuantity ? productQuantity : 0,
      productDescription: productDescription,
      productCategory: productCategory,
      updatedAt: Timestamp.fromDate(new Date()),
    }));

    try {
      await updateDoc(doc(db, "products", id), {
        ...editedProduct,
        createdAt: editedProduct.createdAt.toDate(), //'createdAt' 필드는 'editedProduct'의 'createdAt' 필드를 Date 형으로 변환하여 저장합니다. 이는 원래 작성된 시간을 유지하기 위함입니다.
        updatedAt: serverTimestamp(), // 게시물 수정 시 시간 업데이트
      });
      Swal.fire({
        icon: "success",
        title: "제품 수정 완료",
        text: "제품이 성공적으로 수정되었습니다.",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/productdetail/${id}`);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error: ", error.message);
      }
      Swal.fire({
        icon: "error",
        title: "제품 수정 실패",
        text: "제품 수정 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
      if (error instanceof Error) {
        console.error("Error adding document: ", error.message);
      }
    }
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.preventDefault(); //이벤트 차단
    const name = event.target.getAttribute("name");
    const value = event.target.value;
    let parsedValue: string | number | null;

    if (name === "productPrice" || name === "productQuantity") {
      parsedValue = value ? Number(value) : null;
    } else {
      parsedValue = value;
    }

    if (
      name === "productName" &&
      typeof parsedValue === "string" &&
      parsedValue.length > 20
    ) {
      return; // return값이 20자 이상 입력 못하게 그냥 막아버림
    }

    switch (name) {
      case "productName":
        setProductName(parsedValue as string);
        break;
      case "productDescription":
        setProductDescription(parsedValue as string);
        break;
      case "productCategory":
        setProductCategory(parsedValue as string);
        break;
      case "productPrice":
        setProductPrice(parsedValue as number);
        break;
      case "productQuantity":
        setProductQuantity(parsedValue as number);
        break;
      default:
        break;
    }

    setEditedProduct((prevProduct: Product) => ({
      ...prevProduct,
      [name as string]: parsedValue,
    }));

    console.log(name + ": ", parsedValue);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const files = event.target.files;

    if (files && files.length <= 3) {
      const selectedFiles = Array.from(files);
      try {
        await handleUpload(selectedFiles);
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "이미지 초과",
        text: "3장만 업로드해주세요.",
      });
    }
  };

  const handleUpload = async (files: File[]) => {
    const downloadURLs: string[] = [];
    for (const file of files) {
      if (auth.currentUser) {
        const imageRef = ref(storage, `${auth.currentUser.uid}/${file.name}`);
        try {
          await uploadBytes(imageRef, file);
        } catch (error) {
          console.error("업로드 실패: ", error);
          return;
        }
        let downloadURL;
        try {
          downloadURL = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("URL 가져오기 실패: ", error);
          return;
        }
        downloadURLs.push(downloadURL);
        console.log("downloadURL", downloadURL);
      }
    }
    setProductImage(downloadURLs);
  };

  useEffect(() => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      productImage: productImage,
    }));
    console.log("productImage: ", productImage);
  }, [productImage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showBackspaseButton={true} showEditButton={false} />
      </header>
      <main>
        <form
          className="flex justify-center mt-[70px] "
          style={{ minWidth: "800px" }}
        >
          <section>
            <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
              {productImage[currentImageIndex] ? (
                <img
                  className="object-fill w-full h-full"
                  src={productImage[currentImageIndex]}
                  alt={`Uploaded image ${currentImageIndex + 1}`}
                />
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrevClick}
                className="absolute left-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pr-1 text-white bg-black border-black"
              >
                &lt;
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNextClick}
                className="absolute right-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pl-1 text-white bg-black border-black"
              >
                &gt;
              </Button>

              <div className="absolute bottom-2 right-2   gap-1.5 ">
                <Label htmlFor="picture" className="cursor-pointer">
                  <img src={photo} alt="photo-btn" />
                </Label>
                <Input
                  className="cursor-pointer"
                  id="picture"
                  type="file"
                  onChange={handleFileSelect}
                  multiple
                  accept=".jpg, .jpeg, .png"
                  style={{ display: "none" }} // input 태그를 숨김
                />
              </div>
            </div>

            <Input
              className="border-gray-700 mt-8 hover:none border-b-2"
              type="text"
              name="productName"
              placeholder="상품 이름"
              value={productName}
              onChange={onChange}
            />

            <Input
              className="border-gray-700 mt-3 hover:none border-b-2"
              name="productPrice"
              placeholder="상품 가격"
              type="number"
              value={productPrice || ""}
              onChange={onChange}
            />
            <div>
              <Input
                className="border-gray-700 mt-2 hover:none border-b-2"
                type="number"
                name="productQuantity"
                placeholder="상품 수량"
                value={productQuantity || ""}
                onChange={onChange}
              />
            </div>

            <div>
              <Textarea
                className="border-black mt-3"
                placeholder="상품 설명을 적어주세요."
                name="productDescription"
                value={productDescription}
                onChange={onChange}
              />
            </div>

            {/* <div>
                <Select
                  name="productCategory"
                  value={productCategory}
                  onChange={onChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            <div className="mt-1 relative">
              <select
                name="productCategory"
                value={productCategory}
                onChange={onChange}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="A">카테고리A</option>
                <option value="B">카테고리B</option>
                <option value="C">카테고리C</option>
                <option value="D">카테고리D</option>
                <option value="E">카테고리E</option>
                <option value="F">카테고리F</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12l6-6H4l6 6zm0 1l6 6H4l6-6z" />
                </svg>
              </div>
            </div>
            <div className="flex justify-center">
              <Button className="mt-3" onClick={handleSaveProduct}>
                완료
              </Button>
            </div>
          </section>
        </form>
      </main>
    </>
  );
}

export default ProductEdit;
