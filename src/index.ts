import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  DB?: D1Database;
  DOCS?: R2Bucket;
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
  try {
    if (!c.env.DB) throw new Error("no-d1");
    let sql = "SELECT * FROM firms WHERE 1=1";
    const params: unknown[] = [];
    if (province) { sql += " AND province = ?"; params.push(province); }
    if (q) { sql += " AND (name LIKE ? OR intro LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }
    sql += " ORDER BY rating DESC LIMIT 50";
    const { results } = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json({ data: results.map((r: any) => ({ ...r, categories: JSON.parse(r.categories || "[]") })) });
  } catch {
    const data = MOCK_FIRMS.filter(
      (f) => (!province || f.province === province) && (!q || f.name.toLowerCase().includes(q))
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
  try {
    if (!c.env.DB) throw new Error("no-d1");
    let sql = "SELECT * FROM talents WHERE 1=1";
    const params: unknown[] = [];
    if (province) { sql += " AND province = ?"; params.push(province); }
    if (q) { sql += " AND (name LIKE ? OR intro LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }
    sql += " ORDER BY rating DESC LIMIT 50";
    const { results } = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json({ data: results.map((r: any) => ({ ...r, skills: JSON.parse(r.skills || "[]") })) });
  } catch {
    const data = MOCK_TALENTS.filter(
      (t) => (!province || t.province === province) && (!q || t.name.toLowerCase().includes(q))
    );
    return c.json({ data, mock: true });
  }
});

// ---- jobs ----
app.get("/api/jobs-sme", async (c) => {
  try {
    if (!c.env.DB) throw new Error("no-d1");
    const { results } = await c.env.DB.prepare("SELECT * FROM jobs_sme ORDER BY rowid DESC LIMIT 50").all();
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
    const { results } = await c.env.DB.prepare("SELECT * FROM jobs_firm ORDER BY rowid DESC LIMIT 50").all();
    return c.json({ data: results });
  } catch {
    return c.json({ data: [
      { id: "job-firm-01", title: "หา freelancer กระทบยอดธนาคาร 5 บริษัท", category: "กระทบยอด", budget: 9000, status: "open" },
      { id: "job-firm-02", title: "หาคนช่วยปิดงบ Q3 จำนวน 8 งบ", category: "ปิดงบ", budget: 20000, status: "open" },
    ], mock: true });
  }
});

app.post("/api/jobs-sme", async (c) => {
  const body = await c.req.json().catch(() => ({}));
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

// R2 upload demo (optional — ถ้ายังไม่ bind R2 จะตอบ mock)
app.post("/api/upload", async (c) => {
  try {
    if (!c.env.DOCS) throw new Error("no-r2");
    const form = await c.req.formData();
    const file = form.get("file") as File | null;
    if (!file) return c.json({ error: "file required" }, 400);
    const key = `uploads/${Date.now()}-${file.name}`;
    await c.env.DOCS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    return c.json({ ok: true, key });
  } catch {
    return c.json({ ok: true, mock: true, note: "bind R2 bucket DOCS ก่อนใช้จริง" });
  }
});

export default app;
