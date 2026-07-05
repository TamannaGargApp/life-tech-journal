const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(rest.headers as Record<string, string>) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers, credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(res.status, err.detail ?? String(err));
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const AuthAPI = {
  register: (name: string, email: string, password: string) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string): Promise<{ access_token: string }> =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  googleAuth: (id_token: string): Promise<{ access_token: string }> =>
    request("/auth/google", { method: "POST", body: JSON.stringify({ id_token }) }),
  refresh: (): Promise<{ access_token: string }> =>
    request("/auth/refresh", { method: "POST" }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: (token: string) => request("/auth/me", { token }),
  forgotPassword: (email: string) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};

export const ArticleAPI = {
  list: (params: Record<string, string | number | undefined> = {}, token?: string) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]));
    return request(`/articles?${qs}`, { token });
  },
  featured: () => request("/articles/featured"),
  get: (slug: string) => request(`/articles/${slug}`),
  create: (data: object, token: string) =>
    request("/articles", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: object, token: string) =>
    request(`/articles/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    request(`/articles/${id}`, { method: "DELETE", token }),
  like: (id: string, token: string) =>
    request(`/articles/${id}/like`, { method: "POST", token }),
  bookmark: (id: string, token: string) =>
    request(`/articles/${id}/bookmark`, { method: "POST", token }),
  related: (id: string) => request(`/articles/${id}/related`),
};

export const SearchAPI = {
  search: (q: string, page = 1, size = 10) =>
    request(`/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),
  suggestions: (q: string): Promise<{ suggestions: string[] }> =>
    request(`/search/suggestions?q=${encodeURIComponent(q)}`),
  trending: (): Promise<{ trending: string[] }> =>
    request("/search/trending"),
};

export const CommentAPI = {
  list: (articleId: string, page = 1) =>
    request(`/comments?article_id=${articleId}&page=${page}`),
  create: (data: { article_id: string; content: string; parent_id?: string }, token: string) =>
    request("/comments", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, content: string, token: string) =>
    request(`/comments/${id}`, { method: "PUT", body: JSON.stringify({ content }), token }),
  delete: (id: string, token: string) =>
    request(`/comments/${id}`, { method: "DELETE", token }),
};

export const MediaAPI = {
  presign: (filename: string, content_type: string, folder = "uploads", token: string) =>
    request<{ upload_url: string; public_url: string; s3_key: string }>("/media/presign", {
      method: "POST", body: JSON.stringify({ filename, content_type, folder }), token,
    }),
  uploadToS3: async (uploadUrl: string, file: File): Promise<void> => {
    await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  },
  list: (page = 1, token: string) => request(`/media?page=${page}`, { token }),
};

export const NewsletterAPI = {
  subscribe: (email: string, name?: string) =>
    request("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email, name }) }),
  unsubscribe: (token: string) =>
    request(`/newsletter/unsubscribe/${token}`, { method: "POST" }),
};
