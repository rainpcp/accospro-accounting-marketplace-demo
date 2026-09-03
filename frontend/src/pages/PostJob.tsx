import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { FIRM_CATEGORIES, PROVINCES } from "../lib/data";
import { Field, inputCls } from "../components/ui";
import ImageUpload from "../components/ImageUpload";

export default function PostJob() {
  const { user, loading } = useAuth();
  const [kind, setKind] = useState<"sme" | "firm">("sme");
  const [form, setForm] = useState({ title: "", category: "ปิดงบ", budget: 5000, province: "กรุงเทพมหานคร", detail: "" });
  const [msg, setMsg] = useState("");
  const [doneId, setDoneId] = useState("");

  const submit = async () => {
    if (!form.title.trim()) { setMsg("กรอกหัวข้องานก่อน เช่น ปิดงบรายเดือนร้านอาหาร"); return; }
    setMsg("กำลังโพสต์...");
    setDoneId("");
    const r: any = await fetch(kind === "sme" ? "/api/jobs-sme" : "/api/jobs-firm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    }).then((x) => x.json());
    if (r.ok) { setDoneId(r.id); setMsg(""); }
    else setMsg(`ผิดพลาด: ${r.error}`);
  };

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 text-center">
        <h1 className="text-xl font-bold">โพสต์งานต้องเข้าสู่ระบบก่อน</h1>
        <p className="mt-2 text-sm text-slate-500">สมัครฟรี 30 วินาที เลือกบทบาท SME / สำนักงานบัญชี / ฟรีแลนซ์</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link to="/login" className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">เข้าสู่ระบบ</Link>
          <Link to="/register" className="rounded-xl border px-4 py-2 font-semibold">สมัครฟรี</Link>
        </div>
      </div>
    );
  }

  if (doneId) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl border bg-white p-6 text-center">
          <p className="text-4xl" aria-hidden>✓</p>
          <h1 className="mt-2 text-xl font-bold">โพสต์งานสำเร็จ</h1>
          <p className="mt-1 text-sm text-slate-500">รหัสงาน {doneId} · firm/talent ที่สนใจจะเข้ามาเสนอราคา</p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold">แนบรูปประกอบงาน <span className="font-normal text-slate-500">(เช่น ตัวอย่างบิล/หน้าร้าน — งานมีรูปได้ข้อเสนอเร็วกว่า)</span></h2>
          <div className="mt-3"><ImageUpload jobType={kind} jobId={doneId} /></div>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/dashboard" className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">ดูงานของฉัน</Link>
            <button onClick={() => { setDoneId(""); setForm({ ...form, title: "", detail: "" }); }} className="rounded-xl border px-4 py-2 font-semibold">โพสต์อีกงาน</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">โพสต์งานฟรี</h1>
        <p className="mt-1 text-sm text-slate-500">โพสต์วันนี้ firm/talent verified เห็นทันที ไม่มีค่าใช้จ่าย</p>
      </div>
      <div className="flex gap-2" role="group" aria-label="ประเภทงาน">
        <button onClick={() => setKind("sme")} aria-pressed={kind === "sme"}
          className={`flex-1 rounded-xl px-4 py-2.5 font-semibold ${kind === "sme" ? "bg-indigo-600 text-white" : "border bg-white"}`}>
          A · SME หา firm
        </button>
        <button onClick={() => setKind("firm")} aria-pressed={kind === "firm"}
          className={`flex-1 rounded-xl px-4 py-2.5 font-semibold ${kind === "firm" ? "bg-slate-900 text-white" : "border bg-white"}`}>
          B · Firm หา talent
        </button>
      </div>
      <div className="space-y-4 rounded-2xl border bg-white p-5">
        <Field label="หัวข้องาน">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="เช่น ปิดงบรายเดือนร้านอาหาร 2 สาขา" className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="หมวดงาน">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
              {FIRM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="งบประมาณ (บาท/เดือน)">
            <input type="number" min={0} value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className={inputCls} />
          </Field>
          <Field label="จังหวัด">
            <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className={inputCls}>
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="รายละเอียดงาน">
          <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} rows={4}
            placeholder="จำนวนบิล โปรแกรมที่ใช้ กำหนดส่ง" className={inputCls} />
        </Field>
        <button onClick={submit} className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 sm:w-auto">
          โพสต์งานเลย
        </button>
        {msg && <p className="text-sm text-rose-600" role="alert">{msg}</p>}
      </div>
    </div>
  );
}
