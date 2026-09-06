export async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export function getContent() {
  return fetchJson("/api/content");
}

export function getClients() {
  return fetchJson("/api/clients");
}
