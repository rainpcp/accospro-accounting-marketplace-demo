-- D1 migration: marketplace A+B (free tier demo)
-- Apply: wrangler d1 execute accospro-marketplace-demo-db --local --file=./migrations/0001_init.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at INTEGER
);
CREATE TABLE IF NOT EXISTS firms (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  categories TEXT NOT NULL,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  cpa_license TEXT,
  dbd_verified INTEGER NOT NULL DEFAULT 0,
  accos_pro_user INTEGER NOT NULL DEFAULT 1,
  rating REAL NOT NULL DEFAULT 5,
  review_count INTEGER NOT NULL DEFAULT 0,
  intro TEXT
);
CREATE TABLE IF NOT EXISTS talents (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  skills TEXT NOT NULL,
  province TEXT NOT NULL,
  rate_per_month INTEGER NOT NULL,
  ta_license TEXT,
  rating REAL NOT NULL DEFAULT 5,
  review_count INTEGER NOT NULL DEFAULT 0,
  intro TEXT
);
CREATE TABLE IF NOT EXISTS jobs_sme (
  id TEXT PRIMARY KEY,
  sme_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  budget INTEGER NOT NULL,
  province TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at INTEGER
);
CREATE TABLE IF NOT EXISTS jobs_firm (
  id TEXT PRIMARY KEY,
  firm_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  budget INTEGER NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at INTEGER
);
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  job_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER
);
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  job_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  comment TEXT,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_firms_province ON firms(province);
CREATE INDEX IF NOT EXISTS idx_talents_province ON talents(province);
CREATE INDEX IF NOT EXISTS idx_jobs_sme_status ON jobs_sme(status);
CREATE INDEX IF NOT EXISTS idx_jobs_firm_status ON jobs_firm(status);
