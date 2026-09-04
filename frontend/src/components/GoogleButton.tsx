import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google?: any;
  }
}

let gsiLoading: Promise<void> | null = null;
function loadGsi(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiLoading) {
    gsiLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("gsi-load-fail"));
      document.head.appendChild(s);
    });
  }
  return gsiLoading;
}

function GLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.3 3.5 2.7.2.1c2.2-2 3.8-5 3.8-9.1z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.3.1-2.9 2.3-.1.2C3.9 21.3 7.7 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.3-2.9-2.2-.1.1C.7 8.9 0 10.3 0 12s.7 3.1 2.1 4.8l3.1-2.4z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.7 0 3.9 2.7 2.1 7.2l3.1 2.5c1-2.9 3.7-5 6.8-5z" />
    </svg>
  );
}

/* ปุ่ม Google ของเราเอง (มองเห็นเสมอ) → เรียก One Tap popup เอง */
export default function GoogleButton({ role }: { role: string }) {
  const nav = useNavigate();
  const roleRef = useRef(role);
  roleRef.current = role;
  const [clientId, setClientId] = useState<string | null>(null);
  const [gisReady, setGisReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg: any = await fetch("/api/auth/config").then((x) => x.json());
        if (!cfg.googleClientId || cancelled) return;
        setClientId(cfg.googleClientId);
        await loadGsi();
        if (!cancelled) setGisReady(true);
      } catch {
        /* เน็ตบล็อก google → ซ่อนปุ่ม */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!clientId) return null;

  const finish = async (credential: string) => {
    setError("");
    try {
      const r: any = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ credential, role: roleRef.current }),
      }).then((x) => x.json());
      if (r.ok) nav("/dashboard");
      else setError(r.error || "Google login ไม่สำเร็จ");
    } catch {
      setError("เชื่อมต่อ Google ไม่สำเร็จ");
    } finally {
      setWaiting(false);
    }
  };

  const start = async () => {
    setError("");
    if (!gisReady) return;
    setWaiting(true);
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: any) => {
          if (resp?.credential) finish(resp.credential);
          else {
            setWaiting(false);
            setError("ยกเลิกการเลือกบัญชี Google แล้ว");
          }
        },
        auto_select: false,
      });
      window.google.accounts.id.prompt((moment: any) => {
        if (moment.isNotDisplayed() || moment.isSkippedMoment()) {
          setWaiting(false);
          const reason = String(moment.getNotDisplayedReason?.() || moment.getSkippedReason?.() || "");
          // config ผิดจริง (แก้ที่ console) vs เบราว์เซอร์บล็อก (แก้ที่คนใช้)
          if (/invalid_client|missing_client|unregistered_origin/i.test(reason)) {
            setError("ตั้งค่า Google Client ผิด — แจ้งแอดมิน");
          } else if (/user_cancel|tap_outside|dismiss/i.test(reason)) {
            setError("ปิดหน้าต่าง Google แล้ว — กดปุ่มอีกครั้งเพื่อลองใหม่");
          } else {
            // FedCM โดนบล็อก/cooldown หลังเคยกดปิด — เปิด third-party sign-in ใหม่
            setError("Chrome บล็อก Third-party sign-in — กดไอคอนซ้ายของช่อง URL → เปิด Third-party sign-in แล้วรีเฟรชหน้า");
          }
        }
        // ถ้าแสดงสำเร็จ รอ callback (user เลือกบัญชี) — ค้าง waiting ไว้
      });
      // safety: ปลด waiting ถ้าไม่มีอะไรเกิดขึ้นใน 2 นาที
      setTimeout(() => setWaiting(false), 120000);
    } catch {
      setWaiting(false);
      setError("เปิด Google ไม่สำเร็จ — ลองใหม่อีกครั้ง");
    }
  };

  return (
    <div>
      <div className="my-4 flex items-center gap-3 text-xs text-slate-400" aria-hidden>
        <span className="h-px flex-1 bg-slate-200" />
        หรือเข้าด้วย
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <button onClick={start} disabled={!gisReady || waiting}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white text-base font-semibold text-ink shadow-sm transition hover:border-slate-400 hover:shadow disabled:cursor-wait disabled:opacity-70">
        <GLogo />
        {waiting ? "กำลังรอ Google…" : gisReady ? "ดำเนินการต่อด้วย Google" : "กำลังโหลด Google…"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
