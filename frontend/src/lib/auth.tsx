import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { id: string; role: string; name: string; email: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: { name: string; email: string; password: string; role: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {}, login: async () => ({ ok: false }), register: async () => ({ ok: false }), logout: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const r = await fetch("/api/auth/me").then((x) => x.json());
      setUser(r.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((x) => x.json());
    if (r.ok) setUser(r.user);
    return r.ok ? { ok: true } : { ok: false, error: r.error || "login ไม่สำเร็จ" };
  };

  const register = async (input: { name: string; email: string; password: string; role: string }) => {
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }).then((x) => x.json());
    if (r.ok) setUser(r.user);
    return r.ok ? { ok: true } : { ok: false, error: r.error || "สมัครไม่สำเร็จ" };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, refresh, login, register, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
