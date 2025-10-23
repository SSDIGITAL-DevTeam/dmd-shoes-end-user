import { Suspense } from "react";
import type { PagePropsP, LangParamsP } from "@/types/next";
import Container from "@/components/ui-custom/Container";
import ProfileForm from "./_component/ProfileForm";
import { getDictionaryProfile } from "../../../../../dictionaries/profile/get-dictionary-profile";

export default async function ProfilePage({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;
  const dictionary = await getDictionaryProfile(lang);

  return (
    <Container className="py-16 space-y-12">
      <h1 className="text-primary font-semibold text-[32px] leading-[140%]">
        {dictionary.title}
      </h1>
      <Suspense fallback={null}>
        <ProfileForm dictionary={dictionary} />
      </Suspense>
    </Container>
  );
}
