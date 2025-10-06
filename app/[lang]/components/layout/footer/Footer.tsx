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
    { label: dictionary.menu.products, href: "/produk" },
    { label: dictionary.menu.articles, href: "/article" },
    { label: dictionary.menu.about_us, href: "/about" },
    { label: dictionary.menu.faq, href: "/faq" },
  ];

  return (
    <footer className={`${cairo.className} bg-primary text-white z-40`}>
      <Container className="py-20 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-12 text-[20px] leading-[120%]">
          {/* Logo & Slogan */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start ">
              <div className="w-[87px]">
                <Image
                  src="/assets/logo-dmd-white.svg"
                  alt="DMD Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <h2 className={`${poppins.className} text-[24px] font-bold leading-[120%] mt-[16px]`}>
                DMD Shoeparts Manufacturing
              </h2>
            </div>
            <p className={`${inter.className} text-[16px] leading-[150%]`}>
              {dictionary.company.tagline || "Memproduksi komponen alas kaki berkualitas untuk industri sepatu sejak 2004"}
            </p>
          </div>

          {/* Alamat & Jam */}
          <div className="flex flex-col gap-2">
            <div className="space-y-[27px] font-[20px]">
              <div>
                <h2><b>{dictionary.company.address || "Alamat"}</b></h2>
                <p>
                  
                  Pengudangan Mutiara Kosambi 2 Blok A6 No. 22, Dadap - Tangerang
                </p>
              </div>
              
              <div>
                <h2><b>{dictionary.company.operating_hours || "Jam Operasional"}</b></h2>
            
                <p>
                  
                  08.00 - 18.00
                </p>
              </div>
             
            </div>
          </div>

          {/* Kontak */}
          <div className="flex flex-col gap-4">
            <div className="space-y-[27px] font-[20px]">
              <div>

              <h2><b>Telp / WA</b></h2>
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
                <b>Email</b><br/>
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
          <div className="flex flex-col md:items-start gap-4">
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
        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <p className="text-[16px] leading-[24px]">
            © 2025 DMD Shoes. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
