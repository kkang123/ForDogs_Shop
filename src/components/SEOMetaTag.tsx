// import { ReactElement } from "react";
// import { Helmet } from "react-helmet-async";

// const SEOMetaTag = (): ReactElement => (
//   <div>
//     <Helmet>
//       <title>For Dogs Shop - 강아지를 위한 최고의 선택</title>
//       <meta
//         name="description"
//         content="여러분의 강아지를 위해 선물을 해주세요."
//       />
//       <meta name="keywords" content="For Dogs, 강아지, Dog, 사료, 간식" />
//       <meta
//         property="og:title"
//         content="For Dogs Shop - 강아지를 위한 최고의 선택"
//       />
//       <meta
//         property="og:description"
//         content="여러분의 강아지를 위해 선물을 해주세요."
//       />
//       <meta
//         property="og:image"
//         content="https://fordogs-shop.vercel.app/찌비.webp"
//       />
//       <meta property="og:url" content="https://fordogs-shop.vercel.app/" />
//       <meta property="og:type" content="website" />
//       <meta property="og:site_name" content="For Dogs Shop" />
//       <meta property="og:locale" content="kr_KR" />
//       <meta property="og:image:width" content="1200" />
//       <meta property="og:image:height" content="630" />
//     </Helmet>
//   </div>
// );

// export default SEOMetaTag;

import { Helmet } from "react-helmet-async";

interface SEOMetaTagProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  imageWidth?: string;
  imageHeight?: string;
}

function SEOMetaTag({
  title,
  description,
  keywords,
  image,
  url,
  type,
  siteName,
  locale,
  imageWidth,
  imageHeight,
}: SEOMetaTagProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
    </Helmet>
  );
}

export default SEOMetaTag;
