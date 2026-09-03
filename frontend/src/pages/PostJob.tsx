import { useState } from "react";

export default function PostJob() {
  const [kind, setKind] = useState<"sme" | "firm">("sme");
  const [form, setForm] = useState({ title: "", category: "ปิดงบ", budget: 5000, province: "กรุงเทพมหานคร", detail: "" });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    setMsg("กำลังโพสต์...");
    const r = await fetch(kind === "sme" ? "/api/jobs-sme" : "/api/jobs-firm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    }).then((x) => x.json());
    setMsg(r.ok ? `โพสต์สำเร็จ id=${r.id}${r.mock ? " (mock)" : ""}` : `ผิดพลาด: ${r.error}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">โพสต์งานฟรี</h1>
      <div className="flex gap-2">
        <button onClick={() => setKind("sme")} className={`rounded-xl px-4 py-2 ${kind === "sme" ? "bg-indigo-600 text-white" : "bg-white border"}`}>A · SME หา firm</button>
        <button onClick={() => setKind("firm")} className={`rounded-xl px-4 py-2 ${kind === "firm" ? "bg-slate-900 text-white" : "bg-white border"}`}>B · Firm หา talent</button>
      </div>
      <div className="space-y-3 rounded-2xl border bg-white p-5">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="หัวข้องาน เช่น ปิดงบรายเดือนร้านอาหาร" className="w-full rounded-xl border px-4 py-2" />
        <div className="flex gap-2">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border px-3 py-2">
            {["ปิดงบ", "ยื่นภาษี", "เงินเดือน", "กระทบยอด", "BOI", "ตรวจสอบ"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className="w-40 rounded-xl border px-3 py-2" />
          <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="flex-1 rounded-xl border px-3 py-2" />
        </div>
        <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} rows={4} placeholder="รายละเอียดงาน จำนวนบิล โปรแกรมที่ใช้ กำหนดส่ง" className="w-full rounded-xl border px-4 py-2" />
        <button onClick={submit} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white">โพสต์งาน</button>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
      </div>
    </div>
  );
}
