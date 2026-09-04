import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baht } from "../lib/data";
import { useAuth } from "../lib/auth";
import { EmptyState, SkeletonCard, StatusChip } from "../components/ui";

type Job = { id: string; title: string; category: string; budget: number; province?: string; status: string; cover?: string | null };

function JobList({ jobs, jobType, emptyHint }: { jobs: Job[]; jobType: "sme" | "firm"; emptyHint: string }) {
  if (jobs.length === 0)
    return <p className="rounded-xl border border-dashed bg-white p-4 text-sm text-slate-500">{emptyHint}</p>;
  return (
    <div className="grid gap-2">
      {jobs.map((j) => (
        <Link key={j.id} to={`/jobs/${jobType}/${j.id}`}
          className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50/50">
          {j.cover && (
            <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-lg border">
              <img src={j.cover} alt="" loading="lazy" className="h-full w-full object-cover" />
            </span>
          )}
          <b className="mr-auto">{j.title}</b>
          <StatusChip status={j.status} />
          <span className="text-slate-500">{j.category} · {baht(j.budget)}{j.province ? ` · ${j.province}` : ""}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading, openAuth } = useAuth();
  const [sme, setSme] = useState<Job[]>([]);
  const [firm, setFirm] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetch("/api/jobs-sme?mine=1").then((x) => x.json()),
      fetch("/api/jobs-firm?mine=1").then((x) => x.json()),
    ]).then(([a, b]: any) => {
      setSme(a.data || []);
      setFirm(b.data || []);
    }).finally(() => setLoading(false));
  }, [authLoading, user]);

  // ยังไม่ login → login wall (ไม่โชว์งานของทุกคนเป็น "ของฉัน")
  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-md rounded-card border bg-white p-6 text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl" aria-hidden>🔒</span>
        <h1 className="mt-3 text-2xl font-bold">งานของฉัน</h1>
        <p className="mt-1 text-sm text-slate-500">เข้าสู่ระบบก่อนดูงานที่คุณโพสต์ — สมัครฟรี 30 วินาที</p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <button onClick={() => openAuth("login")}
            className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
            เข้าสู่ระบบ
          </button>
          <button onClick={() => openAuth("register")}
            className="rounded-full border px-6 py-3 text-sm font-semibold hover:border-primary-300 hover:bg-primary-50">
            สมัครฟรี
          </button>
        </div>
      </div>
    );
  }

  const open = [...sme, ...firm].filter((j) => j.status === "open").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">งานของฉัน</h1>
          <p className="mt-1 text-sm text-slate-500" role="status">
            {loading ? "กำลังโหลด…" : `งานเปิดรับของคุณ ${open} งาน`}
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
          title="คุณยังไม่มีงานที่โพสต์"
          hint="โพสต์งานแรกฟรี — ใช้เวลาไม่ถึงนาที firm/talent verified จะเห็นทันที"
          action={<Link to="/post-job" className="rounded-full bg-primary-600 shadow-cta px-4 py-2 text-sm font-semibold text-white">โพสต์งานแรก</Link>}
        />
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="font-bold">A · งาน SME หา firm ({sme.length})</h2>
            <JobList jobs={sme} jobType="sme" emptyHint="ยังไม่มีงานฝั่ง SME ของคุณ — โพสต์งานแรกได้เลย" />
          </section>
          <section className="space-y-2">
            <h2 className="font-bold">B · งาน Firm หา talent ({firm.length})</h2>
            <JobList jobs={firm} jobType="firm" emptyHint="ยังไม่มีงานฝั่ง firm ของคุณ — โพสต์งานแรกได้เลย" />
          </section>
        </>
      )}
    </div>
  );
}
