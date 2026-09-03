import { useEffect, useState } from "react";

type Talent = { id: string; name: string; skills: string[]; province: string; rate_per_month: number; rating: number; review_count: number; intro?: string };

export default function FindTalent() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Talent[]>([]);
  const [mock, setMock] = useState(false);

  const load = async () => {
    const r = await fetch(`/api/talents?q=${encodeURIComponent(q)}`).then((x) => x.json());
    setData(r.data || []);
    setMock(!!r.mock);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">B · หาทีมช่วยงาน (Freelance)</h1>
      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหา เช่น กระทบยอด e-Tax" className="w-72 rounded-xl border px-4 py-2" />
        <button onClick={load} className="rounded-xl bg-slate-900 px-4 py-2 text-white">ค้นหา</button>
        {mock && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">mock mode</span>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {data.map((t) => (
          <div key={t.id} className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <b>{t.name}</b>
              <span className="text-sm text-amber-500">★ {t.rating} ({t.review_count})</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{t.province} · ฿{t.rate_per_month.toLocaleString()}/เดือน</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {t.skills.map((s) => <span key={s} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{s}</span>)}
            </div>
            <p className="mt-2 text-sm text-slate-600">{t.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
