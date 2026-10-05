/** API 클라이언트 (FastAPI /api/v1). */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function token(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('p3d_access');
}

async function req<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string> | undefined) };
  if (!(init.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (auth) {
    const t = token();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail ?? `요청 실패 (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string, display_name: string) =>
    req('/api/v1/auth/register', { method: 'POST', body: JSON.stringify({ email, password, display_name }) }, false),
  login: (email: string, password: string) =>
    req<{ access_token: string; refresh_token: string }>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
  me: () => req('/api/v1/auth/me'),
  listProjects: () => req('/api/v1/projects'),
  getProject: (id: string) => req(`/api/v1/projects/${id}`),
  sharedProject: (slug: string) => req(`/api/v1/projects/shared/${slug}`, {}, false),
  createProject: (data: { title: string; template?: string }) =>
    req('/api/v1/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: Record<string, unknown>) =>
    req(`/api/v1/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  uploadImage: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const t = token();
    const res = await fetch(`${BASE}/api/v1/upload/image`, {
      method: 'POST',
      body: form,
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(d.detail ?? '업로드 실패');
    }
    return res.json();
  },
  createConversion: (image_urls: string[], project_id?: string) =>
    req('/api/v1/conversion', { method: 'POST', body: JSON.stringify({ image_urls, project_id }) }, false),
  conversionStatus: (jobId: string) => req(`/api/v1/conversion/${jobId}`, {}, false),
  regenerate: (jobId: string) => req(`/api/v1/conversion/${jobId}/regenerate`, { method: 'POST' }, false),
  createCheckout: (plan: string) =>
    req('/api/v1/subscription/checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
  confirmCheckout: (sessionId: string) =>
    req(`/api/v1/subscription/checkout/${sessionId}/confirm`, { method: 'POST' }),
};

export const API_BASE = BASE;

/** 씬에 저장된 모델 URL(상대경로)을 절대 URL로 변환. */
export function resolveModelUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}
