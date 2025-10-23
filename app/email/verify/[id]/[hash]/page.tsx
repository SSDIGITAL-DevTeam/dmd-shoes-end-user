import { redirect } from "next/navigation";
import { i18n } from "@/i18n-config";

type Params = {
  params: { id: string; hash: string };
  searchParams: Record<string, string | string[] | undefined>;
};

const toQueryString = (params: Record<string, string | string[] | undefined>) => {
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

export default function EmailVerifyRedirect({ params, searchParams }: Params) {
  const defaultLocale = i18n.defaultLocale ?? "id";
  const query = toQueryString(searchParams);

  redirect(
    `/${defaultLocale}/email/verify/${encodeURIComponent(params.id)}/${encodeURIComponent(
      params.hash,
    )}${query}`,
  );
}
