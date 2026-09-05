import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createRemoteJWKSet, jwtVerify } from "jose";

type Env = {
  DB?: D1Database;
  DOCS?: R2Bucket;
  ASSETS?: Fetcher;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
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

// MOCK jobs ใช้ตอนยังไม่ต่อ D1 (รายการ + รายละเอียด)
const MOCK_JOBS_SME = [
  { id: "job-sme-01", title: "หาสำนักงานบัญชีปิดงบรายเดือน ร้านกาแฟ 2 สาขา", category: "ปิดงบ", budget: 5000, province: "กรุงเทพมหานคร", status: "open", created_at: 1760000000000 },
  { id: "job-sme-02", title: "ยื่น ภ.พ.30 + ภ.ง.ด.3/53 รายเดือน", category: "ยื่นภาษี", budget: 3500, province: "เชียงใหม่", status: "open", created_at: 1759900000000 },
];
const MOCK_JOBS_FIRM = [
  { id: "job-firm-01", title: "หา freelancer กระทบยอดธนาคาร 5 บริษัท", category: "กระทบยอด", budget: 9000, status: "open", created_at: 1760000000000 },
  { id: "job-firm-02", title: "หาคนช่วยปิดงบ Q3 จำนวน 8 งบ", category: "ปิดงบ", budget: 20000, status: "open", created_at: 1759900000000 },
];

function mockJobDetail(type: string, id: string): any | null {
  const list = type === "sme" ? MOCK_JOBS_SME : MOCK_JOBS_FIRM;
  const found = list.find((j) => j.id === id);
  if (found) return { ...found, jobType: type, detail: "", images: [], proposals: 0 };
  // งาน mock ที่เพิ่ง POST ในโหมดไม่มี D1 (id ไม่ persist) — ส่ง placeholder กลับแทน 404
  // เพื่อให้ flow โพสต์ → ดูงาน ไม่พังบน local demo
  if (id.startsWith(type === "sme" ? "job-sme-" : "job-firm-")) {
    return {
      id, jobType: type, title: "งาน demo (โหมดไม่มี D1 — ต่อ D1 แล้วข้อมูลจะ persist จริง)",
      category: "ปิดงบ", budget: 0, province: "กรุงเทพมหานคร",
      detail: "", status: "open", created_at: Date.now(), images: [], proposals: 0,
    };
  }
  return null;
}

app.get("/api/jobs-sme", async (c) => {
  try {
    if (!c.env.DB) throw new Error("no-d1");
    // ?mine=1 → งานของฉัน (ต้อง login)
    if (c.req.query("mine") === "1") {
      const me = await getSessionUser(c).catch(() => null);
      if (!me) return c.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, 401);
      const sql = `SELECT *, ${COVER_SQL.replace("%s", "jobs_sme.id")}, ${COUNT_SQL.replace("%s", "jobs_sme.id")} FROM jobs_sme WHERE sme_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 50`;
      const { results } = await c.env.DB.prepare(sql).bind("sme", "sme", me.id).all();
      return c.json({ data: results });
    }
    const sql = `SELECT *, ${COVER_SQL.replace("%s", "jobs_sme.id")}, ${COUNT_SQL.replace("%s", "jobs_sme.id")} FROM jobs_sme ORDER BY created_at DESC, rowid DESC LIMIT 50`;
    const { results } = await c.env.DB.prepare(sql).bind("sme", "sme").all();
    return c.json({ data: results });
  } catch {
    // โหมดไม่มี D1: ?mine=1 ไม่มี owner ให้กรอง → คืนว่าง (ไม่โชว์งานคนอื่นเป็น "ของฉัน")
    if (c.req.query("mine") === "1") return c.json({ data: [], mock: true });
    return c.json({ data: MOCK_JOBS_SME, mock: true });
  }
});

app.get("/api/jobs-firm", async (c) => {
  try {
    if (!c.env.DB) throw new Error("no-d1");
    if (c.req.query("mine") === "1") {
      const me = await getSessionUser(c).catch(() => null);
      if (!me) return c.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, 401);
      const sql = `SELECT *, ${COVER_SQL.replace("%s", "jobs_firm.id")}, ${COUNT_SQL.replace("%s", "jobs_firm.id")} FROM jobs_firm WHERE firm_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 50`;
      const { results } = await c.env.DB.prepare(sql).bind("firm", "firm", me.id).all();
      return c.json({ data: results });
    }
    const sql = `SELECT *, ${COVER_SQL.replace("%s", "jobs_firm.id")}, ${COUNT_SQL.replace("%s", "jobs_firm.id")} FROM jobs_firm ORDER BY created_at DESC, rowid DESC LIMIT 50`;
    const { results } = await c.env.DB.prepare(sql).bind("firm", "firm").all();
    return c.json({ data: results });
  } catch {
    if (c.req.query("mine") === "1") return c.json({ data: [], mock: true });
    return c.json({ data: MOCK_JOBS_FIRM, mock: true });
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
  const budget = Number(body.budget || 0);
  if (!Number.isFinite(budget) || budget < 0) return c.json({ error: "งบต้องเป็นตัวเลข ≥ 0" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const me = await getSessionUser(c).catch(() => null);
    if (!me) return c.json({ error: "กรุณาเข้าสู่ระบบก่อนโพสต์งาน" }, 401);
    const id = `job-sme-${Date.now()}`;
    const now = Date.now();
    await c.env.DB.prepare(
      "INSERT INTO jobs_sme (id, sme_id, title, category, budget, province, detail, status, created_at) VALUES (?,?,?,?,?,?,?, 'open', ?)"
    ).bind(id, me.id, body.title, body.category, budget, body.province || "กรุงเทพมหานคร", body.detail || "", now).run();
    return c.json({ ok: true, id });
  } catch (e: any) {
    if (e?.message === "no-d1") return c.json({ error: "ยังไม่ต่อ D1" }, 503);
    throw e;
  }
});

// หา/สร้าง user จาก Google profile แล้วออก session cookie — ใช้ร่วมทั้ง popup และ redirect flow
async function finishGoogleLogin(c: any, sub: string, email: string, name: string, role: string) {
  if (!c.env.DB) throw new Error("no-d1");
  let u: any = await c.env.DB.prepare("SELECT * FROM users WHERE google_sub = ?").bind(sub).first();
  if (!u) {
    const byEmail: any = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (byEmail) {
      await c.env.DB.prepare("UPDATE users SET google_sub = ? WHERE id = ?").bind(sub, byEmail.id).run();
      u = byEmail;
    } else {
      const id = `u-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
      await c.env.DB.prepare(
        "INSERT INTO users (id, role, name, email, google_sub) VALUES (?,?,?,?,?)"
      ).bind(id, role, name || email.split("@")[0], email, sub).run();
      u = { id, role, name: name || email.split("@")[0], email };
    }
  }
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await c.env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)")
    .bind(token, u.id, Date.now() + SESSION_DAYS * 86400 * 1000).run();
  c.header("Set-Cookie", sessionCookie(c, token, SESSION_DAYS * 86400));
  return { id: u.id, role: u.role, name: u.name, email: u.email };
}

// ---------- Google OAuth redirect flow (เต็มหน้าแบบ Fastwork, ไม่พึ่ง FedCM) ----------
// ขั้น 1: frontend ขอ URL → ตั้ง state cookie กัน CSRF → redirect ไป accounts.google.com
app.get("/api/auth/google/url", (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  if (!clientId) return c.json({ error: "ยังไม่ตั้งค่า Google login" }, 503);
  const role = ["sme", "firm", "talent"].includes(c.req.query("role") || "") ? c.req.query("role") : "sme";
  let next = c.req.query("next") || "/dashboard";
  if (!next.startsWith("/")) next = "/dashboard";
  const url = new URL(c.req.url);
  const redirectUri = `${url.origin}/api/auth/google/callback`;
  const nonce = hex(crypto.getRandomValues(new Uint8Array(16)));
  const state = btoa(JSON.stringify({ nonce, role, next })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const secure = url.protocol === "https:";
  setCookie(c, "g_state", nonce, { httpOnly: true, sameSite: "Lax", path: "/", maxAge: 600, secure });
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.searchParams.set("client_id", clientId);
  auth.searchParams.set("redirect_uri", redirectUri);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", "openid email profile");
  auth.searchParams.set("state", state);
  auth.searchParams.set("prompt", "select_account");
  return c.json({ url: auth.toString() });
});

// ขั้น 2: Google redirect กลับ → แลก code เป็น token → login → กลับเข้าเว็บ
app.get("/api/auth/google/callback", async (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  const clientSecret = c.env.GOOGLE_CLIENT_SECRET;
  const url = new URL(c.req.url);
  const fail = (msg: string) => c.redirect(`/?google_error=${encodeURIComponent(msg)}`, 302);
  if (!clientId || !clientSecret) return fail("ยังไม่ตั้งค่า Google login ฝั่งเซิร์ฟเวอร์");
  if (c.req.query("error")) return fail("ยกเลิกการเชื่อม Google แล้ว");
  const code = c.req.query("code") || "";
  const rawState = c.req.query("state") || "";
  let st: any = null;
  try {
    st = JSON.parse(atob(rawState.replace(/-/g, "+").replace(/_/g, "/")));
  } catch { /* fallthrough */ }
  const nonce = getCookie(c, "g_state");
  if (!code || !st?.nonce || !nonce || st.nonce !== nonce) return fail("session หมดอายุ กดปุ่ม Google ใหม่อีกครั้ง");
  deleteCookie(c, "g_state", { path: "/" });

  try {
    const redirectUri = `${url.origin}/api/auth/google/callback`;
    const tok = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: redirectUri, grant_type: "authorization_code",
      }),
    }).then((x) => x.json() as Promise<any>);
    if (!tok.id_token) throw new Error("no-id-token");
    const { payload } = await jwtVerify(tok.id_token, GOOGLE_JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: clientId,
    });
    const sub = String(payload.sub || "");
    const email = String(payload.email || "").toLowerCase();
    const name = String(payload.name || "");
    if (!sub || !EMAIL_RE.test(email)) throw new Error("bad-claims");
    const role = ["sme", "firm", "talent"].includes(st.role) ? st.role : "sme";
    await finishGoogleLogin(c, sub, email, name, role);
    let next = typeof st.next === "string" && st.next.startsWith("/") ? st.next : "/dashboard";
    return c.redirect(next, 302);
  } catch {
    return fail("ยืนยันตัวตน Google ไม่สำเร็จ ลองใหม่อีกครั้ง");
  }
});

app.post("/api/jobs-firm", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.title || !body.category) return c.json({ error: "title + category required" }, 400);
  const budget = Number(body.budget || 0);
  if (!Number.isFinite(budget) || budget < 0) return c.json({ error: "งบต้องเป็นตัวเลข ≥ 0" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const me = await getSessionUser(c).catch(() => null);
    if (!me) return c.json({ error: "กรุณาเข้าสู่ระบบก่อนโพสต์งาน" }, 401);
    const id = `job-firm-${Date.now()}`;
    const now = Date.now();
    await c.env.DB.prepare(
      "INSERT INTO jobs_firm (id, firm_id, title, category, budget, detail, status, created_at) VALUES (?,?,?,?,?,?, 'open', ?)"
    ).bind(id, me.id, body.title, body.category, budget, body.detail || "", now).run();
    return c.json({ ok: true, id });
  } catch (e: any) {
    if (e?.message === "no-d1") return c.json({ ok: true, id: `job-firm-${Date.now()}`, mock: true });
    throw e;
  }
});

app.post("/api/proposals", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.jobId || !body.providerName) return c.json({ error: "jobId + providerName required" }, 400);
  const jobType = String(body.jobType || "");
  if (!["sme", "firm"].includes(jobType)) return c.json({ error: "jobType must be sme|firm" }, 400);
  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) return c.json({ error: "กรอกราคาที่เสนอมากกว่า 0 บาท" }, 400);
  try {
    if (!c.env.DB) throw new Error("no-d1");
    // งานต้องมีจริง — กัน jobId มั่วแล้ว proposal นับไม่ขึ้น
    const table = jobType === "sme" ? "jobs_sme" : "jobs_firm";
    const job: any = await c.env.DB.prepare(`SELECT id FROM ${table} WHERE id = ?`).bind(body.jobId).first();
    if (!job) return c.json({ error: "ไม่พบงานนี้" }, 404);
    const me = await getSessionUser(c).catch(() => null);
    const id = `prop-${Date.now()}`;
    const now = Date.now();
    await c.env.DB.prepare(
      "INSERT INTO proposals (id, job_type, job_id, provider_id, provider_name, price, message, status, created_at) VALUES (?,?,?,?,?,?,?, 'pending', ?)"
    ).bind(id, jobType, body.jobId, me?.id || String(body.providerId || "demo"), String(body.providerName), price, String(body.message || ""), now).run();
    return c.json({ ok: true, id });
  } catch (e: any) {
    if (e?.message === "no-d1") return c.json({ ok: true, id: `prop-${Date.now()}`, mock: true });
    throw e;
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
    try {
      await c.env.DB.prepare(
        "INSERT INTO users (id, role, name, email, phone, password_hash, created_at) VALUES (?,?,?,?,?,?,?)"
      ).bind(id, role, name, email, String(body.phone || ""), await hashPassword(password), Date.now()).run();
    } catch (e: any) {
      // กัน race สมัครอีเมลซ้ำพร้อมกัน (UNIQUE index ใน 0005) → ตอบ 409 แทน 500
      if (/UNIQUE|unique/i.test(String(e?.message || ""))) return c.json({ error: "อีเมลนี้สมัครแล้ว ลอง login" }, 409);
      throw e;
    }
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    await c.env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?,?,?,?)")
      .bind(token, id, Date.now() + SESSION_DAYS * 86400 * 1000, Date.now()).run();
    c.header("Set-Cookie", sessionCookie(c, token, SESSION_DAYS * 86400));
    return c.json({ ok: true, user: { id, role, name, email } });
  } catch (e: any) {
    if (e?.message === "no-d1") {
      // โหมด local demo ไม่มี D1 — คืน mock user ให้ frontend ตั้ง state ได้ (ไม่ persist, ใช้ชั่วคราว)
      return c.json({ ok: true, mock: true, note: "ยังไม่ต่อ D1", user: { id: "mock-u", role, name: name || "Demo", email } });
    }
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
    await c.env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?,?,?,?)")
      .bind(token, u.id, Date.now() + SESSION_DAYS * 86400 * 1000, Date.now()).run();
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

// บอก frontend ว่าเปิด Google login ไว้ไหม (client id เป็น public อยู่แล้ว)
app.get("/api/auth/config", (c) =>
  c.json({ googleClientId: c.env.GOOGLE_CLIENT_ID || null })
);

// ---------- Google One-tap / Sign-in: ตรวจ ID token แล้วสร้าง session เดียวกับระบบ ----------
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

// ---------- รูปแนบงาน: ไฟล์จริงใน Cloudflare R2 (ฟรี 10GB, ไม่มีค่า egress) ----------
const ALLOW_IMG = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMG_BYTES = 5 * 1024 * 1024; // 5MB/รูป
const MAX_IMG_PER_JOB = 5;

app.post("/api/upload", async (c) => {
  if (!c.env.DB || !c.env.DOCS)
    return c.json({ ok: false, mock: true, note: "เปิด R2 ใน Dashboard แล้ว bind bucket DOCS ก่อน (ดู README)" });
  // ต้อง login ก่อน — กันสแปม/ถม R2 ฟรีโดยไม่ต้องมีบัญชี
  const me = await getSessionUser(c).catch(() => null);
  if (!me) return c.json({ error: "กรุณาเข้าสู่ระบบก่อนแนบรูป" }, 401);
  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  const jobType = String(form?.get("jobType") || "");
  const jobId = String(form?.get("jobId") || "");
  if (!file || file.size === 0) return c.json({ error: "แนบไฟล์รูปก่อน" }, 400);
  if (!["sme", "firm"].includes(jobType) || !jobId) return c.json({ error: "jobType (sme|firm) + jobId ไม่ครบ" }, 400);
  if (!ALLOW_IMG.includes(file.type)) return c.json({ error: "รับเฉพาะ JPG/PNG/WebP/GIF" }, 400);
  if (file.size > MAX_IMG_BYTES) return c.json({ error: "รูปใหญ่เกิน 5MB" }, 400);
  // jobId ต้องมีจริง — กันฝากไฟล์ orphan ด้วย id มั่ว
  const table = jobType === "sme" ? "jobs_sme" : "jobs_firm";
  const ownerCol = jobType === "sme" ? "sme_id" : "firm_id";
  const job: any = await c.env.DB.prepare(`SELECT id, ${ownerCol} AS owner_id FROM ${table} WHERE id = ?`).bind(jobId).first();
  if (!job) return c.json({ error: "ไม่พบงานนี้" }, 404);
  // ถ้างานมีเจ้าของ (งานใหม่หลัง fix) — ให้เจ้าของเท่านั้นแนบรูปได้
  if (job.owner_id && job.owner_id !== me.id) return c.json({ error: "แนบรูปได้เฉพาะเจ้าของงาน" }, 403);
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
    "INSERT INTO images (id, owner_type, owner_id, r2_key, content_type, size, created_at) VALUES (?,?,?,?,?,?,?)"
  ).bind(id, jobType, jobId, key, file.type, file.size, Date.now()).run();
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
// แต่กันเหนียว: ถ้า request หลุดมาถึง Worker (เช่น curl ไม่มี Accept: text/html, หรือ asset miss)
// ให้เสิร์ฟ index.html เอง เพื่อให้ React Router ฝั่ง client รับช่วงต่อ — แทน Hono 404 เปล่าๆ
app.notFound(async (c) => {
  const url = new URL(c.req.url);
  // API ที่ไม่รู้จักคงเป็น JSON 404 เหมือนเดิม
  if (url.pathname.startsWith("/api/")) return c.json({ error: "not found" }, 404);
  // ไฟล์ static ที่มีนามสกุล (js/css/png/...) หาไม่เจอจริง → 404 ตรง ๆ (ไม่ยัด index.html ให้)
  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    // ยกเว้น path ที่ไม่มี asset match แต่เป็น navigation — ให้โอกาส ASSETS ลองก่อนด้านล่าง
    // ถ้าเป็น /assets/* ที่หายไปจริง ให้ 404 ไปเลยเพื่อไม่ให้ cache สับสน
    if (url.pathname.startsWith("/assets/")) return c.text("not found", 404);
  }
  if (c.env.ASSETS) {
    // ลองหลายท่า: บางรันไทม์ ASSETS.fetch ต้องการ Request ที่ผูก origin เดิม + headers เดิม
    const attempts: Request[] = [];
    try {
      attempts.push(new Request(new URL("/index.html", url).toString(), c.req.raw as RequestInit));
    } catch { /* ignore */ }
    attempts.push(new Request(new URL("/index.html", url.origin).toString()));
    for (const req of attempts) {
      try {
        const res = await c.env.ASSETS.fetch(req);
        if (res && (res.ok || res.status === 200)) {
          const headers = new Headers(res.headers);
          headers.set("Content-Type", "text/html; charset=utf-8");
          headers.set("Cache-Control", "no-cache");
          return new Response(res.body, { status: 200, headers });
        }
      } catch { /* try next */ }
    }
  }
  // ไม่มี ASSETS binding (เช่น wrangler dev เก่า) — ส่ง link กลับหน้าแรก
  return c.html(`<!doctype html><html lang="th"><head><meta charset="utf-8"><title>AccOS Pro Marketplace</title></head><body style="font-family:system-ui"><p>ไม่พบหน้านี้ — <a href="/">กลับหน้าแรก AccOS Pro Marketplace</a></p></body></html>`, 200);
});

export default app;
