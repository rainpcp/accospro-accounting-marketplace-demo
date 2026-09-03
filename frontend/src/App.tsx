import { useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import FindFirm from "./pages/FindFirm";
import FindTalent from "./pages/FindTalent";
import Jobboard from "./pages/Jobboard";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./lib/auth";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`;

function DesktopNav() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="ml-auto hidden items-center gap-1 text-sm md:flex" aria-label="หลัก">
      <NavLink to="/jobboard" className={linkCls}>Jobboard</NavLink>
      <NavLink to="/find-firm" className={linkCls}>A · หาสำนักงานบัญชี</NavLink>
      <NavLink to="/find-talent" className={linkCls}>B · หาทีมช่วยงาน</NavLink>
      <NavLink to="/post-job" className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-700">โพสต์งานฟรี</NavLink>
      {user ? (
        <>
          <NavLink to="/dashboard" className={linkCls}>งานของฉัน</NavLink>
          <span className="hidden px-2 text-slate-500 lg:inline">{user.name} · {user.role}</span>
          <button onClick={async () => { await logout(); nav("/"); }} className="rounded-lg border px-3 py-2 text-slate-600 hover:bg-slate-100">ออก</button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkCls}>เข้าสู่ระบบ</NavLink>
          <NavLink to="/register" className="rounded-lg bg-indigo-50 px-3 py-2 font-semibold text-indigo-700">สมัครฟรี</NavLink>
        </>
      )}
    </nav>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const go = (to: string) => () => { setOpen(false); nav(to); };
  return (
    <div className="ml-auto md:hidden">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="เมนู"
        className="grid h-10 w-10 place-items-center rounded-xl border text-xl">
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute inset-x-4 top-16 z-20 space-y-1 rounded-2xl border bg-white p-3 shadow-xl">
          {[
            ["/jobboard", "Jobboard"],
            ["/find-firm", "A · หาสำนักงานบัญชี"],
            ["/find-talent", "B · หาทีมช่วยงาน"],
            ["/post-job", "โพสต์งานฟรี"],
            ...(user ? [["/dashboard", "งานของฉัน"] as const] : [["/login", "เข้าสู่ระบบ"] as const, ["/register", "สมัครฟรี"] as const]),
          ].map(([to, label]) => (
            <button key={to} onClick={go(to)} className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-slate-100">
              {label}
            </button>
          ))}
          {user && (
            <button onClick={async () => { await logout(); setOpen(false); nav("/"); }}
              className="block w-full rounded-xl px-4 py-3 text-left text-slate-500 hover:bg-slate-100">
              ออกจากระบบ ({user.name})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function BottomNav() {
  const item = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]";
  const active = ({ isActive }: { isActive: boolean }) => `${item} ${isActive ? "text-indigo-700" : "text-slate-500"}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-white/95 backdrop-blur md:hidden" aria-label="ล่าง">
      <div className="flex">
        <NavLink to="/" className={active}><span className="text-lg" aria-hidden>⌂</span>หน้าแรก</NavLink>
        <NavLink to="/jobboard" className={active}><span className="text-lg" aria-hidden>▦</span>งาน</NavLink>
        <NavLink to="/post-job" className={active}><span className="text-lg" aria-hidden>+</span>โพสต์งาน</NavLink>
        <NavLink to="/find-firm" className={active}><span className="text-lg" aria-hidden>🏢</span>หา firm</NavLink>
        <NavLink to="/dashboard" className={active}><span className="text-lg" aria-hidden>▤</span>งานฉัน</NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 md:pb-0">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
            <Link to="/" className="flex items-center gap-2 font-bold" aria-label="AccOS Pro Marketplace หน้าแรก">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">A</span>
              <span>AccOS Pro <span className="hidden font-normal text-slate-500 sm:inline">Marketplace</span></span>
            </Link>
            <DesktopNav />
            <MobileMenu />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobboard" element={<Jobboard />} />
            <Route path="/jobs/:type/:id" element={<JobDetail />} />
            <Route path="/find-firm" element={<FindFirm />} />
            <Route path="/find-talent" element={<FindTalent />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="border-t bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm md:grid-cols-3">
            <div>
              <p className="font-bold">AccOS Pro Marketplace</p>
              <p className="mt-1 text-slate-500">ตลาดบัญชีไทย — ส่วนเสริมของ accospro.app เชื่อมงานเอกสารเข้า Agentic AI โดยตรง</p>
            </div>
            <div>
              <p className="font-bold">เริ่มใช้งาน</p>
              <ul className="mt-1 space-y-1 text-slate-500">
                <li><Link to="/jobboard" className="hover:text-indigo-600">Jobboard รวมงานบัญชี</Link></li>
                <li><Link to="/find-firm" className="hover:text-indigo-600">SME หาสำนักงานบัญชี</Link></li>
                <li><Link to="/find-talent" className="hover:text-indigo-600">สำนักงานบัญชีหาทีม</Link></li>
                <li><Link to="/post-job" className="hover:text-indigo-600">โพสต์งานฟรี</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold">ความมั่นใจ</p>
              <ul className="mt-1 space-y-1 text-slate-500">
                <li>✓ ตรวจ DBD + ใบอนุญาต CPA/TA</li>
                <li>✓ รีวิวจากงานจริง</li>
                <li>✓ รองรับ PDPA — ข้อมูลอยู่ใน Cloudflare APAC</li>
              </ul>
            </div>
          </div>
        </footer>

        <BottomNav />
      </div>
    </AuthProvider>
  );
}
