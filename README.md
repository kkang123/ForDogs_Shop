# 🐶 For Dogs

![main imag](https://github.com/kkang123/ForDogs_Shop/assets/85389685/e91633ca-32c7-4198-b05b-686fbbda598e)

배포 URL : https://fordogs-shop.vercel.app/

```
테스트 계정

- 구매자 계정
ID : buyer001@gmail.com
PW : wlgjsdl987!!@@

- 판매자 계정
ID : seller001@gmail.com
PW : wlgjsdl987!!@@
```

## 📅 프로젝트 기간

✨ 2024.01.24 ~ 2024.02.22 기능 구현 <br>
♻️ 2024.02.23 ~ 24.04.16 리팩토링
♻️ 24.04.16 이후 파이어베이스 기능을 제거 후 백엔드 api 추가 계획

| 1주차              | 2주차        | 3주차            | 4주차              |
| ------------------ | ------------ | ---------------- | ------------------ |
| 페이지 라우팅 설계 | 상품 CRUD    | 상품 판매 페이지 | Lazy Loding        |
| Firebase연동       | 장바구니CRUD | 구매자 기능      | 이미지 변환(.webp) |
| 로그인/회원가입    |              | 판매자 기능      | 번들 사이즈 줄이기 |
|                    |              |                  | SEO 개선           |

## 🔨 사용 기술

<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=FFFFFF"/><img src="https://img.shields.io/badge/TypeScript-orange?style=flat&logo=TypeScript&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/TailWind CSS-06B6D4?style=flat&logo=TailWind css&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/React-Query-ffffff?style=flat&logo=React-Query&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/React-Router-000000?style=flat&logo=React-Router&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/vite-9400D3?style=flat&logo=vite&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/firebase-0000FF?style=flat&logo=firebase&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/vercel-000000?style=flat&logo=vercel&logoColor=ffffff"/>

### 아키텍처

![architecture](https://github.com/kkang123/ForDogs_Shop/assets/85389685/b4ca4f5b-6b57-44bd-99f5-7811c82467e5)

<details>
  <summary>기술적 의사 결정</summary>
<ul>
    <li>React</li>
    사용자 경험을 중시하는 동적 웹 애플리케이션 개발을 위해 선택. 컴포넌트 기반 접근으로 재사용 가능하고 유지보수가 쉬운 UI를 구성하고 개발 효율성을 높이고 가상 DOM을 이용해 실제 DOM의 수정을 최소화하여 애플리케이션의 성능을 향상시키고, 사용자 경험을 개선하기 위해 선택했습니다.</br></br>
    <li>TypeScript</li> 프로젝트의 확장성과 유지보수성을 고려하여, 정적 타입 지정을 통한 오류 감소와 개발 생산성 향상을 위해 사용했습니다. </br></br>
    <li>Vite</li>
    빠른 개발 서버 시작과 HMR(핫 모듈 교체) 기능을 제공하여 개발 속도와 경험을 향상시키기 위해 선택했습니다. </br></br>
    <li>React Context API</li>
    별도의 라이브러리 없이 react 내에서 전역 상태를 관리할 수 있으며 props drilling의 필요성을 줄일 수 있고 소규모~중간 규모 프로젝트에 알맞지만 대규모 프로젝트로 넘어갈 때 리덕스와 결합하여 사용할 수 있기 때문에 선택했습니다. </br></br>
    <li>React Query</li>
    비동기 데이터와 서버 상태를 관리를 위해 사용했으며 이를 통해 서버 상태 관리를 효율적으로 수행하고, 데이터 캐싱, 동기화 및 업데이트 작업을 간소화하기 위해 도입했습니다. </br></br>
    <li>Tailwind CSS</li>
   디자인의 일관성을 유지하여 재활용성을 높였고, 커스텀 디자인 작업 시간을 단축하기 위해 적용했습니다. </br></br>
    <li>Shadcn/ui</li>
    개발과정 중 직접적인 커스터마이제이션, 의존성 최소화, 빠른 통합 및 사용의 이점을 제공하여, 프로젝트의 유연성을 향상시키고 개발 속도를 높이는 장점이 있어 선택 </br></br>
    <li>Firebase</li>
    백엔드 인프라 구축 없이 인증, 데이터베이스, 스토리지, 로그인 기능, 호스팅 등의 기능 사용과 각종 데이터를 DB를 통해 쉽게 관리하기 위해 선택했습니다. </br></br>
    <li>Vercel</li>
    간단하고 빠른 배포와 CDN을 통한 최적화된 성능, 자동 HTTPS 적용, 최신 웹 기술에 대한 강력한 지원, 개발자 친화적인 피드백과 분석 도구를 제공 받을 수 있어 사용했습니다. </br></br>
</ul>
</details>

## ✨ 구현 기능 및 시연

- Firebase Authentication을 사용하여 회원가입 / 로그인 페이지(구매자, 판매자 구분), 로그아웃
- 판매자 전용 페이지, 구매자 전용 페이지 분리

- 로그인 / 로그아웃 <br>
  ![로그인로그아웃](https://github.com/kkang123/ForDogs_Shop/assets/85389685/35aaa22f-a34f-40d6-9fe7-3ae293fbc7b4)

- 회원가입 <br>

  ![회원가입](https://github.com/kkang123/ForDogs_Shop/assets/85389685/8b871483-7ecb-4cb5-a35e-55fb42586ef9)

- 홈 / 판매 상품 상세보기 <br>
  ![홈상품상세보기](https://github.com/kkang123/ForDogs_Shop/assets/85389685/7b401b0b-6ac6-4c4e-9d56-f5d7c93cd6da)

- 카테고리별 상품 목록 / 정렬 <br>
  ![카테고리](https://github.com/kkang123/ForDogs_Shop/assets/85389685/26a319b9-de87-4e36-956e-0f9ce6322d71)

- (구매자) 장바구니 추가 <br>
  ![장바구니 추가](https://github.com/kkang123/ForDogs_Shop/assets/85389685/5b7b9b10-229c-400f-9e95-c19142326f95)

- (구매자) 장바구니 수정 및 삭제 <br>
  ![장바구니 수정 삭제](https://github.com/kkang123/ForDogs_Shop/assets/85389685/43474fb5-a4d4-4cb3-9c77-6f45b0e64bea)

- (구매자) 상품 결제 및 주문 취소 <br>
  ![결제 기능](https://github.com/kkang123/ForDogs_Shop/assets/85389685/6992c3b4-b950-4e63-93fa-14a213fd6dd8)

  ![주문 취소](https://github.com/kkang123/ForDogs_Shop/assets/85389685/5ab14ef6-e812-4287-ad22-05473beeda37)

- (판매자)상품 등록 및 수정, 삭제 <br>
  ![상품등록](https://github.com/kkang123/ForDogs_Shop/assets/85389685/32c84dd7-dcd7-4eee-a9cd-d3ca05f623a3)

  ![상품 수정 및 삭제](https://github.com/kkang123/ForDogs_Shop/assets/85389685/1b54b590-1b94-4991-a5db-dcecbbb9b663)

- (판매자)상품 판매 내역 관리 <br>

  ![판매 상품 관리](https://github.com/kkang123/ForDogs_Shop/assets/85389685/3e07e9f3-e64a-4173-848d-7cfab482bdcd)

## 🔥 트러블 슈팅

<details>
  <summary>무한스크롤</summary>
  <ul>판매 상품 리스트 관리 부분에 무한스크롤을 구현 중 많은 어려움을 느꼈습니다. 스크롤에 따른 무한 스크롤을 구현 할려고 했지만 어떻게든 접근법을 찾아내어 React-query에 있는 useInfiniteQuery를 사용해서 내부적으로 데이터를 상태로 관리해주었고 쿼리 함수를 통해 비동기적으로 데이터를 불러왔습니다. 그리고 데이터를 불러오는 액션은 useInView 훅을 사용하여 최하단에 요소를 추가해줘서 사용자의 스크롤이 페이지 맨 아래에 도달하면 요소가 뷰포트 내에 도달했음을 감지하여 데이터를 추가적으로 불러오는 기능을 적용해주었습니다. 하지만 같은 내용의 데이터를 계속해서 반복해서 불러오는 오류가 발생하였습니다. 그 부분에 대해서 반환값도 변경해보고 콜백함수 값도 계속해서 수정해줬지만 오류가 발생하다가 기본 쿼리에 params값이 있으면 q에 옵션을 추가해주겠다는 문법을 추가한 후 let을 통해 재할당을 해주어 해당 데이터 무한 중복을 해결했습니다</ul>
  </details>

  <details>
    <summary>장바구니 상품 갯수 수정 오류</summary>
    <ul>장바구니에서 상품의 갯수를 수정 했을 때 변경이 없는 상품이 초기화되는 오류 발생. 기존 Cart.tsx에 있는 saveChanges 함수에서 모든 상품의 수량을 업데이트할 때, 변경 사항이 있는 상품의 수량 정보만 고려햐고 변경되지 않는 상품의 수량 정보는 고려하지 않았기 때문에 발생한 문제임을 확인하였습니다. 해결 방안으로 모든 상품에 대한 수량을 업데이트 할 때, quantities 상태에 해당 상품의 수량 정보가 없다면 기존의 수량 정보를 유지하도록하고 수정이되었다면 quantities 상태를 가져오도록 하였습니다.
  
  `quantity: newQuantity !== undefined ? newQuantity : item.quantity`
  
  </ul>

  </details>

## 📦 폴더 구조

```
🐶COMMERCE
├─ 📦 public
│  ├─ ⭐favicon.ico
│  ├─ 📄 robots.txt
│  ├─ 📄 sitemap.xml
│  ├─ 🖼 main-log.svg
│  └─ 🖼 찌비.webp
├─ 📦 src
│  ├─ 📂 api
│  ├─ 📂 assets
│  ├─ 📂 components
│  │  ├─ 📂 Header
│  │  ├─ 📂 modals
│  │  └─ 📂 ui
│  ├─ 📂 contexts
│  ├─ 📂 interface
│  ├─ 📂 lib
│  ├─ 📂 pages
│  │  ├─ 📂 Cart
│  │  ├─ 📂 Category
│  │  ├─ 📂 home
│  │  ├─ 📂 Login
│  │  ├─ 📂 Product
│  │  ├─ 📂 Profile
│  │  └─ 📂 SignUp
│  ├─ 📂 routes
│  ├─ 📂 services
│  ├─ 📄 App.css
│  ├─ 📄 App.tsx
│  ├─ 📄 firebase.ts
│  ├─ 📄 index.css
│  ├─ 📄 main.css
│  └─ 📄 vite-env.d.ts
├─ 📄 .gitignore
├─ 📄 components.json
├─ 📄 index.html
├─ 📄 packge.json
├─ 📄 README.md
├─ 📄 sitemap.js
├─ 📄 vercel.json
└─ 📄 vite.config.ts
```
