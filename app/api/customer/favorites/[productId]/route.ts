import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";

const parseSafeJson = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : null;
};

const requireConfig = () => {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }
  return null;
};

type Params = {
  params: {
    productId: string;
  };
};

export async function POST(request: Request, context: Params) {
  const params = await context.params;
  const configError = requireConfig();
  if (configError) return configError;

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const acceptLanguage = request.headers.get("accept-language") ?? undefined;
  let payload: { variant_id?: number | null } = {};
  try {
    const json = await request.json();
    if (json && typeof json === "object" && "variant_id" in json) {
      payload.variant_id =
        typeof json.variant_id === "number" ? json.variant_id : null;
    }
  } catch {
    // ignore invalid json; treat as empty body
  }

  const upstreamBase = API_BASE_URL!.replace(/\/+$/, "");

  try {
    const upstream = await fetch(`${upstreamBase}/favorites/${params.productId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(acceptLanguage ? { "Accept-Language": acceptLanguage } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await parseSafeJson(upstream);

    if (upstream.status === 401) {
      const res = NextResponse.json(data, { status: 401 });
      res.cookies.delete(TOKEN_COOKIE_NAME);
      return res;
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Favorite add failed", error);
    return NextResponse.json(
      { message: "Failed to add favorite." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request, context: Params) {
  const params = await context.params;
  const configError = requireConfig();
  if (configError) return configError;

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const url = new URL(request.url);
  const variantId = url.searchParams.get("variant_id");
  const query = variantId ? `?variant_id=${encodeURIComponent(variantId)}` : "";
  const acceptLanguage = request.headers.get("accept-language") ?? undefined;
  const upstreamBase = API_BASE_URL!.replace(/\/+$/, "");

  try {
    const upstream = await fetch(
      `${upstreamBase}/favorites/${params.productId}${query}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          ...(acceptLanguage ? { "Accept-Language": acceptLanguage } : {}),
        },
      },
    );

    const data = await parseSafeJson(upstream);

    if (upstream.status === 401) {
      const res = NextResponse.json(data, { status: 401 });
      res.cookies.delete(TOKEN_COOKIE_NAME);
      return res;
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Favorite remove failed", error);
    return NextResponse.json(
      { message: "Failed to remove favorite." },
      { status: 502 },
    );
  }
}
