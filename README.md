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

## Free limits (demo พอเหลือๆ)

| ตัว | ฟรี | ใช้จริง demo |
|---|---|---|
| Workers | 100k req/วัน | ~1k |
| D1 | 5GB, 5M read/วัน | หลักร้อย rows |
| R2 | 10GB, ไม่มีค่า egress | อัพสลิป/เอกสาร |
| Pages/Assets | unlimited bandwidth | SPA dist |

## API

- `GET /api/health`
- `GET /api/firms?q=&province=`
- `GET /api/firms/:id`
- `GET /api/talents?q=&province=`
- `GET /api/jobs-sme` / `POST /api/jobs-sme`
- `GET /api/jobs-firm` / `POST /api/jobs-firm`
- `POST /api/proposals`
- `POST /api/upload` (ต้อง bind R2 `DOCS` ก่อน)

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
