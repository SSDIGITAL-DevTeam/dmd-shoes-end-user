"use client";

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}

export default function ArticleSchema(props: ArticleSchemaProps) {
  const {
    title,
    description,
    slug,
    coverImage,
    publishedAt,
    updatedAt,
    authorName = "DMD Shoes",
  } = props;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: coverImage,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "DMD Shoes",
      logo: {
        "@type": "ImageObject",
        url: "https://www.dmdshoeparts.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.dmdshoeparts.com/article/${slug}`,
    },
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
