import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  DB?: D1Database;
  DOCS?: R2Bucket;
  ASSETS?: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();
app.use("/api/*", cors());

// ---------- mock fallback (ตอนยังไม่ migrate D1 ก็ demo ได้) ----------
const MOCK_FIRMS = [
  { id: "firm-01", name: "สำนักงานบัญชี พีเอ็น กรุงเทพ", province: "กรุงเทพมหานคร", categories: ["ปิดงบ","ยื่นภาษี","เงินเดือน"], price_min: 3000, price_max: 15000, rating: 4.9, review_count: 132, dbd_verified: 1, accos_pro_user: 1, intro: "ปิดงบ SME 300+ ราย ใช้ AccOS Pro ทั้งระบบ" },
  { id: "firm-02", name: "เชียงใหม่ แอคเคาท์ติ้ง", province: "เชียงใหม่", categories: ["ปิดงบ","ยื่นภาษี"], price_min: 2500, price_max: 12000, rating: 4.8, review_count: 89, dbd_verified: 1, accos_pro_user: 1, intro: "เน้นธุรกิจท่องเที่ยว/โรงแรม" },
  { id: "firm-06", name: "นนทบุรี แอคโปร", province: "นนทบุรี", categories: ["ปิดงบ","ยื่นภาษี","กระทบยอด"], price_min: 2500, price_max: 10000, rating: 4.9, review_count: 143, dbd_verified: 1, accos_pro_user: 1, intro: "เคลียร์งานค้างไว ส่งงานตรงเวลา" },
];
const MOCK_TALENTS = [
  { id: "talent-01", name: "คุณมิ้นท์ นักบัญชีอิสระ", skills: ["กระทบยอด","ภ.พ.30","ภ.ง.ด.3/53"], province: "กรุงเทพมหานคร", rate_per_month: 12000, rating: 4.9, review_count: 52, intro: "รับเคลียร์เอกสารค้าง + กระทบยอดธนาคาร" },
  { id: "talent-03", name: "คุณแอน ภาษีเงินเดือน", skills: ["เงินเดือน","ประกันสังคม","ภ.ง.ด.1"], province: "เชียงใหม่", rate_per_month: 10000, rating: 4.9, review_count: 44, intro: "เงินเดือน 100+ พนักงาน" },
  { id: "talent-06", name: "คุณฟ้า e-Tax", skills: ["e-Tax","FlowAccount","PEAK"], province: "กรุงเทพมหานคร", rate_per_month: 13000, rating: 5.0, review_count: 27, intro: "วางระบบ e-Tax Invoice" },
];

app.get("/api/health", (c) =>
  c.json({ ok: true, service: "accospro-marketplace-demo", hasD1: !!c.env.DB, time: new Date().toISOString() })
);

// ---- A: firms ----
app.get("/api/firms", async (c) => {
  const q = (c.req.query("q") || "").toLowerCase();
  const province = c.req.query("province") || "";
  const category = c.req.query("category") || "";
  const minRating = Number(c.req.query("minRating") || 0);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    let sql = "SELECT * FROM firms WHERE 1=1";
    const params: unknown[] = [];
    if (province) { sql += " AND province = ?"; params.push(province); }
    if (q) { sql += " AND (name LIKE ? OR intro LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }
    if (category) { sql += " AND categories LIKE ?"; params.push(`%${category}%`); }
    if (minRating > 0) { sql += " AND rating >= ?"; params.push(minRating); }
    sql += " ORDER BY rating DESC LIMIT 50";
    const { results } = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json({ data: results.map((r: any) => ({ ...r, categories: JSON.parse(r.categories || "[]") })) });
  } catch {
    const data = MOCK_FIRMS.filter(
      (f) => (!province || f.province === province) && (!q || f.name.toLowerCase().includes(q))
        && (!category || f.categories.includes(category)) && f.rating >= minRating
    );
    return c.json({ data, mock: true });
  }
});

app.get("/api/firms/:id", async (c) => {
  const id = c.req.param("id");
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const row: any = await c.env.DB.prepare("SELECT * FROM firms WHERE id = ?").bind(id).first();
    if (!row) return c.json({ error: "not found" }, 404);
    return c.json({ data: { ...row, categories: JSON.parse(row.categories || "[]") } });
  } catch {
    const f = MOCK_FIRMS.find((x) => x.id === id);
    if (!f) return c.json({ error: "not found" }, 404);
    return c.json({ data: f, mock: true });
  }
});

// ---- B: talents ----
app.get("/api/talents", async (c) => {
  const q = (c.req.query("q") || "").toLowerCase();
  const province = c.req.query("province") || "";
  const skill = c.req.query("skill") || "";
  const minRating = Number(c.req.query("minRating") || 0);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    let sql = "SELECT * FROM talents WHERE 1=1";
    const params: unknown[] = [];
    if (province) { sql += " AND province = ?"; params.push(province); }
    if (q) { sql += " AND (name LIKE ? OR intro LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }
    if (skill) { sql += " AND skills LIKE ?"; params.push(`%${skill}%`); }
    if (minRating > 0) { sql += " AND rating >= ?"; params.push(minRating); }
    sql += " ORDER BY rating DESC LIMIT 50";
    const { results } = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json({ data: results.map((r: any) => ({ ...r, skills: JSON.parse(r.skills || "[]") })) });
  } catch {
    const data = MOCK_TALENTS.filter(
      (t) => (!province || t.province === province) && (!q || t.name.toLowerCase().includes(q))
        && (!skill || t.skills.includes(skill)) && t.rating >= minRating
    );
    return c.json({ data, mock: true });
  }
});

// ---- jobs (cover = รูปแรกของงาน, proposals = จำนวนข้อเสนอ) ----
const COVER_SQL = `(SELECT '/api/files/' || r2_key FROM images WHERE owner_type = ? AND owner_id = %s ORDER BY rowid LIMIT 1) AS cover`;
const COUNT_SQL = `(SELECT COUNT(*) FROM proposals WHERE job_type = ? AND job_id = %s) AS proposals`;

app.get("/api/jobs-sme", async (c) => {
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const sql = `SELECT *, ${COVER_SQL.replace("%s", "jobs_sme.id")}, ${COUNT_SQL.replace("%s", "jobs_sme.id")} FROM jobs_sme ORDER BY rowid DESC LIMIT 50`;
    const { results } = await c.env.DB.prepare(sql).bind("sme", "sme").all();
    return c.json({ data: results });
  } catch {
    return c.json({ data: [
      { id: "job-sme-01", title: "หาสำนักงานบัญชีปิดงบรายเดือน ร้านกาแฟ 2 สาขา", category: "ปิดงบ", budget: 5000, province: "กรุงเทพมหานคร", status: "open" },
      { id: "job-sme-02", title: "ยื่น ภ.พ.30 + ภ.ง.ด.3/53 รายเดือน", category: "ยื่นภาษี", budget: 3500, province: "เชียงใหม่", status: "open" },
    ], mock: true });
  }
});

app.get("/api/jobs-firm", async (c) => {
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const sql = `SELECT *, ${COVER_SQL.replace("%s", "jobs_firm.id")}, ${COUNT_SQL.replace("%s", "jobs_firm.id")} FROM jobs_firm ORDER BY rowid DESC LIMIT 50`;
    const { results } = await c.env.DB.prepare(sql).bind("firm", "firm").all();
    return c.json({ data: results });
  } catch {
    return c.json({ data: [
      { id: "job-firm-01", title: "หา freelancer กระทบยอดธนาคาร 5 บริษัท", category: "กระทบยอด", budget: 9000, status: "open" },
      { id: "job-firm-02", title: "หาคนช่วยปิดงบ Q3 จำนวน 8 งบ", category: "ปิดงบ", budget: 20000, status: "open" },
    ], mock: true });
  }
});

// รายละเอียดงานเดียว + รูป + จำนวนข้อเสนอ
app.get("/api/jobs/:type/:id", async (c) => {
  const type = c.req.param("type");
  const id = c.req.param("id");
  if (!["sme", "firm"].includes(type)) return c.json({ error: "type must be sme|firm" }, 400);
  const table = type === "sme" ? "jobs_sme" : "jobs_firm";
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const job: any = await c.env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
    if (!job) return c.json({ error: "ไม่พบงานนี้" }, 404);
    const imgs = await c.env.DB.prepare(
      "SELECT id, r2_key, content_type FROM images WHERE owner_type = ? AND owner_id = ? ORDER BY rowid"
    ).bind(type, id).all();
    const n: any = await c.env.DB.prepare(
      "SELECT COUNT(*) AS c FROM proposals WHERE job_type = ? AND job_id = ?"
    ).bind(type, id).first();
    return c.json({
      data: {
        ...job,
        jobType: type,
        images: ((imgs.results || []) as any[]).map((r) => ({ id: r.id, url: `/api/files/${r.r2_key}` })),
        proposals: Number(n?.c || 0),
      },
    });
  } catch (e: any) {
    if (e?.message === "no-d1") return c.json({ error: "ยังไม่ต่อ D1" }, 503);
    throw e;
  }
});

app.post("/api/jobs-sme", async (c) => {  const body = await c.req.json().catch(() => ({}));
  if (!body.title || !body.category) return c.json({ error: "title + category required" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const id = `job-sme-${Date.now()}`;
    await c.env.DB.prepare(
      "INSERT INTO jobs_sme (id, title, category, budget, province, detail, status) VALUES (?,?,?,?,?,?, 'open')"
    ).bind(id, body.title, body.category, Number(body.budget || 0), body.province || "กรุงเทพมหานคร", body.detail || "").run();
    return c.json({ ok: true, id });
  } catch {
    return c.json({ ok: true, id: `job-sme-${Date.now()}`, mock: true });
  }
});

app.post("/api/jobs-firm", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.title || !body.category) return c.json({ error: "title + category required" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const id = `job-firm-${Date.now()}`;
    await c.env.DB.prepare(
      "INSERT INTO jobs_firm (id, title, category, budget, detail, status) VALUES (?,?,?,?,?, 'open')"
    ).bind(id, body.title, body.category, Number(body.budget || 0), body.detail || "").run();
    return c.json({ ok: true, id });
  } catch {
    return c.json({ ok: true, id: `job-firm-${Date.now()}`, mock: true });
  }
});

app.post("/api/proposals", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.jobId || !body.providerName) return c.json({ error: "jobId + providerName required" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const id = `prop-${Date.now()}`;
    await c.env.DB.prepare(
      "INSERT INTO proposals (id, job_type, job_id, provider_id, provider_name, price, message, status) VALUES (?,?,?,?,?,?,?, 'pending')"
    ).bind(id, body.jobType || "sme", body.jobId, body.providerId || "demo", body.providerName, Number(body.price || 0), body.message || "").run();
    return c.json({ ok: true, id });
  } catch {
    return c.json({ ok: true, id: `prop-${Date.now()}`, mock: true });
  }
});

// ---------- auth: email+password + D1 session cookie (ไม่พึ่ง provider ภายนอก) ----------
const SESSION_DAYS = 30;

function hex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return hex(new Uint8Array(digest));
}

async function hashPassword(password: string): Promise<string> {
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return `${salt}$${await sha256(salt + ":" + password)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  return (await sha256(salt + ":" + password)) === hash;
}

function sessionCookie(c: any, token: string, maxAge: number): string {
  const secure = new URL(c.req.url).protocol === "https:" ? "; Secure" : "";
  return `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function getSessionToken(c: any): string | null {
  const header = c.req.header("cookie") || "";
  const m = header.match(/(?:^|;\s*)session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function getSessionUser(c: any): Promise<any | null> {
  if (!c.env.DB) return null;
  const token = getSessionToken(c);
  if (!token) return null;
  const s: any = await c.env.DB.prepare("SELECT user_id, expires_at FROM sessions WHERE token = ?").bind(token).first();
  if (!s || Number(s.expires_at) < Date.now()) return null;
  const u: any = await c.env.DB.prepare("SELECT id, role, name, email, phone FROM users WHERE id = ?").bind(s.user_id).first();
  return u || null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/auth/register", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = ["sme", "firm", "talent"].includes(body.role) ? body.role : "sme";
  if (!name || !EMAIL_RE.test(email) || password.length < 8)
    return c.json({ error: "กรอกชื่อ + อีเมลให้ถูก + รหัสผ่าน ≥ 8 ตัว" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const dup: any = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (dup) return c.json({ error: "อีเมลนี้สมัครแล้ว ลอง login" }, 409);
    const id = `u-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
    await c.env.DB.prepare(
      "INSERT INTO users (id, role, name, email, phone, password_hash) VALUES (?,?,?,?,?,?)"
    ).bind(id, role, name, email, String(body.phone || ""), await hashPassword(password)).run();
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    await c.env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)")
      .bind(token, id, Date.now() + SESSION_DAYS * 86400 * 1000).run();
    c.header("Set-Cookie", sessionCookie(c, token, SESSION_DAYS * 86400));
    return c.json({ ok: true, user: { id, role, name, email } });
  } catch (e: any) {
    if (e?.message === "no-d1") return c.json({ ok: true, mock: true, note: "ยังไม่ต่อ D1" });
    throw e;
  }
});

app.post("/api/auth/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!EMAIL_RE.test(email) || !password) return c.json({ error: "กรอกอีเมล + รหัสผ่าน" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const u: any = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (!u?.password_hash || !(await verifyPassword(password, u.password_hash)))
      return c.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, 401);
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    await c.env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)")
      .bind(token, u.id, Date.now() + SESSION_DAYS * 86400 * 1000).run();
    c.header("Set-Cookie", sessionCookie(c, token, SESSION_DAYS * 86400));
    return c.json({ ok: true, user: { id: u.id, role: u.role, name: u.name, email: u.email } });
  } catch (e: any) {
    if (e?.message === "no-d1") return c.json({ error: "ยังไม่ต่อ D1" }, 503);
    throw e;
  }
});

app.post("/api/auth/logout", async (c) => {
  try {
    const token = getSessionToken(c);
    if (c.env.DB && token) await c.env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  } catch { /* ignore */ }
  c.header("Set-Cookie", sessionCookie(c, "", 0));
  return c.json({ ok: true });
});

app.get("/api/auth/me", async (c) => {
  const user = await getSessionUser(c).catch(() => null);
  if (!user) return c.json({ user: null });
  return c.json({ user });
});

// ---------- รูปแนบงาน: ไฟล์จริงใน Cloudflare R2 (ฟรี 10GB, ไม่มีค่า egress) ----------
const ALLOW_IMG = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMG_BYTES = 5 * 1024 * 1024; // 5MB/รูป
const MAX_IMG_PER_JOB = 5;

app.post("/api/upload", async (c) => {
  if (!c.env.DB || !c.env.DOCS)
    return c.json({ ok: false, mock: true, note: "เปิด R2 ใน Dashboard แล้ว bind bucket DOCS ก่อน (ดู README)" });
  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  const jobType = String(form?.get("jobType") || "");
  const jobId = String(form?.get("jobId") || "");
  if (!file || file.size === 0) return c.json({ error: "แนบไฟล์รูปก่อน" }, 400);
  if (!["sme", "firm"].includes(jobType) || !jobId) return c.json({ error: "jobType (sme|firm) + jobId ไม่ครบ" }, 400);
  if (!ALLOW_IMG.includes(file.type)) return c.json({ error: "รับเฉพาะ JPG/PNG/WebP/GIF" }, 400);
  if (file.size > MAX_IMG_BYTES) return c.json({ error: "รูปใหญ่เกิน 5MB" }, 400);
  const n: any = await c.env.DB.prepare("SELECT COUNT(*) AS c FROM images WHERE owner_type = ? AND owner_id = ?")
    .bind(jobType, jobId).first();
  if (Number(n?.c || 0) >= MAX_IMG_PER_JOB) return c.json({ error: `แนบได้สูงสุด ${MAX_IMG_PER_JOB} รูปต่องาน` }, 400);

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "img";
  const rand = [...crypto.getRandomValues(new Uint8Array(6))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const key = `jobs/${jobType}/${jobId}/${Date.now()}-${rand}-${safe}`;
  await c.env.DOCS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=86400" },
  });
  const id = `img-${Date.now().toString(36)}${rand}`;
  await c.env.DB.prepare(
    "INSERT INTO images (id, owner_type, owner_id, r2_key, content_type, size) VALUES (?,?,?,?,?,?)"
  ).bind(id, jobType, jobId, key, file.type, file.size).run();
  return c.json({ ok: true, id, url: `/api/files/${key}` });
});

// เสิร์ฟไฟล์จาก R2 ผ่าน Worker (edge cache 1 วัน)
app.get("/api/files/:key{.+}", async (c) => {
  if (!c.env.DOCS) return c.json({ error: "ยังไม่ต่อ R2" }, 503);
  const key = c.req.param("key");
  if (key.includes("..")) return c.json({ error: "bad key" }, 400);
  const obj = await c.env.DOCS.get(key);
  if (!obj) return c.json({ error: "ไม่พบไฟล์" }, 404);
  const headers: Record<string, string> = {
    "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
    "Cache-Control": "public, max-age=86400",
    ETag: obj.httpEtag,
  };
  return new Response(obj.body, { headers });
});

// รูปทั้งหมดของงานเดียว
app.get("/api/images", async (c) => {
  const jobType = c.req.query("jobType") || "";
  const jobId = c.req.query("jobId") || "";
  if (!jobType || !jobId) return c.json({ error: "jobType + jobId required" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const { results } = await c.env.DB.prepare(
      "SELECT id, r2_key, content_type FROM images WHERE owner_type = ? AND owner_id = ? ORDER BY rowid"
    ).bind(jobType, jobId).all();
    return c.json({ data: (results as any[]).map((r) => ({ id: r.id, url: `/api/files/${r.r2_key}`, contentType: r.content_type })) });
  } catch {
    return c.json({ data: [], mock: true });
  }
});

// ---------- SPA fallback: BrowserRouter direct-load/refresh (/find-talent, /find-firm, ...) ----------
// Cloudflare [assets] not_found_handling=single-page-application ควรเสิร์ฟ index.html ให้เองอยู่แล้ว
// แต่กันเหนียว: ถ้า request หลุดมาถึง Worker (no asset match) ให้เสิร์ฟ index.html เอง
// เพื่อให้ React Router ฝั่ง client รับช่วงต่อ — แทน Hono 404 เปล่าๆ
app.notFound(async (c) => {
  const url = new URL(c.req.url);
  // API ที่ไม่รู้จักคงเป็น JSON 404 เหมือนเดิม
  if (url.pathname.startsWith("/api/")) return c.json({ error: "not found" }, 404);
  try {
    if (c.env.ASSETS) {
      const res = await c.env.ASSETS.fetch(new Request(new URL("/index.html", url.origin)));
      if (res && (res.ok || res.status === 200)) {
        const headers = new Headers(res.headers);
        headers.set("Content-Type", "text/html; charset=utf-8");
        headers.set("Cache-Control", "no-cache");
        return new Response(res.body, { status: 200, headers });
      }
    }
  } catch { /* fall through */ }
  // ไม่มี ASSETS binding (เช่น wrangler dev เก่า) — ส่ง link กลับหน้าแรก
  return c.html(`<!doctype html><html lang="th"><head><meta charset="utf-8"><title>AccOS Pro Marketplace</title></head><body style="font-family:system-ui"><p>ไม่พบหน้านี้ — <a href="/">กลับหน้าแรก AccOS Pro Marketplace</a></p></body></html>`, 200);
});

export default app;
