"use client";

import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { AiOutlineSearch } from "react-icons/ai";
import { HiArrowNarrowRight } from "react-icons/hi";
import Container from "@/components/ui-custom/Container";
import ArticleList from "./_components/ArticleList";
import ArticlePagination from "./_components/ArticlePagination";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });

export default function ArticlesPage() {
  return (
    <div className={`${inter.variable} font-sans bg-gray-100 min-h-screen`}>
      {/* ===== Toolbar (title + search) ===== */}
      <header className="border-b border-black/5 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <Container className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-[#003663] text-2xl font-semibold leading-tight sm:text-3xl">
              Artikel Terbaru
            </h1>

            {/* Search */}
            <form role="search" className="relative w-full sm:w-[360px]">
              <label htmlFor="article-search" className="sr-only">
                Cari artikel
              </label>
              <AiOutlineSearch
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="article-search"
                type="search"
                inputMode="search"
                placeholder="Cari artikel…"
                className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm leading-none outline-none
                           focus:border-[#003663] focus:ring-2 focus:ring-[#003663]/25"
                aria-label="Cari artikel"
              />
            </form>
          </div>
        </Container>
      </header>

      <main>
        {/* ===== Hero Featured Article ===== */}
        <section aria-labelledby="featured-article" className="relative h-[380px] sm:h-[440px] bg-black">
          <Image
            src="/assets/demo/article/article-header.webp"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />

          <Container className="relative z-10 h-full">
            <div className="flex h-full items-center">
              <div className="max-w-xl rounded-lg bg-white p-6 sm:p-8 shadow-md">
                <p className="mb-2 text-[13px] leading-5 text-gray-500">
                  <time dateTime="2025-07-28">28 Juli 2025</time>
                </p>
                <h2 id="featured-article" className="text-[28px] sm:text-[34px] font-semibold leading-tight text-[#121212] mb-4">
                  Jangan Ketinggalan: Tren Sepatu Terpanas Musim Ini
                </h2>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1 font-semibold text-sm sm:text-base text-[#003663] border-b border-[#003663] pb-0.5 transition-opacity hover:opacity-80"
                  aria-label="Baca selengkapnya: Jangan Ketinggalan: Tren Sepatu Terpanas Musim Ini"
                >
                  Baca selengkapnya
                  <HiArrowNarrowRight className="text-[18px]" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== Article List ===== */}
        <section aria-labelledby="all-articles">
          <Container className="py-8 sm:py-10">
            <h2 id="all-articles" className="sr-only">
              Semua artikel
            </h2>
            <ArticleList />
          </Container>
        </section>

        {/* ===== Pagination ===== */}
        <nav aria-label="Navigasi halaman artikel">
          <Container className="pb-12">
            <ArticlePagination />
          </Container>
        </nav>
      </main>
    </div>
  );
}
