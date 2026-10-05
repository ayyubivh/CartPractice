const BASE_URL = 'https://e-commerce-rnofe-node-js.onrender.com';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? 'GET';
  const url = `${BASE_URL}${path}`;
  const startedAt = Date.now();

  if (__DEV__) {
    console.log(`[API] → ${method} ${url}`);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    if (__DEV__) {
      console.warn(`[API] ✖ ${method} ${url} network error`, err);
    }
    throw err;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (__DEV__) {
      console.warn(`[API] ✖ ${method} ${url} ${res.status} (${Date.now() - startedAt}ms)`, body);
    }
    const details = Array.isArray(body.details)
      ? body.details.map((d: { message: string }) => d.message).join('\n')
      : '';
    throw new Error(details || body.error || `Request failed (${res.status})`);
  }

  const data = await res.json();
  if (__DEV__) {
    console.log(`[API] ← ${method} ${url} ${res.status} (${Date.now() - startedAt}ms)`, data);
  }
  return data;
}
