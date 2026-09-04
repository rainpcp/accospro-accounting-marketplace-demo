-- งานตัวอย่างเพิ่มสำหรับหน้า Jobboard + เติมวันที่ให้งานเก่า
-- Apply: wrangler d1 execute accospro-marketplace-demo-db --remote --file=./migrations/0004_more_jobs.sql

INSERT OR IGNORE INTO jobs_sme (id, title, category, budget, province, detail, status, created_at) VALUES
('job-sme-04','ปิดงบครึ่งปี ร้านอาหาร 3 สาขา + ยื่น ภ.พ.30','ปิดงบ',9000,'กรุงเทพมหานคร','บิล ~500 ใบ/เดือน เอกสารสแกนพร้อมในไดรฟ์ ต้องการ firm ใช้ AccOS Pro', 'open', (strftime('%s','now')-5*3600)*1000),
('job-sme-05','ทำบัญชีรายเดือนคลินิกความงาม','ปิดงบ',6500,'นนทบุรี','บิล ~150 ใบ + เงินเดือนพนักงาน 12 คน ขอใบเสนอราคารายเดือน','open',(strftime('%s','now')-26*3600)*1000),
('job-sme-06','ยื่นภาษีหัก ณ ที่จ่าย + ประกันสังคม โรงงาน','ยื่นภาษี',4500,'ระยอง','พนักงาน 80 คน ยื่น ภ.ง.ด.3/53 และ สปส.1-10 ทุกเดือน','open',(strftime('%s','now')-2*86400)*1000),
('job-sme-07','วางระบบบัญชี + e-Tax ให้บริษัทขนส่ง','วางระบบบัญชี',25000,'ชลบุรี','รถ 40 คัน อยากได้ e-Tax Invoice + กระทบยอดน้ำมันรายวัน','open',(strftime('%s','now')-3*86400)*1000);

INSERT OR IGNORE INTO jobs_firm (id, title, category, budget, detail, status, created_at) VALUES
('job-firm-04','หาคนคีย์เอกสาร 2,000 ใบ (ใช้ AI ช่วยตรวจ)','กระทบยอด',15000,'สแกนพร้อมแล้ว แบ่งเป็นล็อต 500 ใบ จ่ายตามล็อต','open',(strftime('%s','now')-8*3600)*1000),
('job-firm-05','ผู้ช่วยผู้สอบบัญชี งบสิ้นปี 5 งบ','ตรวจสอบ',30000,'CPA ควบคุม มี checklists ให้ ขอคนมีประสบการณ์งบ SME','open',(strftime('%s','now')-30*3600)*1000),
('job-firm-06','ทำเงินเดือนลูกค้า 3 ราย รวม 200 คน','เงินเดือน',16000,'มีข้อมูล fingerprint + สลิปย้อนหลังให้','open',(strftime('%s','now')-2*86400)*1000),
('job-firm-07','เคลียร์สต๊อก + ต้นทุนร้านค้าปลีก','ปิดงบ',12000,'สต๊อก ~800 SKU ใช้ Express อยู่แล้ว','open',(strftime('%s','now')-4*86400)*1000);

-- เติมวันที่ให้งาน seed ชุดแรก
UPDATE jobs_sme SET created_at = (strftime('%s','now')-1*3600)*1000 WHERE id = 'job-sme-01';
UPDATE jobs_sme SET created_at = (strftime('%s','now')-20*3600)*1000 WHERE id = 'job-sme-02';
UPDATE jobs_sme SET created_at = (strftime('%s','now')-2*86400)*1000 WHERE id = 'job-sme-03';
UPDATE jobs_firm SET created_at = (strftime('%s','now')-3*3600)*1000 WHERE id = 'job-firm-01';
UPDATE jobs_firm SET created_at = (strftime('%s','now')-22*3600)*1000 WHERE id = 'job-firm-02';
UPDATE jobs_firm SET created_at = (strftime('%s','now')-3*86400)*1000 WHERE id = 'job-firm-03';
