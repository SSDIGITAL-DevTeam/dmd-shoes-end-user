import Image from "next/image";
import FormChangePassword from "./_component/FormChangePassword";
import type { Locale } from "@/i18n-config";

type PageProps = {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const pickFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function ResetPasswordPage(props: PageProps) {
  const [{ lang }, search] = await Promise.all([props.params, props.searchParams]);
  const token = pickFirst(search.token);
  const email = pickFirst(search.email);

  return (
    <div className="flex h-screen">
      <div className="relative hidden flex-1 lg:flex">
        <Image
          src="/assets/images/auth/auth.webp"
          alt="DMD Shoeparts"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-[#F5F5F5] p-8 space-y-[40px]">
        <div className="flex space-x-[10px] text-primary">
          <div className="flex items-center gap-2 text-[#003663]">
            <span
              aria-hidden="true"
              className="block h-12 w-12 shrink-0 bg-[#003663]
                [mask-image:url('/assets/logo-dmd-vector.svg')]
                [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]
                [-webkit-mask-image:url('/assets/logo-dmd-vector.svg')]
                [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
            />
            <div className="text-[28px] font-bold leading-[1.1]">
              DMD Shoeparts
              <br />
              Manufacturing
            </div>
          </div>
        </div>
        <div className="mx-6 w-full max-w-md bg-white p-6">
          <FormChangePassword lang={lang} token={token} email={email} />
        </div>
      </div>
    </div>
  );
}
