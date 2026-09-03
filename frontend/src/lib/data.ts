// Buyer-language categories (3–7 paths, ไม่ใช้ศัพท์ภายใน)
export const JOB_CATEGORIES = [
  "ปิดงบรายเดือน",
  "ยื่นภาษี",
  "เงินเดือน",
  "กระทบยอด",
  "ตรวจสอบบัญชี",
  "วางระบบบัญชี",
] as const;

export const FIRM_CATEGORIES = [
  "ปิดงบ",
  "ยื่นภาษี",
  "เงินเดือน",
  "กระทบยอด",
  "BOI",
  "ตรวจสอบ",
] as const;

export const TALENT_SKILLS = [
  "กระทบยอด",
  "ปิดงบ",
  "ยื่นภาษี",
  "เงินเดือน",
  "e-Tax",
  "BOI",
] as const;

// จังหวัดที่มี supply ใน demo + กทม.ปริมณฑล (select แทนช่องพิมพ์ฟรี)
export const PROVINCES = [
  "กรุงเทพมหานคร",
  "นนทบุรี",
  "ปทุมธานี",
  "ชลบุรี",
  "ระยอง",
  "เชียงใหม่",
  "ขอนแก่น",
  "นครราชสีมา",
  "ภูเก็ต",
  "สงขลา",
] as const;

export const baht = (n: number) => `฿${Number(n || 0).toLocaleString("th-TH")}`;
