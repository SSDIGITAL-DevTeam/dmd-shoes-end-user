import { CDN_LOGO_PATH, SITE_ORIGIN, getAbsoluteUrl } from "@/lib/site";

type OrganizationSchemaProps = {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
};

export default function OrganizationSchema({
  name = "DMD Shoe Parts",
  url = SITE_ORIGIN,
  logo = getAbsoluteUrl(CDN_LOGO_PATH),
  sameAs = [
    "https://www.instagram.com/dmdshoeparts",
    "https://www.facebook.com/dmdshoeparts",
  ],
}: OrganizationSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
