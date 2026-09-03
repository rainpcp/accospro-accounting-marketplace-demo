import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white">
        <p className="text-sm opacity-80">ส่วนเสริมของ accospro.app · ภาษาไทย</p>
        <h1 className="mt-2 text-3xl font-bold leading-snug">ตลาดบัญชีไทย — จ้างง่าย งานเข้าระบบ AccOS Pro ทันที</h1>
        <p className="mt-2 max-w-2xl text-white/85">
          A: SME หาสำนักงานบัญชีที่ใช้ AccOS Pro · B: สำนักงานบัญชีหาฟรีแลนซ์มาช่วยเคลียร์งานค้าง — เอกสารเข้า queue AI ร่างรายการรอตรวจเหมือนเดิม
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/find-firm" className="rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700">A · หาสำนักงานบัญชี</Link>
          <Link to="/find-talent" className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">B · หาทีมช่วยงาน</Link>
          <Link to="/post-job" className="rounded-xl border border-white/40 px-5 py-3">โพสต์งานฟรี</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="font-bold">A · SME → Firm</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>ค้นหาตามจังหวัด / ประเภทงาน / งบ</li>
            <li>โปรไฟล์ verify DBD + CPA + ใช้ AccOS Pro</li>
            <li>โพสต์งาน → รับข้อเสนอ → จ้าง → งานเข้าระบบ</li>
          </ul>
          <Link to="/find-firm" className="mt-4 inline-block text-sm font-semibold text-indigo-600">ค้นหาสำนักงานบัญชี →</Link>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="font-bold">B · Firm → Talent</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>หาคนช่วยกระทบยอด / ปิดงบ / ยื่นภาษี</li>
            <li>เรทรายเดือนชัดเจน + คะแนนรีวิว</li>
            <li>assign งานข้ามทีมใน workspace เดิม</li>
          </ul>
          <Link to="/find-talent" className="mt-4 inline-block text-sm font-semibold text-indigo-600">ค้นหาทีมช่วยงาน →</Link>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
        <b>Deploy ฟรี:</b> Workers (100k req/วัน) + D1 (5GB) + R2 (10GB) · API: <code>/api/health</code> · ถ้ายังไม่ migrate D1 ระบบจะใช้ mock data ให้ demo ได้ทันที
      </section>
    </div>
  );
}
