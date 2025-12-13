// src/constants/metadata.ts (DMD)

const metadataBase = new URL("https://www.dmdshoeparts.com");

// ➜ SESUAIKAN PATH GAMBAR OG / FAVICON DI BAWAH INI
const defaultImage = `${metadataBase}assets/images/logo-dmd.png`;
const defaultOgImage = `${metadataBase}assets/images/og-dmd-default.png`;
const defaultAuthor = "DMD ShoeParts";

export type MetadataType = keyof typeof pageMetadata;
export type PageMetadataProps = (typeof pageMetadata)[MetadataType];
export type DefaultMetadataProps = typeof defaultMetadata;

export type MetadataProps = PageMetadataProps & DefaultMetadataProps;

export const defaultMetadata = {
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [{ name: defaultAuthor, url: metadataBase.toString() }],
  creator: defaultAuthor,
  publisher: defaultAuthor,
  
  icons: {
    icon: defaultImage,
    shortcut: defaultImage,
    apple: defaultImage,
    other: [
      {
        rel: defaultImage,
        url: defaultImage,
        color: "#5bbad5",
      },
    ],
  },

  applicationName: defaultAuthor,
  generator: "Next.js",
};

export const pageMetadata = {
  home: {
    metadataBase,
    title: "DMD ShoeParts | Produsen Komponen & Sparepart Sepatu",
    description:
      "DMD ShoeParts adalah produsen komponen dan sparepart sepatu berkualitas untuk pabrik, workshop, dan pelaku usaha sepatu di seluruh Indonesia.",
    keywords: [
      "komponen sepatu",
      "sparepart sepatu",
      "pabrik sepatu",
      "produsen aksesoris sepatu",
      "bahan sepatu grosir",
    ],

    openGraph: {
      title: "DMD ShoeParts | Produsen Komponen & Sparepart Sepatu",
      description:
        "Dapatkan berbagai komponen dan sparepart sepatu berkualitas dari DMD ShoeParts untuk mendukung produksi sepatu Anda.",
      url: metadataBase.toString(),
      siteName: defaultAuthor,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "DMD ShoeParts",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: metadataBase.toString(),
    },

    twitter: {
      card: "summary_large_image",
      title: "DMD ShoeParts | Produsen Komponen & Sparepart Sepatu",
      description:
        "Dapatkan berbagai komponen dan sparepart sepatu berkualitas dari DMD ShoeParts untuk mendukung produksi sepatu Anda.",
      site: metadataBase.toString(),
      creator: defaultAuthor,
      images: [{ url: defaultOgImage, alt: "DMD ShoeParts" }],
    },
  },

  product: {
    metadataBase,
    title: "Katalog Produk | Komponen & Sparepart Sepatu DMD ShoeParts",
    description:
      "Jelajahi katalog produk DMD ShoeParts: sol, insole, outsole, aksesori, dan berbagai komponen sepatu lainnya untuk kebutuhan produksi Anda.",
    keywords: [
      "katalog komponen sepatu",
      "katalog sparepart sepatu",
      "sol sepatu",
      "outsole sepatu",
      "bahan sepatu",
    ],

    openGraph: {
      title: "Katalog Produk | Komponen & Sparepart Sepatu DMD ShoeParts",
      description:
        "Lihat daftar lengkap komponen dan sparepart sepatu dari DMD ShoeParts untuk pabrik dan pengrajin sepatu.",
      url: `${metadataBase}/product`,
      siteName: defaultAuthor,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "DMD ShoeParts - Katalog Produk",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: `${metadataBase}/product`,
    },

    twitter: {
      card: "summary_large_image",
      title: "Katalog Produk | Komponen & Sparepart Sepatu DMD ShoeParts",
      description:
        "Lihat daftar lengkap komponen dan sparepart sepatu dari DMD ShoeParts untuk pabrik dan pengrajin sepatu.",
      site: `${metadataBase}/product`.toString(),
      creator: defaultAuthor,
      images: [{ url: defaultOgImage, alt: "DMD ShoeParts - Katalog Produk" }],
    },
  },

  article: {
    metadataBase,
    title: "Artikel & Insight | Tips Produksi Sepatu dari DMD ShoeParts",
    description:
      "Baca artikel seputar produksi sepatu, tips perawatan, pemilihan komponen, dan insight industri sepatu dari DMD ShoeParts.",
    keywords: [
      "artikel sepatu",
      "tips produksi sepatu",
      "industri sepatu",
      "perawatan sepatu",
      "blog DMD ShoeParts",
    ],

    openGraph: {
      title: "Artikel & Insight | Tips Produksi Sepatu dari DMD ShoeParts",
      description:
        "Ikuti update artikel terbaru seputar dunia sepatu, bahan, dan proses produksi dari DMD ShoeParts.",
      url: `${metadataBase}/article`,
      siteName: defaultAuthor,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "DMD ShoeParts - Artikel & Insight",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: `${metadataBase}/article`,
    },

    twitter: {
      card: "summary_large_image",
      title: "Artikel & Insight | Tips Produksi Sepatu dari DMD ShoeParts",
      description:
        "Ikuti update artikel terbaru seputar dunia sepatu, bahan, dan proses produksi dari DMD ShoeParts.",
      site: `${metadataBase}/article`.toString(),
      creator: defaultAuthor,
      images: [
        { url: defaultOgImage, alt: "DMD ShoeParts - Artikel & Insight" },
      ],
    },
  },

  about: {
    metadataBase,
    title: "Tentang DMD ShoeParts | Mitra Produksi Komponen Sepatu",
    description:
      "DMD ShoeParts adalah mitra produksi komponen sepatu yang berpengalaman, mendukung pabrik dan pengrajin sepatu dengan produk berkualitas.",
    keywords: [
      "tentang DMD ShoeParts",
      "profil perusahaan komponen sepatu",
      "produsen sparepart sepatu",
      "pabrik komponen sepatu",
    ],

    openGraph: {
      title: "Tentang DMD ShoeParts | Mitra Produksi Komponen Sepatu",
      description:
        "Kenali DMD ShoeParts lebih dekat sebagai mitra penyedia komponen dan sparepart sepatu untuk bisnis Anda.",
      url: `${metadataBase}/about`,
      siteName: defaultAuthor,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "DMD ShoeParts - Tentang Kami",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: `${metadataBase}/about`,
    },

    twitter: {
      card: "summary_large_image",
      title: "Tentang DMD ShoeParts | Mitra Produksi Komponen Sepatu",
      description:
        "Kenali DMD ShoeParts lebih dekat sebagai mitra penyedia komponen dan sparepart sepatu untuk bisnis Anda.",
      site: `${metadataBase}/about`.toString(),
      creator: defaultAuthor,
      images: [{ url: defaultOgImage, alt: "DMD ShoeParts - Tentang Kami" }],
    },
  },

  contact: {
    metadataBase,
    title: "Kontak DMD ShoeParts | Konsultasi Kebutuhan Komponen Sepatu",
    description:
      "Hubungi DMD ShoeParts untuk konsultasi kebutuhan komponen dan sparepart sepatu bagi pabrik atau usaha Anda.",
    keywords: [
      "kontak DMD ShoeParts",
      "hubungi DMD",
      "supplier komponen sepatu",
      "konsultasi produksi sepatu",
    ],

    openGraph: {
      title: "Kontak DMD ShoeParts | Konsultasi Kebutuhan Komponen Sepatu",
      description:
        "Diskusikan kebutuhan komponen dan sparepart sepatu Anda bersama tim DMD ShoeParts.",
      url: `${metadataBase}/contact`,
      siteName: defaultAuthor,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "DMD ShoeParts - Kontak",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: `${metadataBase}/contact`,
    },

    twitter: {
      card: "summary_large_image",
      title: "Kontak DMD ShoeParts | Konsultasi Kebutuhan Komponen Sepatu",
      description:
        "Diskusikan kebutuhan komponen dan sparepart sepatu Anda bersama tim DMD ShoeParts.",
      site: `${metadataBase}/contact`.toString(),
      creator: defaultAuthor,
      images: [{ url: defaultOgImage, alt: "DMD ShoeParts - Kontak" }],
    },
  },

  thanks: {
    metadataBase,
    title: "Terima Kasih | DMD ShoeParts Telah Menerima Pesan Anda",
    description:
      "Terima kasih telah menghubungi DMD ShoeParts. Kami telah menerima pesan Anda dan akan segera merespons.",
    keywords: [
      "terima kasih DMD",
      "halaman konfirmasi pesan",
      "form terkirim",
      "pesan berhasil dikirim",
    ],
    icons: {
      icon: defaultImage,
    },

    openGraph: {
      title: "Terima Kasih | DMD ShoeParts Telah Menerima Pesan Anda",
      description:
        "Pesan Anda telah berhasil diterima oleh tim DMD ShoeParts. Kami akan segera menghubungi Anda kembali.",
      url: `${metadataBase}/thanks`,
      siteName: defaultAuthor,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "DMD ShoeParts - Terima Kasih",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: `${metadataBase}/thanks`,
    },

    twitter: {
      card: "summary_large_image",
      title: "Terima Kasih | DMD ShoeParts Telah Menerima Pesan Anda",
      description:
        "Pesan Anda telah berhasil diterima oleh tim DMD ShoeParts. Kami akan segera menghubungi Anda kembali.",
      site: `${metadataBase}/thanks`.toString(),
      creator: defaultAuthor,
      images: [{ url: defaultOgImage, alt: "DMD ShoeParts - Terima Kasih" }],
    },
  },
};
