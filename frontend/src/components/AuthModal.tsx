import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type AuthMode } from "../lib/auth";
import { Field, PasswordField, inputCls } from "./ui";

/* ---------- shared form (modal + fallback pages) ---------- */
export function AuthForm({ mode, onMode }: {
  mode: AuthMode; onMode: (m: AuthMode) => void;
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
      <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1.5" role="tablist" aria-label="เลือก">
        {(["login", "register"] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => onMode(m)}
            className={`rounded-full py-2.5 text-[15px] font-semibold ${mode === m ? "bg-white text-ink shadow" : "text-slate-500 hover:text-ink"}`}>
            {m === "login" ? "เข้าสู่ระบบ" : "สมัครฟรี"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200" role="alert">{error}</p>}
        {mode === "register" && (
          <Field label="ชื่อ / ชื่อบริษัท">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น บริษัท ตัวอย่าง จำกัด"
              autoComplete="name" className={`${inputCls} py-3`} />
          </Field>
        )}
        <Field label="อีเมล">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            autoComplete="email" placeholder="name@company.co.th" className={`${inputCls} py-3`} />
        </Field>
        <Field label={mode === "register" ? "รหัสผ่าน (อย่างน้อย 8 ตัว)" : "รหัสผ่าน"}>
          <PasswordField value={password} onChange={setPassword} onEnter={submit} />
        </Field>
        {mode === "register" && (
          <Field label="สมัครในบทบาท">
            <select value={role} onChange={(e) => setRole(e.target.value)} className={`${inputCls} py-3`}>
              <option value="sme">SME — หาสำนักงานบัญชี</option>
              <option value="firm">สำนักงานบัญชี — รับงาน + หาทีม</option>
              <option value="talent">ฟรีแลนซ์ — รับงานจาก firm</option>
            </select>
          </Field>
        )}
        <button onClick={submit} disabled={!canSubmit}
          className={canSubmit
            ? "cta-airlume cta-lg w-full justify-center"
            : "flex h-14 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-200 text-base font-semibold text-slate-400"}>
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

/* ---------- right visual panel, large ---------- */
function VisualPanel() {
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div className="hero-dark hero-bg relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
      <div className="hero-pillars absolute inset-0" aria-hidden />
      {/* glow orbs */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-sky/20 blur-3xl" aria-hidden />
      <div className="relative">
        <span className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
          ✦ AccOS Pro Marketplace
        </span>
        <p className="mt-5 text-4xl font-extrabold leading-tight tracking-tight">
          จ้างบัญชีง่าย<br />
          <span className="text-primary-300">งานเข้าระบบทันที</span>
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
          สำนักงานบัญชี verified 20+ ราย · รีวิวจากงานจริง · เอกสารเข้า AI ร่างรายการรอตรวจ
        </p>
      </div>
      <div className="relative space-y-4">
        <div className="flex items-center gap-4 rounded-card bg-white p-5 text-ink shadow-card">
          <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label="แมตช์งานบัญชี 94%">
            <circle cx="44" cy="44" r={R} fill="none" stroke="#E8EBFF" strokeWidth="9" />
            <circle cx="44" cy="44" r={R} fill="none" stroke="#3347FF" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={`${C * 0.94} ${C}`} transform="rotate(-90 44 44)" />
            <text x="44" y="50" textAnchor="middle" fontSize="17" fontWeight="800" fill="#12163A">94%</text>
          </svg>
          <div>
            <p className="font-bold">แมตช์ตรงจังหวัด + งบ</p>
            <p className="text-sm text-slate-500">สแกนสำนักงานบัญชีแบบเรียลไทม์</p>
          </div>
          <span className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 font-bold text-primary-600" aria-hidden>→</span>
        </div>
        <div className="glass-dark flex items-center gap-4 rounded-card p-5">
          <div className="flex" aria-hidden>
            {["ส", "บ", "ช", "+9"].map((t, i) => (
              <span key={i} className="-ml-2 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-xs font-bold ring-2 ring-white/40 first:ml-0">{t}</span>
            ))}
          </div>
          <p className="text-sm text-white/85"><b className="text-base">90% SME พึงพอใจ</b><br />จากงานที่จ้างสำเร็จ</p>
        </div>
        <div className="flex gap-2 text-[11px] font-medium text-white/60">
          <span className="rounded-full border border-white/15 px-3 py-1">✓ ตรวจ DBD</span>
          <span className="rounded-full border border-white/15 px-3 py-1">✓ CPA/TA</span>
          <span className="rounded-full border border-white/15 px-3 py-1">✓ PDPA</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- popup modal (large split) ---------- */
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
    <div className="overlay-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={closeAuth} role="presentation">
      <div className="modal-in relative grid w-full max-w-5xl overflow-hidden rounded-card-lg bg-white shadow-card lg:grid-cols-[1.05fr_1fr]"
        role="dialog" aria-modal="true" aria-label={mode === "login" ? "เข้าสู่ระบบ" : "สมัครใช้งานฟรี"}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={closeAuth} aria-label="ปิด"
          className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/85 text-lg text-ink shadow-soft backdrop-blur hover:bg-white">
          ✕
        </button>
        {/* form side */}
        <div className="p-7 sm:p-10 lg:p-12">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {mode === "login" ? "ยินดีต้อนรับกลับ" : "เริ่มจ้างบัญชีง่ายๆ"}
          </h2>
          <p className="mt-2 text-center text-[15px] text-slate-500">
            {mode === "login" ? "จัดการงานและข้อเสนอของคุณต่อได้ทันที" : "สมัครฟรี 30 วินาที ไม่ต้องใช้บัตรเครดิต"}
          </p>
          <div className="mx-auto mt-7 max-w-md">
            <AuthForm mode={mode} onMode={setMode} />
          </div>
        </div>
        {/* visual side */}
        <VisualPanel />
      </div>
    </div>
  );
}
