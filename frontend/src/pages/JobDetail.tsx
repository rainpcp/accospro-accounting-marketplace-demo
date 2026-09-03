import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { baht, fmtDateTime } from "../lib/data";
import { useAuth } from "../lib/auth";
import { Chip, Field, StatusChip, inputCls } from "../components/ui";

type Detail = {
  id: string; jobType: string; title: string; category: string; budget: number;
  province?: string; detail?: string; status: string; created_at?: number;
  images: { id: string; url: string }[]; proposals: number;
};

export default function JobDetail() {
  const { type, id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", message: "" });
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const load = async () => {
    setLoading(true);
    const r: any = await fetch(`/api/jobs/${type}/${id}`).then((x) => x.json());
    if (r.data) setJob(r.data);
    else setNotFound(true);
    setLoading(false);
  };
  useEffect(() => { load(); }, [type, id]);

  const submit = async () => {
    setMsg("");
    if (!form.name.trim() || !form.price) { setMsg("กรอกชื่อ + ราคาที่เสนอ"); return; }
    const r: any = await fetch("/api/proposals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobType: type, jobId: id, providerName: form.name.trim(), price: Number(form.price), message: form.message }),
    }).then((x) => x.json());
    if (r.ok) { setSent(true); load(); }
    else setMsg(r.error || "ส่งข้อเสนอไม่สำเร็จ");
  };

  if (loading) return <p className="text-sm text-slate-500">กำลังโหลดงาน…</p>;
  if (notFound || !job)
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 text-center">
        <h1 className="text-xl font-bold">ไม่พบงานนี้</h1>
        <p className="mt-1 text-sm text-slate-500">งานอาจถูกปิดไปแล้ว ลองดูงานอื่นใน Jobboard</p>
        <Link to="/jobboard" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">← กลับ Jobboard</Link>
      </div>
    );

  return (
    <div className="space-y-4">
      <Link to="/jobboard" className="text-sm text-slate-500 hover:text-primary-600">← กลับ Jobboard</Link>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={job.status} />
              <Chip>{job.category}</Chip>
              <Chip tone="brand">{job.jobType === "sme" ? "SME จ้าง" : "บริษัทจ้าง"}</Chip>
              {job.province && <span className="text-sm text-slate-500">{job.province}</span>}
            </div>
            <h1 className="mt-2 text-2xl font-bold">{job.title}</h1>
            <p className="mt-1 text-sm text-slate-500">ลงเมื่อ {fmtDateTime(job.created_at)} · เสนอแล้ว {job.proposals} ข้อเสนอ</p>
            {job.detail && <p className="mt-4 whitespace-pre-line text-slate-700">{job.detail}</p>}
            {job.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.images.map((im) => (
                  <a key={im.id} href={im.url} target="_blank" rel="noreferrer"
                    className="block h-24 w-24 overflow-hidden rounded-xl border hover:ring-2 hover:ring-primary-300">
                    <img src={im.url} alt="รูปประกอบงาน" loading="lazy" className="h-full w-full object-cover" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 lg:sticky lg:top-20">
            <p className="text-sm text-slate-500">งบประมาณ</p>
            <p className="text-3xl font-bold text-primary-700">{baht(job.budget)}</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <b className="text-slate-900">จ้างอย่างมั่นใจ:</b> เริ่มจากงานเล็กก่อนได้
              มีปัญหารายงานผ่านแพลตฟอร์มได้ตลอด
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="font-bold">ยื่นข้อเสนอ ({job.proposals})</h2>
            {!user ? (
              <p className="mt-2 text-sm text-slate-500">
                <Link to="/login" className="font-semibold text-primary-600">เข้าสู่ระบบ</Link> ก่อนยื่นข้อเสนอ
              </p>
            ) : sent ? (
              <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-200" role="status">
                ✓ ส่งข้อเสนอแล้ว ผู้จ้างจะติดต่อกลับถ้าสนใจ
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <Field label="ชื่อ / บริษัทของคุณ">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="เช่น สำนักงานบัญชี…" />
                </Field>
                <Field label="ราคาเสนอ (บาท)">
                  <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="เช่น 5000" />
                </Field>
                <Field label="ข้อความถึงผู้จ้าง">
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className={inputCls} placeholder="ประสบการณ์ + เริ่มงานได้เมื่อไหร่" />
                </Field>
                <button onClick={submit} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700">
                  ยื่นข้อเสนอ
                </button>
                {msg && <p className="text-sm text-rose-600" role="alert">{msg}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
