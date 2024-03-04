import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

let sitemap = new SitemapStream({
  hostname: "https://fordogs-shop.vercel.app/",
});

// 루트 페이지 정보 추가
sitemap.write({
  url: "/",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 1.0,
});

// 로그인 페이지 정보 추가
sitemap.write({
  url: "/login",
  lastmod: new Date(),
  changefreq: "monthly",
  priority: 0.3,
});

// 카테고리

sitemap.write({
  url: "/category/사료",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 0.8,
});
sitemap.write({
  url: "/category/의류",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 0.8,
});
sitemap.write({
  url: "/category/간식",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 0.8,
});
sitemap.write({
  url: "/category/장난감",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 0.8,
});
sitemap.write({
  url: "/category/용품",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 0.8,
});
sitemap.write({
  url: "/category/영양제",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 0.8,
});

sitemap.end();

streamToPromise(sitemap).then((sitemap) => {
  createWriteStream("public/sitemap.xml").write(sitemap.toString());
});
