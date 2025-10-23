/**
 * API helper for Expo (JS).
 * - Base URL: from EXPO_PUBLIC_API_URL, global Expo manifest, or app.json -> expo.extra.apiBaseUrl
 * - JSON fetch with AbortController + timeout
 */

const pickFirstString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const resolveExpoExtra = () => {
  const candidates = [
    globalThis?.expo,
    globalThis?.Expo,
    globalThis?.__expo,
    globalThis?.expoConfig,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const configs = [
      candidate?.expoConfig,
      candidate?.manifest,
      candidate?.manifest2,
      candidate?.router?.manifest,
      candidate,
    ];

    for (const config of configs) {
      const extra = config?.extra;
      const maybeBase = pickFirstString(extra?.apiBaseUrl);
      if (maybeBase) {
        return maybeBase;
      }
    }
  }

  try {
    const appConfig = require("../app.json");
    return pickFirstString(appConfig?.expo?.extra?.apiBaseUrl);
  } catch (error) {
    // When bundling for Expo Go we may not have direct access to app.json.
    return "";
  }
};

const envBase = pickFirstString(
  process.env.EXPO_PUBLIC_API_URL,
  resolveExpoExtra()
);

export const API_BASE_URL = (envBase || "https://atenas.edu.br/Atena").replace(/\/+$/, "");

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * Generic JSON request with timeout.
 * @param {string} path - path starting with "/" (e.g. "/api/login")
 * @param {{ method?: string, headers?: Record<string,string>, body?: any, timeoutMs?: number }} [options]
 * @returns {Promise<any>}
 */
export async function request(path, options = {}) {
  const timeoutMs = options.timeoutMs ?? 20000;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const id = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const url = `${API_BASE_URL}${path}`;
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
      body: options.body != null ? JSON.stringify(options.body) : undefined,
      signal: controller?.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const message =
        (isJson && data && (data.message || data.error)) ||
        (typeof data === "string" ? data : null) ||
        `HTTP ${res.status}`;
      const err = new Error(String(message));
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } finally {
    if (id) clearTimeout(id);
  }
}

/**
 * Login
 * Body: { matricula: string, password: string }
 * Default path: /api/login
 */
export async function login({ matricula, password }) {
  if (!matricula || !password) {
    throw new Error("Informe matrícula e senha.");
  }
  return request("/api/login", {
    method: "POST",
    body: { matricula, password },
  });
}

/**
 * Forgot password
 * Body: { email: string }
 * Default path: /api/forgot-password
 */
export async function forgotPassword({ email }) {
  if (!email) {
    throw new Error("Informe um e-mail válido.");
  }
  return request("/api/forgot-password", {
    method: "POST",
    body: { email },
  });
}

/**
 * Get user by ID (requires Bearer token)
 * Path: /api/user/:id
 */
export async function getUser({ userId, token }) {
  if (userId == null) {
    throw new Error("Usuário inválido.");
  }
  if (!token) {
    throw new Error("Token não informado.");
  }
  return request(`/api/user/${String(userId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Update email for current user (requires Bearer token)
 * Path: /api/user/email
 * Body: { email: string }
 */
export async function updateEmail({ email, token }) {
  if (!email) throw new Error("Informe um e-mail.");
  if (!token) throw new Error("Token não informado.");
  return request("/api/user/email", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: { email },
  });
}
