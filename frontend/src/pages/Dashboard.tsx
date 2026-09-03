import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sme, setSme] = useState<any[]>([]);
  const [firm, setFirm] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/jobs-sme").then((x) => x.json()).then((r) => setSme(r.data || []));
    fetch("/api/jobs-firm").then((x) => x.json()).then((r) => setFirm(r.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">งานของฉัน (Demo)</h1>
      <section>
        <h2 className="font-bold">A · งาน SME หา firm ({sme.length})</h2>
        <div className="mt-2 grid gap-2">
          {sme.map((j: any) => (
            <div key={j.id} className="rounded-xl border bg-white p-4 text-sm">
              <b>{j.title}</b> <span className="text-slate-500">· {j.category} · ฿{Number(j.budget || 0).toLocaleString()} · {j.province} · {j.status}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-bold">B · งาน Firm หา talent ({firm.length})</h2>
        <div className="mt-2 grid gap-2">
          {firm.map((j: any) => (
            <div key={j.id} className="rounded-xl border bg-white p-4 text-sm">
              <b>{j.title}</b> <span className="text-slate-500">· {j.category} · ฿{Number(j.budget || 0).toLocaleString()} · {j.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
