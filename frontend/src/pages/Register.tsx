import { Navigate, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthModal";
import { useAuth } from "../lib/auth";

export default function Register() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  // login อยู่แล้ว → กลับ dashboard (ไม่โชว์ฟอร์มซ้ำ)
  if (!loading && user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">สมัครใช้งานฟรี</h1>
        <p className="mt-1 text-sm text-slate-500">30 วินาที — ไม่ต้องใช้บัตรเครดิต</p>
      </div>
      <div className="rounded-card border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
        <AuthForm mode="register" onMode={(m) => nav(m === "login" ? "/login" : "/register")} />
      </div>
    </div>
  );
}
