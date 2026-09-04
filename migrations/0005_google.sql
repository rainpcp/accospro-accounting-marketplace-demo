-- Google OAuth: link Google account (sub) to users
-- Apply: wrangler d1 execute accospro-marketplace-demo-db --remote --file=./migrations/0005_google.sql

ALTER TABLE users ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);
