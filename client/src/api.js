const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("wc_token");
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
export const api = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  createPickup: (body) =>
    request("/pickups", { method: "POST", body: JSON.stringify(body) }),
  mine: () => request("/pickups/mine"),
  available: () => request("/pickups/available"),
  collector: () => request("/pickups/collector"),
  accept: (id) => request(`/pickups/${id}/accept`, { method: "PATCH" }),
  complete: (id) => request(`/pickups/${id}/complete`, { method: "PATCH" }),
};
