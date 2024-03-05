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
