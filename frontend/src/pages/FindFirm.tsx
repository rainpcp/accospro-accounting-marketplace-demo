import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FIRM_CATEGORIES, PROVINCES } from "../lib/data";
import { AccosBadge, Chip, EmptyState, PriceRange, Rating, SkeletonCard, VerifiedBadge } from "../components/ui";

type Firm = {
  id: string; name: string; province: string; categories: string[];
  price_min: number; price_max: number; rating: number; review_count: number;
  dbd_verified?: number; accos_pro_user?: number; intro?: string;
};

export default function FindFirm() {
  const [params] = useSearchParams();
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [minRating, setMinRating] = useState(0);
  const [data, setData] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [mock, setMock] = useState(false);

  const load = async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (province) p.set("province", province);
    if (category) p.set("category", category);
    if (minRating) p.set("minRating", String(minRating));
    try {
      const r: any = await fetch(`/api/firms?${p.toString()}`).then((x) => x.json());
      setData(r.data || []);
      setMock(!!r.mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const hasFilter = q || province || category || minRating > 0;
  const clear = () => { setQ(""); setProvince(""); setCategory(""); setMinRating(0); setTimeout(load, 0); };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">A · หาสำนักงานบัญชี</h1>
        <p className="mt-1 text-sm text-slate-500" role="status">
          {loading ? "กำลังค้นหา…" : `พบ ${data.length} ราย${mock ? " (mock)" : ""}`}
        </p>
      </div>

      {/* filters: 5 ตัวหลักเหนือ fold */}
      <div className="space-y-3 rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="ค้นหาชื่อ เช่น ปิดงบ เชียงใหม่" aria-label="ค้นหาสำนักงานบัญชี"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-[16px]" />
          <select value={province} onChange={(e) => setProvince(e.target.value)} aria-label="จังหวัด"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 sm:w-48">
            <option value="">ทุกจังหวัด</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} aria-label="คะแนนขั้นต่ำ"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 sm:w-40">
            <option value={0}>ทุกคะแนน</option>
            <option value={4.5}>★ 4.5+</option>
            <option value={4.8}>★ 4.8+</option>
          </select>
          <button onClick={load} className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700">
            ค้นหา
          </button>
        </div>
        <div className="chip-row flex gap-2 overflow-x-auto pb-1" role="group" aria-label="หมวดงาน">
          <button onClick={() => setCategory("")}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${!category ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            ทั้งหมด
          </button>
          {FIRM_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(category === c ? "" : c)} aria-pressed={category === c}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${category === c ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {c}
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
          title="ไม่พบสำนักงานบัญชีที่ตรงเงื่อนไข"
          hint="ลองลบคำค้น ล้างจังหวัด หรือเลือกหมวดอื่น — งานบัญชีส่วนใหญ่ต้องการแค่จังหวัดกับหมวดงานก็เจอแล้ว"
          action={<>
            <button onClick={clear} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">ล้างตัวกรอง</button>
            <Link to="/post-job" className="rounded-xl border px-4 py-2 text-sm font-semibold">โพสต์งานให้ firm มาติดต่อแทน</Link>
          </>}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((f) => (
            <article key={f.id} className="rounded-2xl border bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold">{f.name}</h2>
                <Rating value={f.rating} count={f.review_count} />
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{f.province}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.dbd_verified ? <VerifiedBadge label="ตรวจ DBD แล้ว" /> : null}
                {f.accos_pro_user ? <AccosBadge /> : null}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.categories.map((c) => <Chip key={c}>{c}</Chip>)}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <PriceRange min={f.price_min} max={f.price_max} />
              </div>
              {f.intro && <p className="mt-1.5 text-sm text-slate-600">{f.intro}</p>}
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
