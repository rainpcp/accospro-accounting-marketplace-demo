import { useState } from "react";

/* ปุ่ม Google → redirect เต็มหน้าไป accounts.google.com (แบบ Fastwork, ไม่พึ่ง FedCM) */
export default function GoogleButton({ role }: { role: string }) {
  const [busy, setBusy] = useState(false);
  const [gone, setGone] = useState(false);

  const start = async () => {
    setBusy(true);
    try {
      const r: any = await fetch(
        `/api/auth/google/url?role=${encodeURIComponent(role)}&next=${encodeURIComponent("/dashboard")}`
      ).then((x) => x.json());
      if (r.url) {
        window.location.href = r.url;
        return;
      }
      setGone(true);
    } catch {
      setGone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="my-4 flex items-center gap-3 text-xs text-slate-400" aria-hidden>
        <span className="h-px flex-1 bg-slate-200" />
        หรือเข้าด้วย
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <button onClick={start} disabled={busy}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white text-base font-semibold text-ink shadow-sm transition hover:border-slate-400 hover:shadow disabled:cursor-wait disabled:opacity-70">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.3 3.5 2.7.2.1c2.2-2 3.8-5 3.8-9.1z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.3.1-2.9 2.3-.1.2C3.9 21.3 7.7 24 12 24z" />
          <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.3-2.9-2.2-.1.1C.7 8.9 0 10.3 0 12s.7 3.1 2.1 4.8l3.1-2.4z" />
          <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.7 0 3.9 2.7 2.1 7.2l3.1 2.5c1-2.9 3.7-5 6.8-5z" />
        </svg>
        {busy ? "กำลังไปหน้า Google…" : "ดำเนินการต่อด้วย Google"}
      </button>
      {gone && <p className="mt-2 text-center text-sm text-rose-600" role="alert">เปิด Google ไม่สำเร็จ — ลองใหม่อีกครั้ง</p>}
    </div>
  );
}
