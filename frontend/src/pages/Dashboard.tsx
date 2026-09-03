import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baht } from "../lib/data";
import { EmptyState, SkeletonCard, StatusChip } from "../components/ui";

type Job = { id: string; title: string; category: string; budget: number; province?: string; status: string; cover?: string | null };

function JobList({ jobs, emptyHint }: { jobs: Job[]; emptyHint: string }) {
  if (jobs.length === 0)
    return <p className="rounded-xl border border-dashed bg-white p-4 text-sm text-slate-500">{emptyHint}</p>;
  return (
    <div className="grid gap-2">
      {jobs.map((j) => (
        <div key={j.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 text-sm">
          {j.cover && (
            <a href={j.cover} target="_blank" rel="noreferrer" className="block h-14 w-14 shrink-0 overflow-hidden rounded-lg border">
              <img src={j.cover} alt="" loading="lazy" className="h-full w-full object-cover" />
            </a>
          )}
          <b className="mr-auto">{j.title}</b>
          <StatusChip status={j.status} />
          <span className="text-slate-500">{j.category} · {baht(j.budget)}{j.province ? ` · ${j.province}` : ""}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [sme, setSme] = useState<Job[]>([]);
  const [firm, setFirm] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs-sme").then((x) => x.json()),
      fetch("/api/jobs-firm").then((x) => x.json()),
    ]).then(([a, b]: any) => {
      setSme(a.data || []);
      setFirm(b.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const open = [...sme, ...firm].filter((j) => j.status === "open").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">งานของฉัน</h1>
          <p className="mt-1 text-sm text-slate-500" role="status">
            {loading ? "กำลังโหลด…" : `งานเปิดรับทั้งหมด ${open} งาน`}
          </p>
        </div>
        <Link to="/post-job" className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          + โพสต์งานใหม่
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>
      ) : sme.length + firm.length === 0 ? (
        <EmptyState
          title="ยังไม่มีงานในระบบ"
          hint="เริ่มโพสต์งานแรกฟรี — ใช้เวลาไม่ถึงนาที"
          action={<Link to="/post-job" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">โพสต์งานแรก</Link>}
        />
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="font-bold">A · งาน SME หา firm ({sme.length})</h2>
            <JobList jobs={sme} emptyHint="ยังไม่มีงานฝั่ง SME — โพสต์งานแรกได้เลย" />
          </section>
          <section className="space-y-2">
            <h2 className="font-bold">B · งาน Firm หา talent ({firm.length})</h2>
            <JobList jobs={firm} emptyHint="ยังไม่มีงานฝั่ง firm — โพสต์งานแรกได้เลย" />
          </section>
        </>
      )}
    </div>
  );
}
