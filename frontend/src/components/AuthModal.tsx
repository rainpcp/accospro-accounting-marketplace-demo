import { useEffect, useState } from "react";
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

  useEffect(() => { setError(""); }, [mode]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = mode === "login"
    ? emailOk && password.length > 0 && !busy
    : name.trim().length > 0 && emailOk && password.length >= 8 && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setError("");
    setBusy(true);
    try {
      const r = mode === "login"
        ? await login(email.trim(), password)
        : await register({ name: name.trim(), email: email.trim(), password, role });
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
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            autoComplete="email" placeholder="name@company.co.th" className={inputCls} />
        </Field>
        <Field label={mode === "register" ? "รหัสผ่าน (อย่างน้อย 8 ตัว)" : "รหัสผ่าน"}>
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
        <button onClick={submit} disabled={!canSubmit}
          className={canSubmit
            ? "cta-airlume w-full justify-center"
            : "flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-400"}>
          {busy ? "กำลังดำเนินการ…" : mode === "login" ? "เข้าสู่ระบบ" : "สมัครเลย"}
          {canSubmit && <span className="cta-arrow" aria-hidden>→</span>}
        </button>
        <p className="text-center text-xs leading-relaxed text-slate-400">
          เมื่อดำเนินการต่อ แสดงว่าคุณยอมรับ
          <span className="underline">ข้อกำหนดการใช้งาน</span>และ
          <span className="underline">นโยบายความเป็นส่วนตัว</span>ของ AccOS Pro Marketplace
        </p>
      </div>
    </div>
  );
}

/* ---------- right visual panel (AirLume, แทน mascot) ---------- */
function VisualPanel() {
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <div className="hero-dark hero-bg relative hidden flex-col justify-between overflow-hidden p-7 text-white md:flex">
      <div className="hero-pillars absolute inset-0" aria-hidden />
      <div className="relative">
        <span className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
          ✦ AccOS Pro Marketplace
        </span>
        <p className="mt-4 text-2xl font-extrabold leading-snug">
          จ้างบัญชีง่าย<br />
          <span className="text-primary-300">งานเข้าระบบทันที</span>
        </p>
      </div>
      <div className="relative space-y-3">
        <div className="flex items-center gap-3 rounded-card bg-white p-4 text-ink shadow-card">
          <svg width="56" height="56" viewBox="0 0 72 72" role="img" aria-label="แมตช์งานบัญชี 94%">
            <circle cx="36" cy="36" r={R} fill="none" stroke="#E8EBFF" strokeWidth="8" />
            <circle cx="36" cy="36" r={R} fill="none" stroke="#3347FF" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${C * 0.94} ${C}`} transform="rotate(-90 36 36)" />
            <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="800" fill="#12163A">94%</text>
          </svg>
          <div>
            <p className="text-sm font-bold">แมตช์ตรงจังหวัด + งบ</p>
            <p className="text-xs text-slate-500">สแกน 20+ สำนักงานบัญชี</p>
          </div>
        </div>
        <div className="glass-dark flex items-center gap-3 rounded-card p-4">
          <div className="flex" aria-hidden>
            {["ส", "บ", "ช"].map((t, i) => (
              <span key={i} className="-ml-1 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-[11px] font-bold ring-2 ring-white/40 first:ml-0">{t}</span>
            ))}
          </div>
          <p className="text-xs text-white/85"><b>90% SME พึงพอใจ</b><br />จากงานที่จ้างสำเร็จ</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- popup modal (split Fastwork-style, AirLume skin) ---------- */
export function AuthModal() {
  const { modal, closeAuth, user } = useAuth();
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

  useEffect(() => { if (user && modal) closeAuth(); }, [user, modal, closeAuth]);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-sm"
      onClick={closeAuth} role="presentation">
      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-card-lg bg-white shadow-card md:grid-cols-2"
        role="dialog" aria-modal="true" aria-label={mode === "login" ? "เข้าสู่ระบบ" : "สมัครใช้งานฟรี"}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={closeAuth} aria-label="ปิด"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-lg text-ink shadow hover:bg-white">
          ✕
        </button>
        {/* form side */}
        <div className="p-6 sm:p-8">
          <h2 className="text-center text-2xl font-extrabold text-ink">
            {mode === "login" ? "ยินดีต้อนรับกลับ" : "เริ่มจ้างบัญชีง่ายๆ"}
          </h2>
          <p className="mt-1 text-center text-sm text-slate-500">
            {mode === "login" ? "จัดการงานและข้อเสนอของคุณ" : "สมัครฟรี 30 วินาที ไม่ต้องใช้บัตร"}
          </p>
          <div className="mt-5">
            <AuthForm mode={mode} onMode={setMode} />
          </div>
        </div>
        {/* visual side */}
        <VisualPanel />
      </div>
    </div>
  );
}
