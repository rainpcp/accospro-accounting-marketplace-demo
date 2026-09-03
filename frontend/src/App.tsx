import { Link, Route, Routes, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import FindFirm from "./pages/FindFirm";
import FindTalent from "./pages/FindTalent";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">A</span>
            <span>AccOS Pro <span className="font-normal text-slate-500">Marketplace</span></span>
          </Link>
          <nav className="ml-auto flex gap-1 text-sm">
            <NavLink to="/find-firm" className={({isActive}) => `rounded-lg px-3 py-2 ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>A · หาสำนักงานบัญชี</NavLink>
            <NavLink to="/find-talent" className={({isActive}) => `rounded-lg px-3 py-2 ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>B · หาทีมช่วยงาน</NavLink>
            <NavLink to="/post-job" className={({isActive}) => `rounded-lg px-3 py-2 ${isActive ? "bg-indigo-600 text-white" : "bg-slate-900 text-white hover:bg-slate-700"}`}>โพสต์งาน</NavLink>
            <NavLink to="/dashboard" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">งานของฉัน</NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-firm" element={<FindFirm />} />
          <Route path="/find-talent" element={<FindTalent />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          Demo ฟรีบน Cloudflare (Workers + D1 + R2) · เชื่อม accospro.app · ระบบหลักใช้ฟรี จ่ายเฉพาะ Agentic AI
        </div>
      </footer>
    </div>
  );
}
