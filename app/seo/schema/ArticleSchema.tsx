interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  lang?: string;
  url?: string;
}

import { getAbsoluteUrl } from "@/lib/site";

export default function ArticleSchema(props: ArticleSchemaProps) {
  const {
    title,
    description,
    slug,
    coverImage,
    publishedAt,
    updatedAt,
    authorName = "DMD Shoes",
    lang = "id",
    url,
  } = props;

  const canonicalUrl =
    url ??
    getAbsoluteUrl(
      slug.startsWith("/")
        ? slug
        : `/${lang.replace(/^\//, "")}/article/${slug.replace(/^\//, "")}`,
    );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: coverImage ? getAbsoluteUrl(coverImage) : undefined,
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
      "@id": canonicalUrl,
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
