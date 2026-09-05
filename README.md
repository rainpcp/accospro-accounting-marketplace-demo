# AccOS Pro Accounting Marketplace (TH) — Demo

ตลาดบัญชีไทย 2 ฝั่งเป็น feature เสริมของ `accospro.app`:
- **A · SME → Firm:** SME หาสำนักงานบัญชีที่ใช้ AccOS Pro
- **B · Firm → Talent:** สำนักงานบัญชีหาฟรีแลนซ์ช่วยงานค้าง

Deploy ฟรี 100% บน Cloudflare: **Workers (API+Web) + D1 (DB) + R2 (ไฟล์)**

## Quick start (local)

```bash
npm install
npm run dev          # frontend http://localhost:5173 (proxy /api → :8787)
npm run dev:worker   # worker http://localhost:8787 (ต้อง wrangler login ก่อน)
```

> ยังไม่ migrate D1 ก็เปิด demo ได้ — API จะ fallback เป็น mock data อัตโนมัติ

## Deploy Cloudflare free tier (ครั้งแรก)

```bash
npm i -g wrangler
wrangler login
wrangler d1 create accospro-marketplace-demo-db
# เอา database_id ที่ได้ไปใส่ใน wrangler.toml

npm run build
npm run db:migrate:remote
npm run db:seed:remote
npm run deploy
# ได้ https://accospro-accounting-marketplace-demo.<account>.workers.dev
```

ผูกโดเมน `marketplace-demo.accospro.app`:
Cloudflare Dashboard → Workers → Custom Domains → Add (SSL ฟรีอัตโนมัติ)

## เปิดรูปภาพ R2 (ครั้งเดียว)

1. Cloudflare Dashboard → **R2** → **Enable R2** (ฟรี 10GB)
2. R2 → Create bucket ชื่อ `accospro-marketplace-docs`
3. ใน `wrangler.toml` uncomment บล็อก `[[r2_buckets]]`
4. `npm run deploy` — หน้าโพสต์งานจะมีที่แนบรูป (JPG/PNG/WebP ≤5MB, 5 รูป/งาน) เสิร์ฟผ่าน `GET /api/files/...` (edge cache 1 วัน)

## Free limits (demo พอเหลือๆ)

| ตัว | ฟรี | ใช้จริง demo |
|---|---|---|
| Workers | 100k req/วัน | ~1k |
| D1 | 5GB, 5M read/วัน | หลักร้อย rows |
| R2 | 10GB, ไม่มีค่า egress | อัพสลิป/เอกสาร |
| Pages/Assets | unlimited bandwidth | SPA dist |

## API

- `GET /api/health`
- `GET /api/firms?q=&province=&category=&minRating=`
- `GET /api/firms/:id`
- `GET /api/talents?q=&province=&skill=&minRating=`
- `GET /api/jobs-sme` / `POST /api/jobs-sme` (ต้อง login)
- `GET /api/jobs-firm` / `POST /api/jobs-firm` (ต้อง login)
- `GET /api/jobs/:type/:id` (detail + รูป + จำนวนข้อเสนอ)
- `POST /api/proposals`
- `POST /api/auth/register|login|logout`, `GET /api/auth/me`
- `GET /api/auth/google/url`, `GET /api/auth/google/callback` (Google OAuth redirect flow)
- `POST /api/upload` (multipart: file + jobType + jobId — ต้อง login + เปิด R2)
- `GET /api/files/<key>` (เสิร์ฟรูปจาก R2, cache 1 วัน)
- `GET /api/images?jobType=&jobId=` (รูปของงานเดียว)

## Google login (ต้องทำ 1 ครั้ง)

1. Google Cloud Console → สร้างโปรเจกต์ → **APIs & Services → OAuth consent screen** (External, ใส่ test users)
2. **Clients → Create client → Web application** (`marketplace-web`)
   - Authorized JavaScript origins: `https://<worker>.workers.dev`
   - Authorized redirect URIs: `https://<worker>.workers.dev/api/auth/google/callback`
3. ใส่ Client ID ใน `wrangler.toml` → `[vars] GOOGLE_CLIENT_ID`
4. เก็บ secret (ไม่ลง repo): `printf '%s' '...' | wrangler secret put GOOGLE_CLIENT_SECRET`
5. `npm run deploy` — ปุ่ม “ดำเนินการต่อด้วย Google” จะขึ้นใน popup เอง

## CI auto-deploy (เปิดเมื่อพร้อม)

CI (`bun install` + `tsc` + `build`) รันทุก push อยู่แล้ว ส่วนขั้น deploy จะข้ามจนกว่าจะตั้งค่า:
repo Settings → Secrets → `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
→ Variables → `DEPLOY_ENABLED` = `true`

## โครง repo

```
src/index.ts          Worker + Hono API
src/db/schema.ts      Drizzle schema (D1)
migrations/0001_init.sql
seed.sql              ข้อมูลไทย 10+10+6
frontend/             Vite+React+Tailwind (TH)
wrangler.toml         Worker + Assets + D1 + R2
.github/workflows/deploy.yml  auto-deploy เมื่อ push main
```
