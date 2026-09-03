import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Field, PasswordField, inputCls } from "../components/ui";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const r = await login(email, password);
    if (r.ok) nav("/dashboard");
    else setError(r.error || "login ไม่สำเร็จ");
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>
        <p className="mt-1 text-sm text-slate-500">กลับมาจัดการงานและข้อเสนอของคุณ</p>
      </div>
      <div className="space-y-4 rounded-2xl border bg-white p-5">
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200" role="alert">{error}</p>}
        <Field label="อีเมล">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"
            placeholder="name@company.co.th" className={inputCls} />
        </Field>
        <Field label="รหัสผ่าน">
          <PasswordField value={password} onChange={setPassword} onEnter={submit} />
        </Field>
        <button onClick={submit} className="w-full rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700">
          เข้าสู่ระบบ
        </button>
        <p className="text-center text-sm text-slate-500">ยังไม่มีบัญชี? <Link to="/register" className="font-semibold text-primary-600">สมัครฟรี</Link></p>
      </div>
    </div>
  );
}
