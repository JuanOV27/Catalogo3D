import type { LoginResponse } from "../types/models";

const SESSION_KEY = "catalogo3d_session";
export const SESSION_EVENT = "catalogo3d_session_change";

export function getSession(): LoginResponse | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function setSession(session: LoginResponse): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(SESSION_EVENT));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_EVENT));
}
