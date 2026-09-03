import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    setMsg("กำลังเข้าสู่ระบบ...");
    const r = await login(email, password);
    if (r.ok) nav("/dashboard");
    else setMsg(r.error || "login ไม่สำเร็จ");
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>
      <div className="space-y-3 rounded-2xl border bg-white p-5">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล" type="email" className="w-full rounded-xl border px-4 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="รหัสผ่าน" type="password" onKeyDown={(e) => e.key === "Enter" && submit()} className="w-full rounded-xl border px-4 py-2" />
        <button onClick={submit} className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-white">เข้าสู่ระบบ</button>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
        <p className="text-sm text-slate-500">ยังไม่มีบัญชี? <Link to="/register" className="font-semibold text-indigo-600">สมัครฟรี</Link></p>
      </div>
    </div>
  );
}
