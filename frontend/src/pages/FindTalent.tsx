import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PROVINCES, TALENT_SKILLS, baht } from "../lib/data";
import { Chip, EmptyState, Rating, SkeletonCard } from "../components/ui";

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
  const [mock, setMock] = useState(false);

  const load = async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (province) p.set("province", province);
    if (skill) p.set("skill", skill);
    try {
      const r: any = await fetch(`/api/talents?${p.toString()}`).then((x) => x.json());
      setData(r.data || []);
      setMock(!!r.mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const hasFilter = q || province || skill;
  const clear = () => { setQ(""); setProvince(""); setSkill(""); setTimeout(load, 0); };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">B · หาทีมช่วยงาน</h1>
        <p className="mt-1 text-sm text-slate-500" role="status">
          {loading ? "กำลังค้นหา…" : `พบ ${data.length} คน${mock ? " (mock)" : ""}`}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="ค้นหาชื่อ/ทักษะ เช่น กระทบยอด e-Tax" aria-label="ค้นหาฟรีแลนซ์"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-[16px]" />
          <select value={province} onChange={(e) => setProvince(e.target.value)} aria-label="จังหวัด"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 sm:w-48">
            <option value="">ทุกจังหวัด</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={load} className="rounded-xl bg-slate-900 px-6 py-2.5 font-semibold text-white hover:bg-slate-700">
            ค้นหา
          </button>
        </div>
        <div className="chip-row flex gap-2 overflow-x-auto pb-1" role="group" aria-label="ทักษะ">
          <button onClick={() => setSkill("")}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${!skill ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            ทุกทักษะ
          </button>
          {TALENT_SKILLS.map((s) => (
            <button key={s} onClick={() => setSkill(skill === s ? "" : s)} aria-pressed={skill === s}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${skill === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="ไม่พบฟรีแลนซ์ที่ตรงเงื่อนไข"
          hint="ลองล้างทักษะหรือจังหวัด — หรือโพสต์งานทิ้งไว้ ให้ talent ที่ว่างเข้ามาเสนอราคาเอง"
          action={<>
            <button onClick={clear} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">ล้างตัวกรอง</button>
            <Link to="/post-job" className="rounded-xl border px-4 py-2 text-sm font-semibold">โพสต์งาน B · หาทีม</Link>
          </>}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((t) => (
            <article key={t.id} className="rounded-2xl border bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold">{t.name}</h2>
                <Rating value={t.rating} count={t.review_count} />
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{t.province}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.skills.map((s) => <Chip key={s} tone="brand">{s}</Chip>)}
              </div>
              <p className="mt-3 text-sm font-semibold">{baht(t.rate_per_month)}<span className="font-normal text-slate-500">/เดือน</span></p>
              {t.intro && <p className="mt-1.5 text-sm text-slate-600">{t.intro}</p>}
            </article>
          ))}
        </div>
      )}
      {hasFilter && !loading && data.length > 0 && (
        <button onClick={clear} className="text-sm text-slate-500 underline">ล้างตัวกรองทั้งหมด</button>
      )}
    </div>
  );
}
