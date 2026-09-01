const TOKEN_KEY = "dig_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(url, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    clearToken();
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password }, auth: false }),
  getContent: () => request("/api/content"),
  getSection: (section) => request(`/api/content/${section}`),
  updateSection: (section, value) =>
    request(`/api/content/${section}`, { method: "PUT", body: value }),
  getClients: () => request("/api/clients"),
  createClient: (data) => request("/api/clients", { method: "POST", body: data }),
  updateClient: (id, data) => request(`/api/clients/${id}`, { method: "PUT", body: data }),
  deleteClient: (id) => request(`/api/clients/${id}`, { method: "DELETE" }),
  getTestimonials: () => request("/api/testimonials"),
  createTestimonial: (data) => request("/api/testimonials", { method: "POST", body: data }),
  updateTestimonial: (id, data) =>
    request(`/api/testimonials/${id}`, { method: "PUT", body: data }),
  deleteTestimonial: (id) => request(`/api/testimonials/${id}`, { method: "DELETE" }),
  upload: async (file) => {
    const token = getToken();
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Upload failed");
    }
    return res.json();
  },
};
