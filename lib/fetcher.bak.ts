const DEFAULT_TIMEOUT_MS = 5000;

export async function fetchJson<T>(
    input: string | URL | Request,
    init: RequestInit = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
    label = "fetch"
): Promise<T> {
    const started = Date.now();
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        console.log(`[SSR] ${label} →`, input.toString());
        const res = await fetch(input, {
            ...init,
            signal: controller.signal,
            cache: "no-store",
            next: { revalidate: 0 },
            headers: {
                Accept: "application/json",
                ...(init.headers || {}),
            },
        });

        const ms = Date.now() - started;
        console.log(`[SSR] ${label} done (${res.status}) in ${ms}ms`);

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`[SSR] ${label} failed ${res.status} ${res.statusText} ${text}`);
        }
        return (await res.json()) as T;
    } catch (e) {
        const ms = Date.now() - started;
        console.error(`[SSR] ${label} error after ${ms}ms:`, e);
        throw e;
    } finally {
        clearTimeout(id);
    }
}
