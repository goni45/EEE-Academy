/**
 * Safe browser storage wrapper for iframe & restricted security contexts.
 * Prevents SecurityError / DOMException from crashing React when cookies/sessionStorage
 * are partitioned or restricted in preview environments.
 */

const memoryStore = new Map<string, string>();

export function safeGetSession(key: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage?.getItem(key) ?? memoryStore.get(key) ?? null;
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

export function safeSetSession(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  } catch {
    // Storage restricted in iframe, fallback to in-memory store
  }
  memoryStore.set(key, value);
}

export function safeRemoveSession(key: string): void {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Storage restricted in iframe
  }
  memoryStore.delete(key);
}
