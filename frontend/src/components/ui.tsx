import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { baht } from "../lib/data";

/* ---------- AirLume inner-page dark hero ---------- */
export function PageHero({ badge, title, sub, children }: {
  badge: string; title: ReactNode; sub?: string; children?: ReactNode;
}) {
  return (
    <section className="hero-dark hero-bg relative overflow-hidden">
      <div className="hero-pillars absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-12 text-center sm:pt-14">
        <span className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
          {badge}
        </span>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {sub && <p className="mx-auto mt-2 max-w-[620px] text-sm text-white/70">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

/* ---------- AirLume CTA pill link (primary action, arrow affordance) ---------- */
export function CtaLink({ to, children, ghost = false }: { to: string; children: ReactNode; ghost?: boolean }) {
  if (ghost)
    return (
      <Link to={to} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white hover:bg-white/10">
        {children} <span aria-hidden>→</span>
      </Link>
    );
  return (
    <Link to={to} className="cta-airlume">
      {children} <span className="cta-arrow" aria-hidden>→</span>
    </Link>
  );
}

/* ---------- trust: rating + count (เหนือ fold เสมอ) ---------- */
export function Rating({ value, count, dark = false }: { value: number; count: number; dark?: boolean }) {
  const v = Number(value);
  const safe = Number.isFinite(v) ? v : 0;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${dark ? "text-amber-300" : "text-amber-600"}`} aria-label={`คะแนน ${safe} จาก ${count} รีวิว`}>
      <span aria-hidden>★</span> {safe.toFixed(1)}
      <span className={`font-normal ${dark ? "text-white/70" : "text-slate-500"}`}>({count})</span>
    </span>
  );
}

/* ---------- trust: verified badge (DBD / CPA / AccOS Pro) ---------- */
export function VerifiedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <span aria-hidden>✓</span> {label}
    </span>
  );
}

export function AccosBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-primary-200">
      ใช้ AccOS Pro
    </span>
  );
}

/* ---------- category / skill chip ---------- */
export function Chip({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "brand" }) {
  const cls = tone === "brand"
    ? "bg-primary-50 text-primary-700 ring-primary-100"
    : "bg-slate-100 text-slate-600 ring-slate-200/60";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${cls}`}>{children}</span>;
}

/* ---------- price ---------- */
export function PriceRange({ min, max, suffix = "/เดือน" }: { min: number; max: number; suffix?: string }) {
  return (
    <p className="text-sm font-semibold text-slate-900">
      {baht(min)}–{baht(max)}<span className="font-normal text-slate-500">{suffix}</span>
    </p>
  );
}

/* ---------- loading skeleton card ---------- */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white p-5" aria-hidden>
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton mt-2 h-4 w-1/3" />
      <div className="mt-3 flex gap-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-20" />
      </div>
      <div className="skeleton mt-3 h-4 w-full" />
    </div>
  );
}

/* ---------- zero-result / empty state (มีทางออกเสมอ) ---------- */
export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{hint}</p>
      {action && <div className="mt-4 flex justify-center gap-2">{action}</div>}
    </div>
  );
}

/* ---------- form field with real <label> ---------- */
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-600">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[16px] placeholder:text-slate-400 hover:border-slate-400";

/* ---------- password with show/hide ---------- */
export function PasswordField({ value, onChange, onEnter, placeholder = "รหัสผ่าน ≥ 8 ตัว", autoComplete = "current-password" }: {
  value: string; onChange: (v: string) => void; onEnter?: () => void; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputCls} pr-16`}
        aria-label="รหัสผ่าน"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
      >
        {show ? "ซ่อน" : "แสดง"}
      </button>
    </div>
  );
}

/* ---------- job status ---------- */
const STATUS: Record<string, { th: string; cls: string }> = {
  open: { th: "เปิดรับ", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  matched: { th: "จับคู่แล้ว", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  closed: { th: "ปิดงาน", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
};

export function StatusChip({ status }: { status: string }) {
  const s = STATUS[status] || { th: status, cls: "bg-slate-100 text-slate-500 ring-slate-200" };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${s.cls}`}>{s.th}</span>;
}
