"use client";

export default function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DMD Shoe Parts",
    "url": "https://www.dmdshoeparts.com",
    "logo": "https://www.dmdshoeparts.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/dmdshoeparts",
      "https://www.facebook.com/dmdshoeparts"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
