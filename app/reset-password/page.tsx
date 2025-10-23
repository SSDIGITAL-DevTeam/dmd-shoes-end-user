import { redirect } from "next/navigation";
import { i18n } from "@/i18n-config";

type SearchParams = Record<string, string | string[] | undefined>;

const toQueryString = (params: SearchParams) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined) search.append(key, item);
      });
    } else {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export default async function ResetPasswordRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = toQueryString(await searchParams);
  const defaultLocale = i18n.defaultLocale ?? "id";

  redirect(`/${defaultLocale}/auth/reset-password${query}`);
}
