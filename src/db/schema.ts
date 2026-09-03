import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// users: sme | firm | talent | admin — login ด้วย email+password, session เก็บใน D1
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  role: text("role").notNull(), // sme | firm | talent | admin
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// A: สำนักงานบัญชี (firms) — SME ค้นหา
export const firms = sqliteTable("firms", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  province: text("province").notNull(),
  categories: text("categories").notNull(), // JSON: ["ปิดงบ","ยื่นภาษี",...]
  priceMin: integer("price_min").notNull(),
  priceMax: integer("price_max").notNull(),
  cpaLicense: text("cpa_license"),
  dbdVerified: integer("dbd_verified").notNull().default(0), // 0/1
  accosProUser: integer("accos_pro_user").notNull().default(1),
  rating: real("rating").notNull().default(5),
  reviewCount: integer("review_count").notNull().default(0),
  intro: text("intro"),
});

// B: talent/f freelancer — สำนักงานบัญชีค้นหา
export const talents = sqliteTable("talents", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  skills: text("skills").notNull(), // JSON
  province: text("province").notNull(),
  ratePerMonth: integer("rate_per_month").notNull(),
  taLicense: text("ta_license"),
  rating: real("rating").notNull().default(5),
  reviewCount: integer("review_count").notNull().default(0),
  intro: text("intro"),
});

// A: งาน SME โพสต์หา firm
export const jobsSme = sqliteTable("jobs_sme", {
  id: text("id").primaryKey(),
  smeId: text("sme_id"),
  title: text("title").notNull(),
  category: text("category").notNull(),
  budget: integer("budget").notNull(),
  province: text("province").notNull(),
  detail: text("detail"),
  status: text("status").notNull().default("open"), // open | matched | closed
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// B: งาน firm โพสต์หา talent
export const jobsFirm = sqliteTable("jobs_firm", {
  id: text("id").primaryKey(),
  firmId: text("firm_id"),
  title: text("title").notNull(),
  category: text("category").notNull(),
  budget: integer("budget").notNull(),
  detail: text("detail"),
  status: text("status").notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const proposals = sqliteTable("proposals", {
  id: text("id").primaryKey(),
  jobType: text("job_type").notNull(), // sme | firm
  jobId: text("job_id").notNull(),
  providerId: text("provider_id").notNull(),
  providerName: text("provider_name").notNull(),
  price: integer("price").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  jobType: text("job_type").notNull(),
  jobId: text("job_id").notNull(),
  score: integer("score").notNull(),
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
