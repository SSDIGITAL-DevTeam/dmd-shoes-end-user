import "./global.css";
import { assistant, inter, lato, plusJakartaSans, poppins } from "@/config/font";

export const metadata = {
  title: "DMD ShoeParts Manufacturing",
  description: "E-commerce sepatu by DMD",
};

const assetPreconnects = [
  "https://api.dmdshoeparts.com",
  "https://dmdshoeparts.com",
  "https://www.dmdshoeparts.com",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {assetPreconnects.map((href) => (
          <link key={href} rel="preconnect" href={href} crossOrigin="anonymous" />
        ))}
      </head>
      <body
        className={[
          inter.className,
          assistant.variable,
          lato.variable,
          poppins.variable,
          plusJakartaSans.variable,
          "antialiased min-h-screen bg-[var(--surface)] text-[var(--text-primary)]",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
