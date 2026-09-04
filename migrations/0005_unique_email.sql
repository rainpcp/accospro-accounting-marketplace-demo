-- กันสมัครอีเมลซ้ำ (race check-then-insert) + backfill created_at งานที่ POST ช่วงบั๊ก NULL
-- Apply: wrangler d1 execute accospro-marketplace-demo-db --remote --file=./migrations/0005_unique_email.sql

-- 1) ลบ user อีเมลซ้ำ เก็บแถวแรกสุดไว้ (กัน UNIQUE index สร้างไม่ผ่านถ้ามีข้อมูลซ้ำอยู่แล้ว)
DELETE FROM users WHERE id NOT IN (
  SELECT MIN(id) FROM users WHERE email IS NOT NULL GROUP BY lower(email)
);

-- 2) UNIQUE กันสมัครซ้ำระดับ DB (code จับ error นี้แล้วตอบ 409)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);

-- 3) backfill งานที่ created_at เป็น NULL (POST ช่วงก่อน fix) ให้มี timestamp จะได้ sort "ล่าสุดก่อน" ถูก
UPDATE jobs_sme SET created_at = (strftime('%s','now'))*1000 WHERE created_at IS NULL;
UPDATE jobs_firm SET created_at = (strftime('%s','now'))*1000 WHERE created_at IS NULL;
UPDATE proposals SET created_at = (strftime('%s','now'))*1000 WHERE created_at IS NULL;
