"use client";

import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    Fragment,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import { FaHeart, FaRegHeart, FaUserAlt, FaRegUser } from "react-icons/fa";

import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import LocaleSwitcherList from "./LocaleSwitcherList";

import { useAuthStore } from "@/store/auth-store";
import { useFavorites } from "@/hooks/useFavorites";

type HeaderDictionary = {
    menu?: {
        home?: string;
        products?: string;
        articles?: string;
        about_us?: string;
        contact_us?: string;
        profile?: string;
    };
    auth?: Partial<Record<"register" | "login" | "account" | "wishlist", string>>;
    /** Judul bagian bahasa untuk mobile sidebar */
    localeTitle?: string; // "Bahasa" / "Language"
};

const MENU_FALLBACK = {
    home: "Home",
    products: "Products",
    articles: "Articles",
    about_us: "About Us",
    contact_us: "Contact",
    profile: "Profile",
};

const AUTH_FALLBACK = {
    register: "Register",
    login: "Log In",
    account: "Account",
    wishlist: "Wishlist",
};

export default function Navbar({
    lang,
    dictionary,
}: {
    lang: string;
    dictionary: HeaderDictionary;
}) {
    const pathname = usePathname() || "/";
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [navH, setNavH] = useState(0);
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const desktopAccountRef = useRef<HTMLDivElement>(null);

    // ukur tinggi navbar untuk spacer & sidebar top
    useEffect(() => {
        if (navRef.current) {
            setNavH(navRef.current.getBoundingClientRect().height || 0);
        }
    }, []);

    // auth & wishlist
    const { token, user, isHydrated, logout } = useAuthStore((s) => ({
        token: s.token,
        user: s.user,
        isHydrated: s.isHydrated,
        logout: s.logout,
    }));
    const isAuthenticated = Boolean(token && user);
    const showGuestView = isHydrated ? !isAuthenticated : true;

    const { favorites } = useFavorites();
    const wishlistCount = favorites.length;

    const authLabels = {
        register: dictionary?.auth?.register ?? AUTH_FALLBACK.register,
        login: dictionary?.auth?.login ?? AUTH_FALLBACK.login,
        account: dictionary?.auth?.account ?? AUTH_FALLBACK.account,
        wishlist: dictionary?.auth?.wishlist ?? AUTH_FALLBACK.wishlist,
    };

    const m = dictionary.menu ?? {};
    const baseMenu = [
        { label: m.home ?? MENU_FALLBACK.home, href: "/" },
        { label: m.products ?? MENU_FALLBACK.products, href: "/product" },
        { label: m.articles ?? MENU_FALLBACK.articles, href: "/article" },
        { label: m.about_us ?? MENU_FALLBACK.about_us, href: "/about" },
        { label: m.contact_us ?? MENU_FALLBACK.contact_us, href: "/contact" },
    ];
    const menu = isAuthenticated
        ? [...baseMenu, { label: m.profile ?? MENU_FALLBACK.profile, href: "/profile" }]
        : baseMenu;

    // current section for active state
    const seg = pathname.split("/").filter(Boolean);
    const current = "/" + (seg[1] ?? "");
    const WishlistIcon = current === "/wishlist" ? FaHeart : FaRegHeart;
    const AccountIcon = current === "/profile" ? FaUserAlt : FaRegUser;

    // close desktop account dropdown when clicking outside
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!desktopAccountRef.current) return;
            if (!desktopAccountRef.current.contains(e.target as Node)) {
                setAccountMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);
    useEffect(() => setAccountMenuOpen(false), [pathname]);

    // auto-close sidebar on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // lock body scroll when sidebar open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleLogout = useCallback(async () => {
        setAccountMenuOpen(false);
        await logout();
        router.push(`/${lang}`);
    }, [logout, lang, router]);

    const languageTitle =
        dictionary?.localeTitle ?? (lang === "id" ? "Bahasa" : "Language");

    return (
        <Fragment>
            {/* NAVBAR */}
            <nav ref={navRef} className="fixed inset-x-0 top-0 z-50 w-full bg-primary">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 md:px-6 py-2.5">
                    {/* MOBILE BAR: burger + logo + wishlist */}
                    <div className="flex w-full items-center justify-between lg:hidden">
                        {/* kiri: burger */}
                        <button
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            aria-controls="mobile-sidebar"
                            onClick={() => setIsOpen((v) => !v)}
                            className="justify-self-start text-white text-3xl h-9 w-9 inline-flex items-center justify-center"
                        >
                            <HiMenu />
                        </button>

                        <div className="justify-self-center">
                            <Logo lang={lang} />
                        </div>

                        {/* kanan: wishlist jika login; kalau tidak, spacer biar tetap center */}
                        {isAuthenticated ? (
                            <Link
                                href={`/${lang}/wishlist`}
                                className="relative justify-self-end inline-flex h-9 w-9 items-center justify-center text-white"
                                aria-label={`${authLabels.wishlist}${wishlistCount ? ` (${wishlistCount})` : ""}`}
                                title={authLabels.wishlist}
                            >
                                <WishlistIcon size={20} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-red-600 px-1.5 text-center text-[11px] font-bold leading-[18px] text-white">
                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            // spacer dengan ukuran tombol supaya logo tetap benar-benar center
                            <span className="justify-self-end h-9 w-9" aria-hidden />
                        )}
                    </div>

                    {/* DESKTOP: logo kiri */}
                    <div className="hidden lg:flex items-center">
                        <Logo lang={lang} />
                    </div>

                    {/* DESKTOP: menu tengah */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div className="flex items-center gap-6">
                            {menu.map((it) => {
                                const active = current === it.href;
                                return (
                                    <Link
                                        key={it.href}
                                        href={`/${lang}${it.href}`}
                                        aria-current={active ? "page" : undefined}
                                        className={`text-[15px] font-medium transition-colors ${active ? "text-white" : "text-white/70 hover:text-white"
                                            }`}
                                    >
                                        {it.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* DESKTOP: kanan (locale + wishlist + account) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <LocaleSwitcher />

                        {isAuthenticated && (
                            <Link
                                href={`/${lang}/wishlist`}
                                className="relative inline-flex h-9 w-9 items-center justify-center text-white hover:opacity-90"
                                aria-label={`${authLabels.wishlist}${wishlistCount ? ` (${wishlistCount})` : ""}`}
                                title={authLabels.wishlist}
                            >
                                <WishlistIcon size={20} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-red-600 px-1.5 text-center text-[11px] font-bold leading-[18px] text-white">
                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        {showGuestView ? (
                            <>
                                <Link
                                    href={`/${lang}/auth/register`}
                                    className="rounded border border-white px-4 py-2 text-sm md:text-[15px] font-medium text-white transition hover:bg-white/10"
                                >
                                    {authLabels.register}
                                </Link>
                                <Link
                                    href={`/${lang}/auth/login`}
                                    className="rounded bg-white px-4 py-2 text-sm md:text-[15px] font-semibold text-primary transition hover:bg-white/90"
                                >
                                    {authLabels.login}
                                </Link>
                            </>
                        ) : (
                            <div ref={desktopAccountRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setAccountMenuOpen((s) => !s)}
                                    aria-label={authLabels.account}
                                    aria-expanded={isAccountMenuOpen}
                                    className="inline-flex h-9 w-9 items-center justify-center text-white hover:opacity-90"
                                    title={authLabels.account}
                                >
                                    <AccountIcon size={20} />
                                </button>
                                {isAccountMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-44 rounded-md bg-white text-sm text-gray-700 shadow-lg ring-1 ring-black/5">
                                        <Link
                                            href={`/${lang}/profile`}
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setAccountMenuOpen(false)}
                                        >
                                            {m.profile ?? MENU_FALLBACK.profile}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* spacer agar konten tidak tertutup navbar */}
            <div style={{ height: navH }} />

            {/* overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* MOBILE SIDEBAR */}
            <aside
                id="mobile-sidebar"
                className={`fixed left-0 z-50 w-full max-w-[260px] transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ top: navH, height: `calc(100% - ${navH}px)` }}
            >
                <div className="flex h-full flex-col overflow-y-auto pb-6">
                    <nav className="flex-1">
                        {menu.map((it) => {
                            const active = current === it.href;
                            return (
                                <Link
                                    key={it.href}
                                    href={`/${lang}${it.href}`}
                                    onClick={() => setIsOpen(false)}
                                    aria-current={active ? "page" : undefined}
                                    className={`block px-[24px] py-[22px] text-[16px] font-medium ${active ? "text-primary" : "text-primary hover:text-primary/80"
                                        }`}
                                >
                                    {it.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth area (mobile) */}
                    <div className="mt-4 px-[24px]">
                        {showGuestView ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/${lang}/auth/register`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 text-[16px] font-medium text-primary border border-primary text-center"
                                >
                                    {authLabels.register}
                                </Link>
                                <Link
                                    href={`/${lang}/auth/login`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 text-[16px] font-medium bg-primary text-white text-center"
                                >
                                    {authLabels.login}
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {/* Profile link sudah ada di menu atas */}
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsOpen(false);
                                        await handleLogout();
                                    }}
                                    className="w-full rounded bg-red-600 px-4 py-3 text-[16px] font-semibold text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Language section + list */}
                    <div className="mt-6 border-t border-t-black/10 px-[24px]">
                        <div className="py-3 text-sm font-semibold text-neutral-900">
                            {languageTitle}
                        </div>
                        {/* judul list bisa dihandle komponen kalau mau; di sini tanpa judul */}
                        <LocaleSwitcherList uiLocale={lang as any} withTitle={false} />
                    </div>
                </div>
            </aside>
        </Fragment>
    );
}
