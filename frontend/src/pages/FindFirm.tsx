import { useEffect, useState } from "react";

type Firm = { id: string; name: string; province: string; categories: string[]; price_min: number; price_max: number; rating: number; review_count: number; intro?: string };

export default function FindFirm() {
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [data, setData] = useState<Firm[]>([]);
  const [mock, setMock] = useState(false);

  const load = async () => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (province) p.set("province", province);
    const r = await fetch(`/api/firms?${p.toString()}`).then((x) => x.json());
    setData(r.data || []);
    setMock(!!r.mock);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">A · หาสำนักงานบัญชี</h1>
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหา เช่น ปิดงบ เชียงใหม่" className="w-64 rounded-xl border px-4 py-2" />
        <input value={province} onChange={(e) => setProvince(e.target.value)} placeholder="จังหวัด (ว่าง = ทั้งหมด)" className="w-56 rounded-xl border px-4 py-2" />
        <button onClick={load} className="rounded-xl bg-indigo-600 px-4 py-2 text-white">ค้นหา</button>
        {mock && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">mock mode — migrate D1 แล้วจะใช้ข้อมูลจริง</span>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {data.map((f) => (
          <div key={f.id} className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <b>{f.name}</b>
              <span className="text-sm text-amber-500">★ {f.rating} ({f.review_count})</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{f.province} · ฿{f.price_min.toLocaleString()}–{f.price_max.toLocaleString()}/เดือน</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {f.categories.map((c) => <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{c}</span>)}
            </div>
            <p className="mt-2 text-sm text-slate-600">{f.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
