import Image from "next/image";
import FormLogin from "./_component/FormLogin";
import { authLoginDict } from "@/dictionaries/auth-login";

export default function LoginPage({ params: { lang } }: { params: { lang: "id" | "en" } }) {
  const t = authLoginDict[lang] ?? authLoginDict.id;

  return (
    <div className="flex h-screen">
      {/* Kolom kiri - Gambar Full */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/assets/images/auth/auth.webp"
          alt="dmd login"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Kolom kanan - Form Login */}
      <div className="flex flex-col flex-1 bg-[#F5F5F5] items-center justify-center p-8 space-y-[40px]">
        <div className="flex text-primary space-x-[10px]">
          <div className="flex items-center text-[#003663] gap-2">
            <span
              aria-hidden="true"
              className="block shrink-0 w-12 h-12 bg-[#003663]
              [mask-image:url('/assets/logo-dmd-vector.svg')]
              [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]
              [-webkit-mask-image:url('/assets/logo-dmd-vector.svg')]
              [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
            />
            <div className="font-bold text-[28px] leading-[1.1]">
              DMD Shoeparts
              <br />
              Manufacturing
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white mx-6 p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">
            {t.title}
          </h1>
          <FormLogin lang={lang} />
        </div>
      </div>
    </div>
  );
}
