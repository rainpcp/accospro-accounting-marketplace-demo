import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sme" });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    setMsg("กำลังสมัคร...");
    const r = await register(form);
    if (r.ok) nav("/dashboard");
    else setMsg(r.error || "สมัครไม่สำเร็จ");
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">สมัครใช้งานฟรี</h1>
      <div className="space-y-3 rounded-2xl border bg-white p-5">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ชื่อ / ชื่อบริษัท" className="w-full rounded-xl border px-4 py-2" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="อีเมล" type="email" className="w-full rounded-xl border px-4 py-2" />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="รหัสผ่าน ≥ 8 ตัว" type="password" className="w-full rounded-xl border px-4 py-2" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border px-4 py-2">
          <option value="sme">SME — หาสำนักงานบัญชี</option>
          <option value="firm">สำนักงานบัญชี — รับงาน + หาทีม</option>
          <option value="talent">ฟรีแลนซ์ — รับงานจาก firm</option>
        </select>
        <button onClick={submit} className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-white">สมัครเลย</button>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
        <p className="text-sm text-slate-500">มีบัญชีแล้ว? <Link to="/login" className="font-semibold text-indigo-600">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}
