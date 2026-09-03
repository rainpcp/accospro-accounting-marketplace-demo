import { Link } from "react-router-dom";
import { JOB_CATEGORIES } from "../lib/data";

const STATS = [
  { v: "20+", l: "สำนักงานบัญชี + ฟรีแลนซ์ verified" },
  { v: "6", l: "หมวดงานภาษาไทย buyer-language" },
  { v: "฿0", l: "โพสต์งานฟรี เริ่มได้ทันที" },
];

const STEPS_A = ["โพสต์งาน + งบที่ตั้งไว้", "เทียบโปรไฟล์ verified + รีวิว", "จ้าง → เอกสารเข้า AccOS Pro"];
const STEPS_B = ["โพสต์งานค้างที่ต้องการคนช่วย", "เลือก talent ตามทักษะ + เรท", "assign งานใน workspace เดิม"];

export default function Home() {
  return (
    <div className="space-y-10">
      {/* hero: promise + dual CTA + trust cues */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white sm:p-10">
        <p className="text-sm text-white/75">ส่วนเสริมของ accospro.app · ภาษาไทย</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold sm:text-4xl">
          ตลาดบัญชีไทย — จ้างง่าย งานเข้าระบบ AccOS Pro ทันที
        </h1>
        <p className="mt-3 max-w-2xl text-white/85">
          SME หาสำนักงานบัญชี verified · สำนักงานบัญชีหาทีมช่วยเคลียร์งานค้าง — เอกสารเข้า queue AI ร่างรายการรอตรวจเหมือนเดิม
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/find-firm" className="rounded-xl bg-white px-6 py-3.5 text-center font-semibold text-indigo-700 hover:bg-indigo-50">
            A · หาสำนักงานบัญชี
          </Link>
          <Link to="/find-talent" className="rounded-xl bg-slate-900 px-6 py-3.5 text-center font-semibold text-white hover:bg-slate-700">
            B · หาทีมช่วยงาน
          </Link>
        </div>
        {/* trust cues ใต้ hero — ไม่ใช่ decoration */}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/80">
          <span>✓ ตรวจ DBD + ใบอนุญาต CPA/TA</span>
          <span>✓ รีวิวจากงานจริง</span>
          <span>✓ โพสต์งานฟรี ไม่บังราคา</span>
        </div>
      </section>

      {/* stats */}
      <section className="grid grid-cols-3 gap-3" aria-label="ตัวเลข marketplace">
        {STATS.map((s) => (
          <div key={s.l} className="rounded-2xl border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-indigo-700">{s.v}</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.l}</p>
          </div>
        ))}
      </section>

      {/* buyer-language categories → search */}
      <section>
        <h2 className="text-xl font-bold">หาตามงานที่ต้องการ</h2>
        <div className="chip-row mt-3 flex gap-2 overflow-x-auto pb-1">
          {JOB_CATEGORIES.map((c) => (
            <Link key={c} to={`/find-firm?category=${encodeURIComponent(c.replace("รายเดือน", ""))}`}
              className="shrink-0 rounded-full border bg-white px-4 py-2 text-sm font-medium hover:border-indigo-300 hover:bg-indigo-50">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* dual paths */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">สำหรับ SME</p>
          <h2 className="mt-1 text-lg font-bold">A · หาสำนักงานบัญชี</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            {STEPS_A.map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link to="/find-firm" className="mt-4 inline-block text-sm font-semibold text-indigo-600">ค้นหาสำนักงานบัญชี →</Link>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">สำหรับสำนักงานบัญชี</p>
          <h2 className="mt-1 text-lg font-bold">B · หาทีมช่วยงาน</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            {STEPS_B.map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link to="/find-talent" className="mt-4 inline-block text-sm font-semibold text-indigo-600">ค้นหาทีมช่วยงาน →</Link>
        </div>
      </section>

      {/* protection adjacent to CTA */}
      <section className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
        <b className="text-slate-900">จ้างอย่างมั่นใจ:</b> ทุกโปรไฟล์ผ่านการตรวจใบอนุญาตและ DBD ·
        เริ่มจากงานเล็กก่อนได้ · มีปัญหารายงานผ่านแพลตฟอร์มได้ตลอด
        <div className="mt-3">
          <Link to="/post-job" className="inline-block rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700">
            โพสต์งานฟรี
          </Link>
        </div>
      </section>
    </div>
  );
}
