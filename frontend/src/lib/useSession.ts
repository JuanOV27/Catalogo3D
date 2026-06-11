import { useCallback, useEffect, useState } from "react";
import type { LoginResponse } from "../types/models";
import { SESSION_EVENT, clearSession, getSession, setSession } from "./session";

export function useSession() {
  const [session, setSessionState] = useState<LoginResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setReady(true);

    const onChange = () => setSessionState(getSession());
    window.addEventListener(SESSION_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(SESSION_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const login = useCallback((data: LoginResponse) => {
    setSession(data);
    setSessionState(data);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  return { session, ready, login, logout };
}
