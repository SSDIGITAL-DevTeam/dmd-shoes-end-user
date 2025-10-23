import { redirect } from "next/navigation";
import { i18n } from "@/i18n-config";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

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

export default function ResetPasswordRedirect({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const defaultLocale = i18n.defaultLocale ?? "id";
  const query = toQueryString(searchParams);

  redirect(`/${defaultLocale}/auth/reset-password${query}`);
}
