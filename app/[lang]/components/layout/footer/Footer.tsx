import Container from '@/components/ui-custom/Container';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ⬅️ pakai Link Next.js
import { getDictionary } from '../../../../../dictionaries/get-dictionary';
import { Cairo, Poppins, Inter } from 'next/font/google';
import { CONTACT, formatWhatsapp } from "@/config/contact";

// Setup font
const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"], // bold
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export default function Footer({ 
  lang, 
  dictionary 
}: { 
  lang: string, 
  dictionary: Awaited<ReturnType<typeof getDictionary>> 
}) {
  const menu = [
    { label: dictionary.menu.home, href: "/" },
    { label: dictionary.menu.products, href: "/product" },
    { label: dictionary.menu.articles, href: "/article" },
    { label: dictionary.menu.about_us, href: "/about" },
    { label: dictionary.menu.faq, href: "/faq" },
  ];

  return (
    <footer className={`${cairo.className} bg-primary text-white z-40`}>
      <Container className="py-6 md:py-8">
        <div className="grid grid-cols-1 gap-8 text-sm leading-relaxed md:grid-cols-4">
          {/* Logo & Slogan */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start">
              <div className="w-[72px]">
                <Image
                  src="/assets/logo-dmd-white.svg"
                  alt="DMD Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <h2 className={`${poppins.className} mt-4 text-[18px] font-semibold leading-[130%] md:text-[20px]`}>
                DMD Shoeparts Manufacturing
              </h2>
            </div>
            <p className={`${inter.className} text-sm leading-[150%] md:text-[15px]`}>
              {dictionary.company.tagline || "Memproduksi komponen alas kaki berkualitas untuk industri sepatu sejak 2004"}
            </p>
          </div>

          {/* Alamat & Jam */}
          <div className="flex flex-col gap-2 text-sm md:text-[15px]">
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold">{dictionary.company.address || "Alamat"}</h2>
                <p>Pengudangan Mutiara Kosambi 2 Blok A6 No. 22, Dadap - Tangerang</p>
              </div>
              
              <div>
                <h2 className="font-semibold">{dictionary.company.operating_hours || "Jam Operasional"}</h2>
                <p>08.00 - 18.00</p>
              </div>
             
            </div>
          </div>

          {/* Kontak */}
          <div className="flex flex-col gap-4 text-sm md:text-[15px]">
            <div className="space-y-4">
              <div>

              <h2 className="font-semibold">Telp / WA</h2>
              <p>
                
                <Link 
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank"
                  className="hover:underline"
                >
                  {/* {CONTACT.whatsapp} */}

                  {formatWhatsapp(CONTACT.whatsapp)}
                </Link>
              </p>
              </div>
            
              <p>
                <span className="font-semibold">Email</span><br/>
                <Link 
                  href={`mailto:${CONTACT.email}`} 
                  className="hover:underline"
                >
                  {CONTACT.email}
                </Link>
              </p>
            </div>
          </div>

          {/* Navigasi */}
          <div className="flex flex-col gap-3 text-sm md:items-start md:text-[15px]">
            <ul className="space-y-2">
              {menu.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis Pembatas dan Hak Cipta */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-sm leading-relaxed md:text-[15px]">
            © 2025 DMD Shoes. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
