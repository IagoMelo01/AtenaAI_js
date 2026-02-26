const API_URL = "http://localhost:3333"; // Replace with your actual API URL
const REQUEST_TIMEOUT_MS = 30000;

function trimTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}

function resolveChatUrl() {
  if (typeof API_URL !== "string") {
    return "";
  }

  const normalized = API_URL.trim();
  if (!normalized) {
    return "";
  }

  return `${trimTrailingSlashes(normalized)}/chat`;
}

export const CHAT_URL = resolveChatUrl();

function decodeResponseAsUtf8(buffer) {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder("utf-8").decode(buffer);
  }

  return "";
}

function fixMojibake(text) {
  if (typeof text !== "string") {
    return text;
  }

  // Heuristic fix for common UTF-8/Latin-1 mojibake patterns.
  if (!/[\u00C3\u00C2\uFFFD]/.test(text) || typeof TextDecoder === "undefined") {
    return text;
  }

  try {
    const bytes = Uint8Array.from(text, (char) => char.charCodeAt(0) & 0xff);
    const repaired = new TextDecoder("utf-8").decode(bytes);
    return repaired || text;
  } catch (error) {
    return text;
  }
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const normalized = { ...payload };
  if (typeof normalized.answer === "string") {
    normalized.answer = fixMojibake(normalized.answer);
  }
  if (typeof normalized.message === "string") {
    normalized.message = fixMojibake(normalized.message);
  }
  if (typeof normalized.error === "string") {
    normalized.error = fixMojibake(normalized.error);
  }

  return normalized;
}

/**
 * @typedef {{ role: "user" | "assistant" | "system", content: string }} ChatHistoryItem
 */

/**
 * @typedef {{ answer: string, used_web: boolean, should_web_next: boolean }} ChatResponse
 */

/**
 * @param {{ message: string, history: ChatHistoryItem[], confirm_web?: boolean }} params
 * @returns {Promise<ChatResponse>}
 */
export async function sendChat(params) {
  const message = String(params?.message ?? "").trim();
  const history = Array.isArray(params?.history) ? params.history : [];
  const confirmWeb =
    typeof params?.confirm_web === "boolean" ? params.confirm_web : true;

  if (!message) {
    throw new Error("EMPTY_MESSAGE");
  }

  if (!CHAT_URL) {
    throw new Error("API_URL_MISSING");
  }

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutHandle = controller
    ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
        confirm_web: confirmWeb,
      }),
      signal: controller?.signal,
    });

    let payload = {};
    try {
      const responseBuffer = await response.arrayBuffer();
      const responseText = decodeResponseAsUtf8(responseBuffer);
      payload = responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      payload = {};
    }

    payload = normalizePayload(payload);

    if (!response.ok) {
      const serverMessage =
        payload?.message || payload?.error || `HTTP ${response.status}`;
      throw new Error(String(serverMessage));
    }

    const answer = typeof payload?.answer === "string" ? payload.answer : "";
    if (!answer.trim()) {
      throw new Error("INVALID_RESPONSE");
    }

    return {
      answer,
      used_web: Boolean(payload?.used_web),
      should_web_next: Boolean(payload?.should_web_next),
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("REQUEST_TIMEOUT");
    }

    throw error;
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}
