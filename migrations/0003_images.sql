-- Job image attachments (ไฟล์จริงอยู่ใน R2, D1 เก็บแค่ key)
-- Apply: wrangler d1 execute accospro-marketplace-demo-db --remote --file=./migrations/0003_images.sql

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL, -- sme | firm  (ชนิดของงาน)
  owner_id TEXT NOT NULL,   -- job id
  r2_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_images_owner ON images(owner_type, owner_id);
