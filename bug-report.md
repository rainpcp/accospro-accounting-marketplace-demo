# Bug Report — AccOS Pro Accounting Marketplace Demo

- **URL ที่เทส:** `https://accospro-accounting-marketplace-demo.phuangchomphurobchanachai.workers.dev`
- **วันที่:** 2026-09-04
- **วิธีเทส:** ยิงเว็บจริง (curl `GET`/`POST` ทุก API + ทุก route) ร่วมกับอ่านโค้ด `frontend/src` + `src/index.ts` + `migrations/`
- **สถานะ API หลัก:** ปกติ — `/api/health` (`hasD1:true`), `/api/firms`, `/api/talents`, `/api/jobs-sme`, `/api/jobs-firm`, `/api/jobs/:type/:id` ตอบ 200 พร้อมข้อมูลจริง, validation `400`/`401`/`404` ทำงานถูกต้อง

---

## P0 — ต้องซ่อมก่อน (ใช้งานจริงพัง)

### 1. เปิดลิงก์หน้าย่อยโดยตรง / กด refresh แล้วเจอหน้า “ไม่พบหน้านี้”
- **หลักฐาน (เทสจริง):** `GET /jobboard`, `/jobs/firm/job-firm-05`, `/find-firm`, `/find-talent`, `/post-job`, `/dashboard`, `/login` — ทุกหน้าตอบ `200` แต่ body เป็นแค่
  `ไม่พบหน้านี้ — กลับหน้าแรก AccOS Pro Marketplace` (มีแค่ `/` ที่ได้ `index.html` จริง)
- **โค้ด:** `src/index.ts:378-395` — `notFound` พยายามดึง `index.html` ผ่าน `ASSETS` แต่ตกมา branch ส่ง HTML ข้อความแทน แปลว่า `[assets] not_found_handling = "single-page-application"` ใน `wrangler.toml:9-10` ไม่มีผลบน deploy นี้
- **Impact:** แชร์ลิงก์งานให้กันไม่ได้, refresh แล้วหลุด, SEO ตาย (ปุ่ม “ยื่นข้อเสนอ” ที่ลิงก์ไป `/jobs/firm/job-firm-05` กดแล้วไปได้เฉพาะ client-side เท่านั้น)

### 2. “งานของฉัน” (`/dashboard`) โชว์งานของทุกคน และเข้าได้โดยไม่ต้อง login
- **หลักฐาน:** `frontend/src/pages/Dashboard.tsx:29-42` ไม่เรียก `useAuth` เลย ดึง `GET /api/jobs-sme` + `/api/jobs-firm` ทั้งก้อนมาแสดงใต้หัว “งานของฉัน”; `App.tsx:113` ยังมีปุ่ม “งานฉัน” ใน BottomNav ให้คนที่ยังไม่ login
- **รากลึก:** `POST /api/jobs-sme|/jobs-firm` (`src/index.ts:157-184`) ไม่เก็บ owner (`sme_id`/`firm_id` มีคอลัมน์ใน schema แต่ `INSERT` ไม่ใส่) เลยทำ “ของฉัน” จริงไม่ได้
- **Impact:** สับสน + เห็นชื่องานคนอื่นปนว่าเป็นของตัวเอง

---

## P1 — กระทบผู้ใช้ชัดเจน

### 3. โพสต์งานใหม่แล้วจมอยู่ล่างสุดใน sort “ล่าสุดก่อน” + ช่อง “เมื่อ” ขึ้น “-”
- **หลักฐาน:** `POST` ทั้งสองเส้น (`src/index.ts:162-164, 176-179`) ไม่ insert `created_at` → ได้ `NULL`; `Jobboard.tsx:75` sort ด้วย `(b.created_at||0)-(a.created_at||0)` ทำให้งานใหม่ (`0`) แพ้งาน seed (timestamp ปี 2026) และ `fmtDateTime` (`lib/data.ts:45-51`) แสดง `-`
- **Impact:** ผู้ใช้โพสต์งานแล้วหางานตัวเองไม่เจอ

### 4. ปุ่ม “ล้างตัวกรอง” ล้างแล้วแต่ผลค้นหาไม่เปลี่ยน
- **หลักฐาน:** `FindFirm.tsx:40`, `FindTalent.tsx:36` — `setQ("")` … แล้ว `setTimeout(load, 0)` แต่ `load` ปิด (closure) ค่า state เก่า (`setState` ยังไม่ apply) เลยยิง API ด้วย filter เดิม
- **Impact:** ปุ่มดูเหมือนเสีย ต้องกด refresh เอง

### 5. กด chip หมวด/ทักษะ หรือเปลี่ยน select แล้วรายการไม่ค้นหาใหม่
- **หลักฐาน:** `FindFirm.tsx:54,59,70-79`, `FindTalent.tsx:49,58-69` — controls พวกนี้แค่ `setState` ไม่เรียก `load` ต้องกดปุ่ม “ค้นหา” (หรือ Enter ในช่อง q) ถึงจะยิง API
- **Impact:** ดูเหมือน UI ค้าง/กดไม่ติด

### 6. ลิงก์ `?category=` จากหน้า Home ใช้ได้แค่ครั้งแรก
- **หลักฐาน:** `FindFirm.tsx:16` อ่าน param เข้า state ครั้งเดียว + `useEffect(..., [])` บรรทัด 38 ไม่ sync ตาม param ที่เปลี่ยน (React Router reuse component) — คลิกลิงก์หมวดครั้งที่สองขณะอยู่หน้าเดิมไม่มีอะไรเกิดขึ้น
- **Impact:** เมนู “หาตามงานที่ต้องการ” ใช้งานซ้ำไม่ได้

### 7. chip หน้า Home 2 อันค้นยังไงก็ไม่เจอ: “ตรวจสอบบัญชี”, “วางระบบบัญชี”
- **หลักฐาน:** `Home.tsx:169` ตัดแค่คำว่า `รายเดือน` ออก (`ตรวจสอบบัญชี`/`วางระบบบัญชี` เหลือเต็ม) แต่ `FIRM_CATEGORIES` (`lib/data.ts:11-18`) มีแค่ `ตรวจสอบ` และไม่มี `วางระบบบัญชี` เลย → `LIKE %ตรวจสอบบัญชี%` ไม่ match หมวด `ตรวจสอบ` ของ firm ใด ๆ (เทส API จริง: firm หมวด `ตรวจสอบ` มีแค่ `firm-07`)
- **Impact:** หน้าย่อยว่างเปล่าทุกครั้ง

### 8. เปิดงานที่สองต่อกัน สถานะงานแรกติดมาด้วย (“ส่งข้อเสนอแล้ว” ค้าง / “ไม่พบงานนี้” ค้าง)
- **หลักฐาน:** `JobDetail.tsx:19-30` — `load()` ไม่ reset `sent`/`msg`/`form`/`notFound` เลย (component ไม่ remount เมื่อเปลี่ยน `:id`)
- **Impact:** ข้อความ “✓ ส่งข้อเสนอแล้ว” โผล่บนงานที่ยังไม่เคยยื่น

### 9. กด “ยื่นข้อเสนอ” เบิ้ลได้ + กรอกราคา 0/ติดลบผ่าน
- **หลักฐาน:** `JobDetail.tsx:32-42,108,113` ไม่มี `busy/disabled` guard และเช็คแค่ `!form.price` (`0` ผ่านเพราะ input number ได้ `0`? จริง ๆ `!form.price` กันค่าว่าง string ได้ แต่กัน `0`/ติดลบไม่ได้); ฝั่ง API `src/index.ts:186-199` เก็บ `Number(price)` ตรง ๆ ไม่ตรวจช่วง และ `jobType` ไม่ whitelist (บรรทัด 194 `body.jobType || "sme"`) — `type` ผิดนิดเดียว proposal จะนับไม่ขึ้นใน `COUNT ... WHERE job_type=?`
- **Impact:** ข้อเสนอซ้ำ/ราคา 0/ติดลบหลุดเข้าระบบ

### 10. API โพสต์งาน + อัปโหลดรูปไม่ต้อง login (ยิง curl ตรงได้เลย)
- **หลักฐาน:** `src/index.ts:157-184` (`POST /api/jobs-*`) และ `315-328` (`POST /api/upload`) ไม่เรียก `getSessionUser` เลย — หน้า UI กันไว้ (`PostJob.tsx:64`) แต่ API เปิดโล่ง; `/api/upload` ไม่เช็คด้วยว่า `jobId` มีจริง → ฝากไฟล์ orphan ลง R2/ตาราง `images` ด้วย `jobId` มั่วได้
- **Impact:** สแปมงานขยะ + ถม R2 ฟรี 10GB ได้โดยไม่ต้องมีบัญชี

### 11. แถวงานใน Dashboard กดไม่ได้ — เป็นทางตัน
- **หลักฐาน:** `Dashboard.tsx:13-25` render เป็น `div` ธรรมดา ไม่มี `Link` และทิ้ง `sme|firm` type ที่ต้องใช้สร้างลิงก์ `/jobs/:type/:id`
- **Impact:** เห็นงานแต่เปิดดู/จัดการต่อไม่ได้

---

## P2 — ควรเก็บ (ไม่ blocker)

### 12. ไม่มี catch-all route — URL มั่ว render แค่ header/footer เปล่า ๆ
- **หลักฐาน:** `App.tsx:140-150` ไม่มี `path="*"` (ตอนนี้บน prod โดนบั๊ก P0 ข้อ 1 บังอยู่ จะโผล่หลังซ่อม P0 หรือตอนรัน local)
- **Impact:** หน้าว่างงง ๆ ไม่มีปุ่มกลับ

### 13. `/login` และ `/register` โชว์ฟอร์มทั้งที่ login อยู่แล้ว
- **หลักฐาน:** `Login.tsx:4-13` (และ `Register.tsx` pattern เดียวกัน) ไม่เช็ค `useAuth` เพื่อ redirect
- **Impact:** สับสนเล็กน้อย (ฟอร์ม submit ซ้ำได้)

### 14. โหมดไม่มี D1 (local demo) พัง 3 จุด
- **หลักฐาน:** `GET /api/jobs/:type/:id` ตอบ `503 ยังไม่ต่อ D1` ไม่มี mock (`src/index.ts:152`) ทั้งที่หน้ารายการมี mock → คลิกงานไหนก็ “ไม่พบงานนี้” (`JobDetail.tsx:25-27`); `POST /api/auth/register` ตอบ `{ok:true, mock:true}` ไม่มี `user`/cookie (`src/index.ts:269`) แต่ `auth.tsx:55` ทำ `setUser(undefined)` แล้ว `AuthModal.tsx:34` พาไป `/dashboard` ทั้งที่ไม่ได้ login; mock `POST` ได้ id ที่ไม่เคย persist (`src/index.ts:167,182,197`)
- **Impact:** รัน local แบบยังไม่ต่อ D1 แล้ว auth/โพสต์งาน/ดูงานพัง (บน prod มี D1 แล้วเลยไม่โดน)

### 15. `users.email` ไม่มี UNIQUE — สมัครอีเมลซ้ำพร้อมกันได้
- **หลักฐาน:** schema `0001_init.sql` + `0002_auth.sql:13` มีแค่ `INDEX(email)`; `src/index.ts:257-259` เช็คซ้ำแบบ check-then-insert → race แล้ว login หยิบแถวไหนก็ได้
- **Impact:** บัญชีซ้ำ (โอกาสเกิดต่ำ แต่แก้ด้วย `UNIQUE` บรรทัดเดียว)

---

## หมายเหตุสิ่งที่ “เทสแล้วไม่พัง”
- `GET /api/firms?category=BOI`, `/api/talents?skill=BOI` กรองถูก, `POST` validation ตี `400` ครบ, login ผิดตี `401`, `GET /api/files/<key มั่ว>` ตอบ `404`, bundle `/assets/*.js|css` โหลด `200` ปกติ
- งาน `firm` ไม่มี `province` เป็น by-design (schema ไม่มีคอลัมน์) ไม่ใช่บั๊ก — แต่ card แสดงแค่ชื่องานโดยไม่มีจังหวัด อาจพิจารณาเติมภายหลัง
