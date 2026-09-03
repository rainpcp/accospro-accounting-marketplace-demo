import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Field, PasswordField, inputCls } from "../components/ui";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sme" });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (form.password.length < 8) { setError("รหัสผ่านต้อง ≥ 8 ตัว"); return; }
    const r = await register(form);
    if (r.ok) nav("/dashboard");
    else setError(r.error || "สมัครไม่สำเร็จ");
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-bold">สมัครใช้งานฟรี</h1>
        <p className="mt-1 text-sm text-slate-500">30 วินาที — ไม่ต้องใช้บัตรเครดิต</p>
      </div>
      <div className="space-y-4 rounded-2xl border bg-white p-5">
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200" role="alert">{error}</p>}
        <Field label="ชื่อ / ชื่อบริษัท">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="เช่น บริษัท ตัวอย่าง จำกัด" autoComplete="name" className={inputCls} />
        </Field>
        <Field label="อีเมล">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email" autoComplete="email" placeholder="name@company.co.th" className={inputCls} />
        </Field>
        <Field label="รหัสผ่าน">
          <PasswordField value={form.password} onChange={(v) => setForm({ ...form, password: v })} onEnter={submit} placeholder="อย่างน้อย 8 ตัวอักษร" />
        </Field>
        <Field label="สมัครในบทบาท">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
            <option value="sme">SME — หาสำนักงานบัญชี</option>
            <option value="firm">สำนักงานบัญชี — รับงาน + หาทีม</option>
            <option value="talent">ฟรีแลนซ์ — รับงานจาก firm</option>
          </select>
        </Field>
        <button onClick={submit} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700">
          สมัครเลย
        </button>
        <p className="text-center text-sm text-slate-500">มีบัญชีแล้ว? <Link to="/login" className="font-semibold text-indigo-600">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}
