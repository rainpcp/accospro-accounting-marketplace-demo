import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROVINCES, TALENT_SKILLS, baht } from "../lib/data";
import { Chip, CtaLink, EmptyState, PageHero, Rating, SkeletonCard } from "../components/ui";

type Talent = {
  id: string; name: string; skills: string[]; province: string;
  rate_per_month: number; rating: number; review_count: number; intro?: string;
};

export default function FindTalent() {
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [skill, setSkill] = useState("");
  const [data, setData] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const reqId = useRef(0);
  const doFetch = async (fq: string, fprov: string, fskill: string) => {
    const my = ++reqId.current;
    setLoading(true);
    const p = new URLSearchParams();
    if (fq) p.set("q", fq);
    if (fprov) p.set("province", fprov);
    if (fskill) p.set("skill", fskill);
    try {
      const r: any = await fetch(`/api/talents?${p.toString()}`).then((x) => x.json());
      if (reqId.current !== my) return; // กัน response เก่าทับผลใหม่ตอนกดฟิลเตอร์รัว
      setData(r.data || []);
      if (!fq && !fprov && !fskill) setTotal((r.data || []).length);
    } finally {
      setLoading(false);
    }
  };

  const load = () => doFetch(q, province, skill);

  // chip ทักษะ / select จังหวัด → ค้นหาใหม่ทันที (ไม่ต้องกดปุ่มค้นหาซ้ำ)
  // ตั้งใจไม่ใส่ q ใน deps: ช่องพิมพ์ใช้ Enter/ปุ่มค้นหาเพื่อไม่ให้ยิงทุก keystroke
  useEffect(() => { doFetch(q, province, skill); }, [province, skill]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFilter = q || province || skill;
  // ล้างแล้วค้นใหม่ด้วยค่าว่างตรง ๆ (ไม่เรียก load ที่ closure ค่าเก่า)
  const clear = () => {
    setQ(""); setProvince(""); setSkill("");
    doFetch("", "", "");
  };

  return (
    <div className="pb-12">
      <PageHero badge="✦ สำหรับสำนักงานบัญชี" title={<>หาทีมช่วยงาน<br />เคลียร์งานค้างไว</>}
        sub={`ฟรีแลนซ์บัญชี ${total > 0 ? `${total} คน` : ""} — เลือกตามทักษะ เรทชัดเจน รีวิวจากงานจริง`} />

      <div className="mx-auto max-w-6xl px-4">
        <div className="relative z-10 -mt-16 space-y-3 rounded-card border border-slate-200/60 bg-white p-4 shadow-card sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="ค้นหาชื่อ/ทักษะ เช่น กระทบยอด e-Tax" aria-label="ค้นหาฟรีแลนซ์"
              className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-[16px]" />
            <select value={province} onChange={(e) => setProvince(e.target.value)} aria-label="จังหวัด"
              className="rounded-full border border-slate-300 bg-white px-4 py-3 sm:w-44">
              <option value="">ทุกจังหวัด</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={load} className="rounded-full bg-primary-600 px-8 py-3 font-semibold text-white shadow-cta hover:bg-primary-700">
              ค้นหา
            </button>
          </div>
          <div className="chip-row flex gap-2 overflow-x-auto pb-1" role="group" aria-label="ทักษะ">
            <button onClick={() => setSkill("")}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${!skill ? "bg-navy-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              ทุกทักษะ
            </button>
            {TALENT_SKILLS.map((s) => (
              <button key={s} onClick={() => setSkill(skill === s ? "" : s)} aria-pressed={skill === s}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${skill === s ? "bg-navy-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500" role="status">
          {loading ? "กำลังค้นหา…" : `พบ ${data.length} คน`}
        </p>

        {loading ? (
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : data.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="ไม่พบฟรีแลนซ์ที่ตรงเงื่อนไข"
              hint="ลองล้างทักษะหรือจังหวัด — หรือโพสต์งานทิ้งไว้ ให้ talent ที่ว่างเข้ามาเสนอราคาเอง"
              action={<>
                <button onClick={clear} className="rounded-full bg-navy-950 px-5 py-2 text-sm font-semibold text-white">ล้างตัวกรอง</button>
                <Link to="/post-job" className="rounded-full border px-5 py-2 text-sm font-semibold">โพสต์งาน B · หาทีม</Link>
              </>}
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            {data.map((t) => (
              <article key={t.id} className="feature-card rounded-card border border-slate-200/80 bg-white p-6 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-ink">{t.name}</h2>
                  <Rating value={t.rating} count={t.review_count} />
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{t.province}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {t.skills.map((s) => <Chip key={s} tone="brand">{s}</Chip>)}
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-base font-extrabold text-ink">{baht(t.rate_per_month)}<span className="font-normal text-slate-500">/เดือน</span></p>
                </div>
                {t.intro && <p className="mt-1.5 text-sm text-slate-600">{t.intro}</p>}
              </article>
            ))}
          </div>
        )}
        {hasFilter && !loading && data.length > 0 && (
          <button onClick={clear} className="mt-4 text-sm text-slate-500 underline">ล้างตัวกรองทั้งหมด</button>
        )}
        <div className="mt-8 text-center">
          <CtaLink to="/post-job">โพสต์งานหาทีมช่วย</CtaLink>
        </div>
      </div>
    </div>
  );
}
