import { redirect } from "next/navigation";
import { i18n } from "@/i18n-config";

type PageProps = {
  params: Promise<{ id: string; hash: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export default async function EmailVerifyRedirect(props: PageProps) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const defaultLocale = i18n.defaultLocale ?? "id";
  const query = toQueryString(searchParams);

  redirect(
    `/${defaultLocale}/email/verify/${encodeURIComponent(params.id)}/${encodeURIComponent(
      params.hash,
    )}${query}`,
  );
}
