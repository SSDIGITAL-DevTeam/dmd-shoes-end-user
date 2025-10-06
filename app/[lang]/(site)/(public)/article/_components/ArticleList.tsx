import React from "react";
import Container from "@/components/ui-custom/Container";
import ArticleItem, { Article } from "./ArticleItem";

const articles: Article[] = [
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image:
        "/assets/demo/article/article-item.webp",
  },
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image:
        "/assets/demo/article/article-item.webp",
  },
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image:
        "/assets/demo/article/article-item.webp",
  },
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image:
        "/assets/demo/article/article-item.webp",
  },
 
 
];

function ArticleList() {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 py-12">
        {articles.map((article, index) => (
          <ArticleItem key={index} article={article} />
        ))}
      </div>
    </Container>
  );
}

export default ArticleList;
