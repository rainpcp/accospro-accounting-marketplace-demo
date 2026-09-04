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

/* ปุ่ม Sign in with Google (official GIS button) — โชว์เฉพาะเมื่อ backend ตั้งค่าแล้ว */
export default function GoogleButton({ role }: { role: string }) {
  const nav = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef(role);
  roleRef.current = role;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg: any = await fetch("/api/auth/config").then((x) => x.json());
        if (!cfg.googleClientId || cancelled) return;
        await loadGsi();
        if (cancelled) return;
        const google = window.google;
        google.accounts.id.initialize({
          client_id: cfg.googleClientId,
          callback: async (resp: any) => {
            setError("");
            try {
              const r: any = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ credential: resp.credential, role: roleRef.current }),
              }).then((x) => x.json());
              if (r.ok) nav("/dashboard");
              else setError(r.error || "Google login ไม่สำเร็จ");
            } catch {
              setError("เชื่อมต่อ Google ไม่สำเร็จ");
            }
          },
          auto_select: false,
        });
        if (boxRef.current) {
          google.accounts.id.renderButton(boxRef.current, {
            theme: "outline",
            size: "large",
            width: Math.max(boxRef.current.clientWidth || 300, 200),
            text: "continue_with",
          });
        }
        setReady(true);
      } catch {
        /* GIS โหลดไม่ได้ → ซ่อนปุ่ม เงียบๆ */
      }
    })();
    return () => { cancelled = true; };
  }, [nav]);

  if (!ready) return null;

  return (
    <div>
      <div className="my-4 flex items-center gap-3 text-xs text-slate-400" aria-hidden>
        <span className="h-px flex-1 bg-slate-200" />
        หรือเข้าด้วย
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div ref={boxRef} className="flex justify-center" />
      {error && <p className="mt-2 text-center text-sm text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
