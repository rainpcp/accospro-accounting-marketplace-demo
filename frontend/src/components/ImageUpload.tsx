import { useEffect, useState } from "react";

type Props = { jobType: "sme" | "firm"; jobId: string };
const MAX = 5;

export default function ImageUpload({ jobType, jobId }: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    fetch(`/api/images?jobType=${jobType}&jobId=${encodeURIComponent(jobId)}`)
      .then((x) => x.json())
      .then((r: any) => setUrls((r.data || []).map((d: any) => d.url)))
      .catch(() => {});
  }, [jobType, jobId]);

  const pick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    if (urls.length + files.length > MAX) { setError(`แนบได้สูงสุด ${MAX} รูป`); return; }
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) { setError("รับเฉพาะ JPG/PNG/WebP/GIF"); continue; }
        if (f.size > 5 * 1024 * 1024) { setError(`"${f.name}" ใหญ่เกิน 5MB`); continue; }
        const fd = new FormData();
        fd.set("file", f);
        fd.set("jobType", jobType);
        fd.set("jobId", jobId);
        const r: any = await fetch("/api/upload", { method: "POST", body: fd }).then((x) => x.json());
        if (r.ok && r.url) setUrls((u) => [...u, r.url]);
        else if (r.mock) { setUnavailable(true); break; }
        else setError(r.error || "อัปโหลดไม่สำเร็จ");
      }
    } finally {
      setBusy(false);
    }
  };

  if (unavailable)
    return <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
      ระบบรูปภาพ (R2) ยังไม่เปิด — แอดมินเปิดใน Cloudflare Dashboard → R2 → Enable ก่อน
    </p>;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {urls.map((u) => (
          <a key={u} href={u} target="_blank" rel="noreferrer" className="block h-20 w-20 overflow-hidden rounded-xl border hover:ring-2 hover:ring-primary-300">
            <img src={u} alt="รูปแนบงาน" loading="lazy" className="h-full w-full object-cover" />
          </a>
        ))}
        {urls.length < MAX && (
          <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border border-dashed text-2xl text-slate-400 hover:border-primary-400 hover:text-primary-500">
            <span aria-hidden>{busy ? "…" : "+"}</span>
            <span className="sr-only">แนบรูป (JPG/PNG/WebP ไม่เกิน 5MB)</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple
              className="hidden" disabled={busy} onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
          </label>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">แนบรูปได้ {urls.length}/{MAX} · เก็บใน Cloudflare R2</p>
      {error && <p className="mt-1 text-sm text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
