import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { FIRM_CATEGORIES, PROVINCES } from "../lib/data";
import { Field, PageHero, inputCls } from "../components/ui";
import ImageUpload from "../components/ImageUpload";

function Steps({ current }: { current: number }) {
  const steps = ["รายละเอียดงาน", "แนบรูป", "รับข้อเสนอ"];
  return (
    <ol className="flex items-center gap-1.5" aria-label="ขั้นตอนการโพสต์งาน">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-1.5 last:flex-none" aria-current={active ? "step" : undefined}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
              done ? "bg-emerald-500 text-white" : active ? "bg-primary-600 text-white" : "bg-slate-200 text-slate-500"}`}>
              {done ? "✓" : n}
            </span>
            <span className={`hidden text-sm font-medium sm:inline ${active ? "text-ink" : "text-slate-500"}`}>{s}</span>
            {n < steps.length && <span className="h-px flex-1 bg-slate-200" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

export default function PostJob() {
  const { user, loading, openAuth } = useAuth();
  const [kind, setKind] = useState<"sme" | "firm">("sme");
  const [form, setForm] = useState({ title: "", category: "ปิดงบ", budget: 5000, province: "กรุงเทพมหานคร", detail: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneId, setDoneId] = useState("");

  const submit = async () => {
    if (!form.title.trim()) { setMsg("กรอกหัวข้องานก่อน เช่น ปิดงบรายเดือนร้านอาหาร"); return; }
    setMsg("");
    setBusy(true);
    setDoneId("");
    try {
      const r: any = await fetch(kind === "sme" ? "/api/jobs-sme" : "/api/jobs-firm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      }).then((x) => x.json());
      if (r.ok) setDoneId(r.id);
      else setMsg(`ผิดพลาด: ${r.error}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-12">
      <PageHero badge="✦ ฟรี ไม่จำกัด" title={<>โพสต์งานบัญชี<br />ฟรีใน 1 นาที</>}
        sub="โพสต์วันนี้ firm/talent verified เห็นทันที — งานมีรูปได้ข้อเสนอเร็วกว่า" />

      <div className="mx-auto max-w-2xl px-4">
        <div className="relative z-10 -mt-16 rounded-card border border-slate-200/60 bg-white p-5 shadow-card sm:p-7">
          {!loading && !user ? (
            /* logged-out: benefit-led auth card (no dead end) */
            <div className="text-center">
              <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl" aria-hidden>📋</span>
              <h2 className="mt-3 text-xl font-extrabold text-ink">เข้าสู่ระบบเพื่อโพสต์งาน</h2>
              <p className="mt-1 text-sm text-slate-500">สมัครฟรี 30 วินาที เลือกบทบาท SME / สำนักงานบัญชี / ฟรีแลนซ์</p>
              <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-slate-600">
                {["โพสต์ฟรีไม่จำกัด ไม่มีค่าธรรมเนียม", "firm/talent verified เห็นงานทันที", "แนบรูปบิล ตัวอย่างงานได้ 5 รูป"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600" aria-hidden>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                <button onClick={() => openAuth("register")}
                  className="cta-airlume cta-lg justify-center">สมัครฟรี <span className="cta-arrow" aria-hidden>→</span></button>
                <button onClick={() => openAuth("login")}
                  className="inline-flex h-14 items-center justify-center rounded-full border border-slate-300 px-7 text-base font-semibold hover:border-primary-300 hover:bg-primary-50">
                  เข้าสู่ระบบ
                </button>
              </div>
            </div>
          ) : doneId ? (
            /* step 2-3: success + attach */
            <div className="text-center">
              <Steps current={2} />
              <p className="mx-auto mt-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-3xl" aria-hidden>✓</p>
              <h2 className="mt-3 text-xl font-extrabold text-ink">โพสต์งานสำเร็จ</h2>
              <p className="mt-1 text-sm text-slate-500">รหัสงาน {doneId} · firm/talent ที่สนใจจะเข้ามาเสนอราคา</p>
              <div className="mt-5 rounded-card bg-slate-50 p-4 text-left">
                <h3 className="font-bold text-ink">แนบรูปประกอบงาน</h3>
                <p className="text-sm text-slate-500">เช่น ตัวอย่างบิล หน้าร้าน — งานมีรูปได้ข้อเสนอเร็วกว่า</p>
                <div className="mt-3"><ImageUpload jobType={kind} jobId={doneId} /></div>
              </div>
              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                <Link to="/dashboard" className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-cta hover:bg-primary-700">ดูงานของฉัน</Link>
                <button onClick={() => { setDoneId(""); setForm({ ...form, title: "", detail: "" }); }}
                  className="rounded-full border border-slate-300 px-6 py-3 font-semibold hover:border-primary-300 hover:bg-primary-50">โพสต์อีกงาน</button>
              </div>
            </div>
          ) : (
            /* step 1: form */
            <div>
              <Steps current={1} />
              <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1" role="group" aria-label="ประเภทงาน">
                <button onClick={() => setKind("sme")} aria-pressed={kind === "sme"}
                  className={`rounded-full py-2.5 text-sm font-semibold ${kind === "sme" ? "bg-white text-ink shadow" : "text-slate-500 hover:text-ink"}`}>
                  A · SME หา firm
                </button>
                <button onClick={() => setKind("firm")} aria-pressed={kind === "firm"}
                  className={`rounded-full py-2.5 text-sm font-semibold ${kind === "firm" ? "bg-white text-ink shadow" : "text-slate-500 hover:text-ink"}`}>
                  B · Firm หา talent
                </button>
              </div>
              <div className="mt-5 space-y-4">
                <Field label="หัวข้องาน">
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="เช่น ปิดงบรายเดือนร้านอาหาร 2 สาขา" className={`${inputCls} py-3`} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="หมวดงาน">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputCls} py-3`}>
                      {FIRM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="งบ (บาท/เดือน)">
                    <input type="number" min={0} value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className={`${inputCls} py-3`} />
                  </Field>
                  <Field label="จังหวัด">
                    <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className={`${inputCls} py-3`}>
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="รายละเอียดงาน">
                  <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} rows={4}
                    placeholder="จำนวนบิล โปรแกรมที่ใช้ กำหนดส่ง" className={inputCls} />
                </Field>
                <button onClick={submit} disabled={busy}
                  className="cta-airlume cta-lg w-full justify-center disabled:opacity-60">
                  {busy ? "กำลังโพสต์…" : "โพสต์งานเลย"} {!busy && <span className="cta-arrow" aria-hidden>→</span>}
                </button>
                {msg && <p className="text-sm text-rose-600" role="alert">{msg}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
