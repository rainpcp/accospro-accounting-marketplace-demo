import { Link } from "react-router-dom";
import { JOB_CATEGORIES } from "../lib/data";

/* ---------- floating card: stats (points) ---------- */
function StatsCard() {
  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold">งานบัญชีพร้อมจ้าง</p>
        <p className="text-[11px] text-slate-400">Last Update วันนี้</p>
      </div>
      <p className="mt-1 text-3xl font-extrabold text-primary-600">14+</p>
      <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-200">
        Ready
      </span>
      <div className="mt-3 space-y-1.5 text-xs text-slate-500">
        <div className="flex justify-between rounded-lg bg-slate-50 px-2.5 py-1.5"><span>ปิดงบรายเดือน</span><b>7 งาน</b></div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-2.5 py-1.5"><span>ยื่นภาษี</span><b>4 งาน</b></div>
      </div>
      <Link to="/jobboard" aria-label="ดูงานทั้งหมด"
        className="mt-3 grid h-9 w-9 place-items-center rounded-full bg-primary-50 font-bold text-primary-600 hover:bg-primary-100">→</Link>
    </div>
  );
}

/* ---------- floating card: smart match (hero, tallest) ---------- */
function MatchCard() {
  const R = 26;
  const C = 2 * Math.PI * R;
  const pct = 0.94;
  return (
    <div className="rounded-card-lg bg-white p-6 shadow-card">
      <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
        AccOS Smart Match
      </span>
      <p className="mt-3 text-lg font-extrabold text-ink">สแกน 20+</p>
      <p className="text-sm text-slate-500">สำนักงานบัญชีแบบเรียลไทม์</p>
      <div className="mt-4 flex items-center gap-3">
        <svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="แมตช์งานบัญชี 94%">
          <circle cx="36" cy="36" r={R} fill="none" stroke="#E8EBFF" strokeWidth="7" />
          <circle cx="36" cy="36" r={R} fill="none" stroke="#3347FF" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${C * pct} ${C}`} transform="rotate(-90 36 36)" />
          <text x="36" y="41" textAnchor="middle" fontSize="15" fontWeight="800" fill="#12163A">94%</text>
        </svg>
        <p className="text-xs leading-relaxed text-slate-500">แมตช์งานบัญชี<br />ตรงจังหวัด + งบ</p>
      </div>
      <div className="relative mt-4 overflow-hidden rounded-img bg-gradient-to-br from-navy-900 to-primary-600 p-4 text-white">
        <p className="text-sm font-bold">90% SME พึงพอใจ</p>
        <div className="mt-2 flex items-center">
          {["ส", "บ", "ช", "+9"].map((t, i) => (
            <span key={i} className="-ml-1 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-[11px] font-bold ring-2 ring-white/60 first:ml-0">{t}</span>
          ))}
          <span className="ml-2 text-[11px] text-white/80">จากงานที่จ้างสำเร็จ</span>
        </div>
      </div>
      <Link to="/find-firm" aria-label="เริ่มค้นหาสำนักงานบัญชี"
        className="mt-4 grid h-9 w-9 place-items-center rounded-full bg-primary-600 font-bold text-white hover:bg-primary-700">→</Link>
    </div>
  );
}

/* ---------- floating card: featured deal (glass) ---------- */
function DealCard() {
  return (
    <div className="glass-dark rounded-card-lg p-5 text-white">
      <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">ดีลเด่น</span>
      <p className="mt-3 text-xl font-extrabold">ปิดงบรายเดือน</p>
      <p className="text-2xl font-extrabold text-accent-sky">เริ่ม ฿2,000</p>
      <p className="mt-1 text-xs text-white/70">ประหยัดเวลาปิดงบ 60% ด้วย Agentic AI</p>
      <div className="mt-4 flex items-end justify-between">
        <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-white/30 text-[10px] text-white/60">
          verified
        </div>
        <Link to="/jobboard" aria-label="ดูดีลเด่น"
          className="grid h-9 w-9 place-items-center rounded-full bg-white font-bold text-primary-600">→</Link>
      </div>
    </div>
  );
}

/* ---------- features grid ---------- */
const FEATURES = [
  { icon: "✓", title: "สำนักงานบัญชี verified", desc: "ตรวจ DBD + ใบอนุญาต CPA/TA ทุกราย พร้อมคะแนนรีวิว", to: "/find-firm", active: true },
  { icon: "▦", title: "Jobboard รวมงาน", desc: "ประกาศงานบัญชีล่าสุด ยื่นข้อเสนอได้ทันที", to: "/jobboard" },
  { icon: "฿", title: "ราคาโปร่งใส", desc: "เทียบราคา + โปรไฟล์ก่อนจ้าง ไม่บังราคา", to: "/jobboard" },
  { icon: "◐", title: "แนบรูปผ่าน R2", desc: "รูปบิล หน้าร้าน แนบกับงานได้ 5 รูป เร็วทั่วโลก", to: "/post-job" },
  { icon: "✦", title: "Agentic AI ช่วยตรวจ", desc: "เอกสารเข้า queue AI ร่างรายการรอตรวจทุกงาน", to: "https://accospro.app" },
  { icon: "≡", title: "ภาษีไทยครบ", desc: "ภ.พ.30 ภ.ง.ด.3/53 เงินเดือน e-Tax กระทบยอด", to: "/find-firm" },
  { icon: "★", title: "รีวิวจากงานจริง", desc: "คะแนน + จำนวนงานจริงบนทุกโปรไฟล์", to: "/find-talent" },
  { icon: "+", title: "โพสต์งานฟรี", desc: "ฟรีไม่จำกัด เริ่มได้ใน 1 นาที ไม่ต้องใช้บัตร", to: "/post-job" },
];

export default function Home() {
  return (
    <div>
      {/* ============ DARK HERO ============ */}
      <section className="hero-dark hero-bg relative overflow-hidden">
        <div className="hero-pillars absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-44 pt-24 text-center sm:pt-28">
          <span className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/90">
            ✦ ตลาดบัญชีไทยบน accospro.app
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            จ้างบัญชีง่าย<br />งานเข้าระบบ AccOS Pro
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-sm text-white/70 sm:text-base">
            SME หาสำนักงานบัญชี verified · สำนักงานบัญชีหาทีมช่วยงาน — เอกสารเข้า AI ร่างรายการรอตรวจ
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/find-firm" className="cta-airlume">
              ค้นหาสำนักงานบัญชี <span className="cta-arrow" aria-hidden>→</span>
            </Link>
            <Link to="/jobboard"
              className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white hover:bg-white/10">
              ดู Jobboard →
            </Link>
          </div>

          {/* floating cards */}
          <div className="floating-cards mx-auto mt-12 grid max-w-4xl items-center gap-6 text-left md:grid-cols-[0.9fr_1fr_0.9fr]">
            <StatsCard />
            <div className="order-first md:order-none md:-my-5"><MatchCard /></div>
            <DealCard />
          </div>
        </div>
      </section>

      {/* curve into light */}
      <div className="curve-divider" aria-hidden />

      {/* ============ LIGHT FEATURES ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-10 text-center">
        <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-600">
          AccOS Marketplace
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-ink sm:text-4xl">
          ทุกอย่างที่งานบัญชีต้องการ ในที่เดียว
        </h2>
        <p className="mx-auto mt-2 max-w-[620px] text-sm text-muted">
          หาคน เปรียบเทียบราคา ยื่นข้อเสนอ แนบรูป — งานวิ่งเข้า AccOS Pro อัตโนมัติ
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const inner = (
              <>
                <span className={`grid h-11 w-11 place-items-center rounded-full text-lg font-bold ${f.active ? "bg-white/15 text-white" : "bg-primary-50 text-primary-600"}`} aria-hidden>
                  {f.icon}
                </span>
                <p className="mt-4 text-[15px] font-bold">{f.title}</p>
                <p className={`mt-1 text-xs leading-relaxed ${f.active ? "text-white/75" : "text-muted"}`}>{f.desc}</p>
                <span className={`mt-3 inline-block text-[13px] font-semibold ${f.active ? "text-white" : "text-ink"}`}>ดูเพิ่ม →</span>
              </>
            );
            const cls = `feature-card rounded-card p-6 ${f.active ? "bg-primary-600 text-white shadow-cta" : "border border-slate-200/80 bg-white shadow-soft"}`;
            return f.to.startsWith("http") ? (
              <a key={f.title} href={f.to} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
            ) : (
              <Link key={f.title} to={f.to} className={cls}>{inner}</Link>
            );
          })}
        </div>
      </section>

      {/* categories */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold text-ink">หาตามงานที่ต้องการ</h2>
        <div className="chip-row mt-3 flex gap-2 overflow-x-auto pb-1">
          {JOB_CATEGORIES.map((c) => (
            <Link key={c} to={`/find-firm?category=${encodeURIComponent(c.replace("รายเดือน", ""))}`}
              className="shrink-0 rounded-full border bg-white px-4 py-2 text-sm font-medium hover:border-primary-300 hover:bg-primary-50">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* A/B paths */}
      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-10 md:grid-cols-2">
        <div className="rounded-card border border-slate-200/80 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">สำหรับ SME</p>
          <h2 className="mt-1 text-lg font-bold text-ink">A · หาสำนักงานบัญชี</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted">
            {["โพสต์งาน + งบที่ตั้งไว้", "เทียบโปรไฟล์ verified + รีวิว", "จ้าง → เอกสารเข้า AccOS Pro"].map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link to="/find-firm" className="mt-4 inline-block text-sm font-semibold text-ink">ค้นหาสำนักงานบัญชี →</Link>
        </div>
        <div className="rounded-card border border-slate-200/80 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">สำหรับสำนักงานบัญชี</p>
          <h2 className="mt-1 text-lg font-bold text-ink">B · หาทีมช่วยงาน</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted">
            {["โพสต์งานค้างที่ต้องการคนช่วย", "เลือก talent ตามทักษะ + เรท", "assign งานใน workspace เดิม"].map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link to="/find-talent" className="mt-4 inline-block text-sm font-semibold text-ink">ค้นหาทีมช่วยงาน →</Link>
        </div>
      </section>

      {/* CTA close */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-card bg-white p-6 text-sm text-muted shadow-soft">
          <b className="text-ink">จ้างอย่างมั่นใจ:</b> ทุกโปรไฟล์ผ่านการตรวจใบอนุญาตและ DBD ·
          เริ่มจากงานเล็กก่อนได้ · มีปัญหารายงานผ่านแพลตฟอร์มได้ตลอด
          <div className="mt-3">
            <Link to="/post-job" className="cta-airlume">โพสต์งานฟรี <span className="cta-arrow" aria-hidden>→</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
