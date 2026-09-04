-- เติมหมวด "วางระบบบัญชี" ให้ firm ตัวอย่าง (กัน chip หน้า Home ค้นแล้วว่างเปล่า)
-- Apply: wrangler d1 execute accospro-marketplace-demo-db --remote --file=./migrations/0006_firm_categories.sql

UPDATE firms SET categories = '["ปิดงบ","ยื่นภาษี","วางระบบบัญชี"]' WHERE id = 'firm-10';
