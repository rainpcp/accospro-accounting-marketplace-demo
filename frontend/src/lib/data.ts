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
  "วางระบบบัญชี",
] as const;

// Buyer-language (หน้า Home) → ค่าจริงที่ใช้กรอง firms
// แก้บั๊ก: เดิม Home ตัดแค่คำว่า "รายเดือน" ทำให้ "ตรวจสอบบัญชี" ค้นไม่เจอ
// และ "วางระบบบัญชี" ไม่มีใน FIRM_CATEGORIES เลย
export const HOME_TO_FIRM_CATEGORY: Record<string, string> = {
  "ปิดงบรายเดือน": "ปิดงบ",
  "ยื่นภาษี": "ยื่นภาษี",
  "เงินเดือน": "เงินเดือน",
  "กระทบยอด": "กระทบยอด",
  "ตรวจสอบบัญชี": "ตรวจสอบ",
  "วางระบบบัญชี": "วางระบบบัญชี",
};

export const toFirmCategory = (homeLabel: string): string =>
  HOME_TO_FIRM_CATEGORY[homeLabel] ?? homeLabel;

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
