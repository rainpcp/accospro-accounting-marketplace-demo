import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FIRM_CATEGORIES, baht, fmtDateTime } from "../lib/data";
import { Chip, CtaLink, EmptyState, PageHero, SkeletonCard, StatusChip } from "../components/ui";

type Job = {
  id: string; title: string; category: string; budget: number;
  province?: string; status: string; created_at?: number; cover?: string | null;
  proposals?: number;
};

function PickCard({ job, jobType }: { job: Job; jobType: "sme" | "firm" }) {
  const who = jobType === "sme" ? "SME" : "สำนักงานบัญชี";
  return (
    <article className="feature-card flex min-w-[270px] flex-1 snap-start flex-col rounded-card border border-slate-200/80 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2 text-sm">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-100 font-bold text-primary-600" aria-hidden>
          {who[0]}
        </span>
        <span className="font-medium text-ink">{who}{job.province ? ` · ${job.province}` : ""}</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />เปิดรับงาน
        </span>
      </div>
      <Link to={`/jobs/${jobType}/${job.id}`} className="mt-3 line-clamp-2 font-bold text-ink hover:text-primary-600">
        {job.title}
      </Link>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Chip>{job.category}</Chip>
        <Chip tone="brand">{baht(job.budget)}</Chip>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="min-w-0 truncate text-sm text-slate-500">เสนอแล้ว {job.proposals ?? 0} ข้อเสนอ</span>
        <Link to={`/jobs/${jobType}/${job.id}`}
          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary-600 px-4 py-2 text-[13px] font-semibold text-white shadow-cta transition-all hover:bg-primary-700 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:px-6 sm:text-sm">
          ยื่นข้อเสนอ
        </Link>
      </div>
    </article>
  );
}

export default function Jobboard() {
  const [tab, setTab] = useState<"sme" | "firm">("sme");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"new" | "budget">("new");
  const [sme, setSme] = useState<Job[]>([]);
  const [firm, setFirm] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs-sme").then((x) => x.json()),
      fetch("/api/jobs-firm").then((x) => x.json()),
    ]).then(([a, b]: any[]) => {
      setSme(a.data || []);
      setFirm(b.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const openCount = useMemo(
    () => [...sme, ...firm].filter((j) => j.status === "open").length, [sme, firm]);

  const picks = useMemo(() => {
    const all = [...sme.map((j) => ({ ...j, t: "sme" as const })), ...firm.map((j) => ({ ...j, t: "firm" as const }))]
      .filter((j) => j.status === "open");
    return [...all].sort((a, b) => b.budget - a.budget).slice(0, 4);
  }, [sme, firm]);

  const rows = useMemo(() => {
    let list = tab === "sme" ? sme : firm;
    if (q) list = list.filter((j) => j.title.toLowerCase().includes(q.toLowerCase()));
    if (category) list = list.filter((j) => j.category === category);
    list = [...list].sort((a, b) => sort === "budget" ? b.budget - a.budget : (b.created_at || 0) - (a.created_at || 0));
    return list;
  }, [sme, firm, tab, q, category, sort]);

  return (
    <div className="pb-12">
      <PageHero badge="✦ AccOS Pro picks" title="Jobboard"
        sub={`ประกาศงานบัญชี ${openCount} งานเปิดรับ — ยื่นข้อเสนอ โปร่งใส ไม่บังราคา`}>
        <div className="mt-6 flex justify-center">
          <CtaLink to="/post-job">ลงประกาศงานฟรี</CtaLink>
        </div>
      </PageHero>

      {/* picks overlap hero */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative z-10 -mt-16">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : (
            <div className="chip-row flex snap-x gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-4">
              {picks.map((j) => <PickCard key={j.t + j.id} job={j} jobType={j.t} />)}
            </div>
          )}
        </div>

        {/* table card */}
        <section className="mt-6 rounded-card border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2" role="tablist" aria-label="ประเภทประกาศงาน">
              {(["sme", "firm"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-navy-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {t === "sme" ? "ประกาศงาน" : "ประกาศงานบริษัท"}{tab === t ? " ✓" : ""}
                </button>
              ))}
            </div>
            <Link to="/post-job" className="ml-auto rounded-full bg-navy-950 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-900">
              + ลงประกาศงาน
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-ink">{tab === "sme" ? "ประกาศงาน" : "ประกาศงานบริษัท"}</h2>
            <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหางาน…"
                aria-label="ค้นหางาน" className="rounded-xl border border-slate-300 px-4 py-2 text-[16px] sm:w-52" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="หมวดงาน"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2">
                <option value="">ทุกหมวดงาน</option>
                {FIRM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as "new" | "budget")} aria-label="เรียงตาม"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2">
                <option value="new">ล่าสุดก่อน</option>
                <option value="budget">งบสูงสุดก่อน</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-4 grid gap-2"><SkeletonCard /><SkeletonCard /></div>
          ) : rows.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="ยังไม่มีประกาศงานที่ตรงเงื่อนไข" hint="ลองล้างคำค้น/หมวด หรือเป็นคนแรกที่ลงประกาศงานนี้"
                action={<Link to="/post-job" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-cta">+ ลงประกาศงาน</Link>} />
            </div>
          ) : (
            <>
              <div className="mt-4 hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-slate-500">
                      <th className="py-2 pr-4 font-medium">งาน</th>
                      <th className="py-2 pr-4 font-medium">หมวดหมู่</th>
                      <th className="py-2 pr-4 font-medium">ประเภท</th>
                      <th className="py-2 pr-4 font-medium">งบประมาณ</th>
                      <th className="py-2 pr-4 font-medium">ข้อเสนอ</th>
                      <th className="py-2 pr-4 font-medium">เมื่อ</th>
                    </tr>
                  </thead>
                  <tbody>
                  {rows.map((j) => (
                    <tr key={j.id} className={`border-b last:border-0 hover:bg-primary-50/50 ${j.status !== "open" ? "opacity-60" : ""}`}>
                      <td className="py-3 pr-4">
                        <Link to={`/jobs/${tab}/${j.id}`} className="flex items-center gap-3 font-medium text-ink hover:text-primary-600">
                          {j.cover
                            ? <img src={j.cover} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-xl border object-cover" />
                            : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-400" aria-hidden>🗎</span>}
                          <span className="line-clamp-1">{j.title}</span>
                          {j.status !== "open" && <StatusChip status={j.status} />}
                        </Link>
                      </td>
                        <td className="py-3 pr-4 text-slate-600">{j.category}</td>
                        <td className="py-3 pr-4"><Chip>{tab === "sme" ? "SME จ้าง" : "บริษัทจ้าง"}</Chip></td>
                        <td className="py-3 pr-4 text-base font-extrabold text-primary-600">{baht(j.budget)}</td>
                        <td className="py-3 pr-4 text-slate-600">{j.proposals ?? 0}</td>
                        <td className="whitespace-nowrap py-3 pr-4 text-slate-500">{fmtDateTime(j.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid gap-3 md:hidden">
              {rows.map((j) => (
                <Link key={j.id} to={`/jobs/${tab}/${j.id}`}
                  className={`rounded-card border border-slate-200/80 bg-white p-4 shadow-soft ${j.status !== "open" ? "opacity-60" : ""}`}>
                  <p className="font-bold text-ink">{j.title} {j.status !== "open" && <StatusChip status={j.status} />}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {j.category} · <span className="font-extrabold text-primary-600">{baht(j.budget)}</span> · เสนอแล้ว {j.proposals ?? 0} · {fmtDateTime(j.created_at)}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
