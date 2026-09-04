import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { id: string; role: string; name: string; email: string };

export type AuthMode = "login" | "register";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: { name: string; email: string; password: string; role: string }) => Promise<{ ok: boolean; error?: string; mock?: boolean }>;
  logout: () => Promise<void>;
  modal: AuthMode | null;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
};

const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {}, login: async () => ({ ok: false }), register: async () => ({ ok: false }), logout: async () => {}, modal: null, openAuth: () => {}, closeAuth: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<AuthMode | null>(null);

  const refresh = async () => {
    try {
      const r: any = await fetch("/api/auth/me").then((x) => x.json());
      setUser(r.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const login = async (email: string, password: string) => {
    const r: any = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((x) => x.json());
    if (r.ok && r.user) setUser(r.user);
    return r.ok && r.user ? { ok: true } : { ok: false, error: r.error || "login ไม่สำเร็จ" };
  };

  const register = async (input: { name: string; email: string; password: string; role: string }) => {
    const r: any = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }).then((x) => x.json());
    // กันเคส mock เก่าที่ตอบ ok แต่ไม่มี user (setUser(undefined) แล้วพาไป /dashboard ทั้งที่ไม่ได้ login)
    if (r.ok && r.user) {
      setUser(r.user);
      return { ok: true, mock: r.mock };
    }
    return { ok: false, error: r.error || "สมัครไม่สำเร็จ" };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  };

  const openAuth = (mode: AuthMode) => setModal(mode);
  const closeAuth = () => setModal(null);

  return <Ctx.Provider value={{ user, loading, refresh, login, register, logout, modal, openAuth, closeAuth }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
