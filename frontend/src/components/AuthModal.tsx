import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type AuthMode } from "../lib/auth";
import { Field, PasswordField, inputCls } from "./ui";

/* ---------- shared form (modal + fallback pages) ---------- */
export function AuthForm({ mode, onMode, compact = false }: {
  mode: AuthMode; onMode: (m: AuthMode) => void; compact?: boolean;
}) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sme");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setError(""); if (compact) emailRef.current?.focus(); }, [mode]);
  useEffect(() => { if (compact) emailRef.current?.focus(); }, []);

  const submit = async () => {
    setError("");
    if (mode === "register" && password.length < 8) { setError("รหัสผ่านต้อง ≥ 8 ตัว"); return; }
    setBusy(true);
    try {
      const r = mode === "login"
        ? await login(email, password)
        : await register({ name, email, password, role });
      if (r.ok) nav("/dashboard");
      else setError(r.error || "ไม่สำเร็จ ลองอีกครั้ง");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {/* segmented tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1" role="tablist" aria-label="เลือก">
        {(["login", "register"] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => onMode(m)}
            className={`rounded-full py-2 text-sm font-semibold ${mode === m ? "bg-white text-ink shadow" : "text-slate-500 hover:text-ink"}`}>
            {m === "login" ? "เข้าสู่ระบบ" : "สมัครฟรี"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3.5">
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200" role="alert">{error}</p>}
        {mode === "register" && (
          <Field label="ชื่อ / ชื่อบริษัท">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น บริษัท ตัวอย่าง จำกัด"
              autoComplete="name" className={inputCls} />
          </Field>
        )}
        <Field label="อีเมล">
          <input ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            autoComplete="email" placeholder="name@company.co.th" className={inputCls} />
        </Field>
        <Field label="รหัสผ่าน">
          <PasswordField value={password} onChange={setPassword} onEnter={submit} />
        </Field>
        {mode === "register" && (
          <Field label="สมัครในบทบาท">
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
              <option value="sme">SME — หาสำนักงานบัญชี</option>
              <option value="firm">สำนักงานบัญชี — รับงาน + หาทีม</option>
              <option value="talent">ฟรีแลนซ์ — รับงานจาก firm</option>
            </select>
          </Field>
        )}
        <button onClick={submit} disabled={busy}
          className="cta-airlume w-full justify-center disabled:opacity-60">
          {busy ? "กำลังดำเนินการ…" : mode === "login" ? "เข้าสู่ระบบ" : "สมัครเลย"} <span className="cta-arrow" aria-hidden>→</span>
        </button>
        <p className="text-center text-xs text-slate-400">
          {mode === "login" ? "ยังไม่มีบัญชี? กดแท็บสมัครฟรีด้านบน" : "สมัครฟรี 30 วินาที ไม่ต้องใช้บัตรเครดิต"}
        </p>
      </div>
    </div>
  );
}

/* ---------- popup modal (AirLume) ---------- */
export function AuthModal() {
  const { modal, closeAuth } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => { if (modal) setMode(modal); }, [modal]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, closeAuth]);

  // close modal automatically once logged in (form navigates to dashboard)
  const { user } = useAuth();
  useEffect(() => { if (user && modal) closeAuth(); }, [user, modal, closeAuth]);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-sm"
      onClick={closeAuth} role="presentation">
      <div className="w-full max-w-md overflow-hidden rounded-card-lg bg-white shadow-card"
        role="dialog" aria-modal="true" aria-label={mode === "login" ? "เข้าสู่ระบบ" : "สมัครใช้งานฟรี"}
        onClick={(e) => e.stopPropagation()}>
        {/* navy head */}
        <div className="hero-dark hero-bg relative px-6 pb-5 pt-6">
          <button onClick={closeAuth} aria-label="ปิด"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white hover:bg-white/10">
            ✕
          </button>
          <span className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
            ✦ AccOS Pro Marketplace
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            {mode === "login" ? "ยินดีต้อนรับกลับ" : "เริ่มใช้งานฟรี"}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {mode === "login" ? "เข้าสู่ระบบเพื่อจัดการงานและข้อเสนอ" : "หาคนบัญชี verified ได้ใน 1 นาที"}
          </p>
        </div>
        {/* form body */}
        <div className="p-6">
          <AuthForm mode={mode} onMode={setMode} compact />
        </div>
      </div>
    </div>
  );
}
