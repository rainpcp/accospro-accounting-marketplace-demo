import { useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { AuthModal } from "./components/AuthModal";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-2 ${isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`;
const linkClsLight = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-2 ${isActive ? "bg-primary-50 text-primary-600" : "text-slate-600 hover:bg-slate-100"}`;

function DesktopNav({ dark }: { dark: boolean }) {
  const { user, logout, openAuth } = useAuth();
  const nav = useNavigate();
  const cls = dark ? linkCls : linkClsLight;
  return (
    <nav className="ml-auto hidden items-center gap-1 text-sm md:flex" aria-label="หลัก">
      <NavLink to="/jobboard" className={cls}>Jobboard</NavLink>
      <NavLink to="/find-firm" className={cls}>A · หาสำนักงานบัญชี</NavLink>
      <NavLink to="/find-talent" className={cls}>B · หาทีมช่วยงาน</NavLink>
      <NavLink to="/post-job"
        className={dark
          ? "rounded-full bg-primary-500 px-4 py-2 font-semibold text-white hover:bg-primary-600"
          : "rounded-full bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700"}>
        โพสต์งานฟรี
      </NavLink>
      {user ? (
        <>
          <NavLink to="/dashboard" className={cls}>งานของฉัน</NavLink>
          <span className={`hidden px-2 lg:inline ${dark ? "text-white/60" : "text-slate-500"}`}>{user.name} · {user.role}</span>
          <button onClick={async () => { await logout(); nav("/"); }}
            className={`rounded-full border px-3 py-2 ${dark ? "border-white/25 text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}>ออก</button>
        </>
      ) : (
        <>
          <button onClick={() => openAuth("login")}
            className={`rounded-full px-3 py-2 ${dark ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-100"}`}>เข้าสู่ระบบ</button>
          <button onClick={() => openAuth("register")}
            className={dark
              ? "rounded-full bg-white px-4 py-2 font-semibold text-navy-950 hover:bg-white/90"
              : "rounded-full bg-primary-50 px-4 py-2 font-semibold text-primary-600"}>สมัครฟรี</button>
        </>
      )}
    </nav>
  );
}

function MobileMenu({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false);
  const { user, logout, openAuth } = useAuth();
  const nav = useNavigate();
  const go = (to: string) => () => { setOpen(false); nav(to); };
  const auth = (m: "login" | "register") => () => { setOpen(false); openAuth(m); };
  return (
    <div className="ml-auto md:hidden">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="เมนู"
        className={`grid h-10 w-10 place-items-center rounded-xl border text-xl ${dark ? "border-white/25 text-white" : ""}`}>
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute inset-x-4 top-16 z-20 space-y-1 rounded-card border bg-white p-3 shadow-card">
          {[
            ["/jobboard", "Jobboard"],
            ["/find-firm", "A · หาสำนักงานบัญชี"],
            ["/find-talent", "B · หาทีมช่วยงาน"],
            ["/post-job", "โพสต์งานฟรี"],
            ...(user ? [["/dashboard", "งานของฉัน"] as const] : []),
          ].map(([to, label]) => (
            <button key={to} onClick={go(to)} className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-slate-100">
              {label}
            </button>
          ))}
          {!user && (
            <>
              <button onClick={auth("login")} className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-slate-100">
                เข้าสู่ระบบ
              </button>
              <button onClick={auth("register")} className="block w-full rounded-xl bg-primary-50 px-4 py-3 text-left font-semibold text-primary-600">
                สมัครฟรี
              </button>
            </>
          )}
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
  const { user, openAuth } = useAuth();
  const item = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]";
  const active = ({ isActive }: { isActive: boolean }) => `${item} ${isActive ? "text-primary-600" : "text-slate-500"}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-white/95 backdrop-blur md:hidden" aria-label="ล่าง">
      <div className="flex">
        <NavLink to="/" className={active}><span className="text-lg" aria-hidden>⌂</span>หน้าแรก</NavLink>
        <NavLink to="/jobboard" className={active}><span className="text-lg" aria-hidden>▦</span>งาน</NavLink>
        <NavLink to="/post-job" className={active}><span className="text-lg" aria-hidden>+</span>โพสต์งาน</NavLink>
        <NavLink to="/find-firm" className={active}><span className="text-lg" aria-hidden>🏢</span>หา firm</NavLink>
        {user ? (
          <NavLink to="/dashboard" className={active}><span className="text-lg" aria-hidden>▤</span>งานฉัน</NavLink>
        ) : (
          <button onClick={() => openAuth("login")} className={`${item} text-slate-500`}>
            <span className="text-lg" aria-hidden>▤</span>งานฉัน
          </button>
        )}
      </div>
    </nav>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-card border bg-white p-8 text-center">
      <p className="text-5xl" aria-hidden>🧭</p>
      <h1 className="mt-3 text-2xl font-bold">ไม่พบหน้านี้</h1>
      <p className="mt-1 text-sm text-slate-500">ลิงก์อาจผิดหรือหน้านี้ถูกย้ายไปแล้ว</p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <Link to="/" className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          กลับหน้าแรก
        </Link>
        <Link to="/jobboard" className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-slate-50">
          ดู Jobboard
        </Link>
      </div>
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const googleError = params.get("google_error");
  const dismissGoogleError = () => {
    params.delete("google_error");
    setParams(params, { replace: true });
  };
  const isHome = pathname === "/";
  // inner pages with their own dark hero render full-bleed (containers inside the page)
  const fullBleed = isHome || ["/jobboard", "/find-firm", "/find-talent", "/post-job"].includes(pathname);
  return (
    <div className="min-h-screen bg-light pb-20 text-ink md:pb-0">
      <header className={isHome
        ? "hero-dark absolute inset-x-0 top-0 z-10 bg-transparent"
        : "sticky top-0 z-10 border-b bg-white/90 backdrop-blur"}>
        <div className="relative mx-auto flex h-[72px] max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className={`flex items-center gap-2 font-bold ${isHome ? "text-white" : ""}`} aria-label="AccOS Pro Marketplace หน้าแรก">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 text-white">A</span>
            <span>AccOS Pro <span className={`hidden font-normal sm:inline ${isHome ? "text-white/70" : "text-slate-500"}`}>Marketplace</span></span>
          </Link>
          <DesktopNav dark={isHome} />
          <MobileMenu dark={isHome} />
        </div>
      </header>

      <main className={fullBleed ? undefined : "mx-auto max-w-6xl px-4 py-6"}>
        {googleError && (
          <div className="mx-auto max-w-6xl px-4 pt-4" role="alert">
            <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">
              {googleError}{" "}
              <button onClick={dismissGoogleError} className="ml-2 font-semibold underline">ปิด</button>
            </p>
          </div>
        )}
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
          <Route path="*" element={<NotFound />} />
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
              <li><Link to="/jobboard" className="hover:text-primary-600">Jobboard รวมงานบัญชี</Link></li>
              <li><Link to="/find-firm" className="hover:text-primary-600">SME หาสำนักงานบัญชี</Link></li>
              <li><Link to="/find-talent" className="hover:text-primary-600">สำนักงานบัญชีหาทีม</Link></li>
              <li><Link to="/post-job" className="hover:text-primary-600">โพสต์งานฟรี</Link></li>
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
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
