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

export function fmtDateTime(ts: unknown): string {
  const t = Number(ts || 0);
  if (!t) return "-";
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
