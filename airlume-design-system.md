# AirLume.AI Style — World-Class UX/UI Design System Spec
> สกัดจากภาพ Reference: Landing Page `AirLume.AI — Save Time & Money On Every Trip`
> วัตถุประสงค์: ใช้เป็น Design Guideline เพื่อนำไปปรับใช้กับหน้าเว็บไซต์อื่นได้ทันที (Framework-agnostic + พร้อม Tailwind/CSS Tokens)

---

## 1. Design Philosophy (ปรัชญาการออกแบบ)

1. **Dark Hero → Light Content Contrast:** เปิดด้วย Hero สีเข้ม (Midnight Navy) เพื่อสร้างความพรีเมียม + AI-Tech Feeling แล้วตัดเข้าช่วงเนื้อหาสีอ่อน (Off-white) เพื่อให้อ่านง่าย ลด Cognitive Load
2. **Center-Aligned Hero, Value-First:** ทุกอย่างชี้ไปที่ Value Proposition เดียว: `Save Time & Money On Every Trip` — สั้น ชัด จำง่าย
3. **Floating Cards Storytelling:** ไม่เล่า feature ด้วย text อย่างเดียว แต่ใช้ UI Mock Card ลอย 3 ใบเล่าเรื่อง (Points / Smart Search / Best Deal) = Show, Don't Tell
4. **Soft SaaS Minimalism + Glassmorphism:** การ์ดโค้งมน เงาฟุ้ง ขอบเรืองแสง ฟีลระดับ Stripe / Linear / Airbnb + AI Startup
5. **Progressive Disclosure:** Hero → Proof (cards) → Features Grid (8 cards) → (ต่อด้วย How it works / Pricing / FAQ)

---

## 2. Color System

### 2.1 Core Palette (คัดจากภาพจริง)

| Token | HEX | Usage |
|-------|-----|-------|
| `navy-950` | `#060A2E` / `#080C38` | Hero Background หลัก |
| `navy-900` | `#0E1445` | Gradient ด้านข้าง Hero |
| `primary-600` | `#2E3DFF` / `#3347FF` | CTA Button, Active Feature Card, Icon |
| `primary-500` | `#4F63FF` | Hover, Glow, Badge Text |
| `primary-100` | `#E8EBFF` | Icon Circle BG, Pill Label BG |
| `primary-50` | `#F2F4FF` | Card Subtle BG |
| `light-bg` | `#F6F7FB` | Features Section Background |
| `white` | `#FFFFFF` | Cards, Text บนพื้นเข้ม |
| `muted` | `#8A8FA8` / `#9AA0B8` | Body / Subtitle / Description |
| `ink` | `#12163A` / `#1A1F4B` | Heading บนพื้นสว่าง |
| `accent-sky` | `#7BCBFF` | Sparkle / Light Streak / Glow |
| `success` | `#22C55E` | Badge `Ready`, % Satisfied (ใช้น้อย) |
| `warning` | `#F59E0B` | Emoji/Alert เล็กน้อย เช่น 🔥 |

### 2.2 Gradient Recipes

```css
/* Hero Background */
--hero-bg: radial-gradient(1200px 600px at 50% -10%, #1E2A8A 0%, #0A0F4A 35%, #060A2E 100%);

/* Vertical Light Pillars (ลายเส้นแสงแนวตั้งใน Hero) */
--pillar: linear-gradient(180deg, rgba(123,203,255,0) 0%, rgba(79,99,255,0.6) 50%, rgba(123,203,255,0) 100%);

/* Glass Card Border Glow (การ์ดขวา Best Deal Found) */
--glass-border: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(79,99,255,0.3));
--glass-bg: linear-gradient(135deg, rgba(30,42,138,0.85), rgba(6,10,46,0.75));

/* CTA Button */
--cta-bg: linear-gradient(90deg, #3347FF 0%, #5B6CFF 100%);
```

### 2.3 Text Contrast Rule
- บน `navy-950`: Heading `#FFFFFF` (100%), Body `#B8BDD6` (70% opacity), Link Nav `#C2C6DD` ยกเว้น Active `#FFFFFF` + Bold
- บน `light-bg`: Heading `#12163A`, Body `#6B7194`, Link `Learn more` `#12163A` + ลูกศร `→`

---

## 3. Typography

**Font Style:** Geometric Humanist Sans — ใช้ `Inter`, `Plus Jakarta Sans`, หรือ `Sora` + `IBM Plex Sans Thai` สำหรับภาษาไทย

| Level | Size (Desktop) | Weight | Line-Height | Tracking | Usage |
|-------|----------------|--------|-------------|----------|-------|
| Display / Hero H1 | 48–64px | 800 ExtraBold | 1.05–1.1 | -0.03em | `Save Time & Money...` 2 บรรทัด จัดกลาง |
| Section H2 | 36–44px | 700 Bold | 1.15 | -0.02em | `AI-Powered Features, Travel...` |
| Card Title | 15–16px | 700 | 1.3 | -0.01em | ชื่อ Feature 2 บรรทัด |
| Body | 14–16px | 400 | 1.6 | 0 | Subtitle Hero / Description |
| Small / Caption | 12–13px | 500 | 1.5 | +0.01em | `Last Update`, `Saved 28%`, Badge |
| Number Highlight | 28–32px | 800 | 1 | -0.02em | `13,200`, `Only $179`, `94%` |
| Button | 14px | 600 SemiBold | 1 | 0 | CTA Pill |

**Rules:**
- H1/H2 ใช้ Title Case + Bold ตัด 2 บรรทัด ไม่เกิน 10 คำ
- Subtitle ใช้ sentence case สี muted ยาวไม่เกิน 2 บรรทัด กว้าง max 620px จัดกลาง
- ตัวเลขต้องใหญ่กว่าตัวอักษร 2x เพื่อสร้าง Focal Point

---

## 4. Layout & Grid System

### 4.1 Page Frame
- Max Width: `1200px` ตรงกลาง (`margin: 0 auto`)
- Outer Page BG (นอกเฟรม): `#B8BED6` เทาอมฟ้า + ตัวอักษรยักษ์โปร่ง `AIRLUME` ด้านหลัง (Watermark Hero Presentation Style)
- Main Card Frame: `border-radius: 0px` เต็มจอในภาพจริง แต่เมื่อเอาไปใช้เว็บจริงแนะนำ `max-width: 1280px` + ไม่ต้องมีขอบนอก

### 4.2 Navbar (Top Bar)
```
[Logo left] ........ [Menu center] ........ [Log In + Contact Us right]
Height: 72px, Padding: 24px 40px, Position: absolute over hero (transparent)
```
- Logo: ไอคอน + `AirLume.Ai` 16px Bold ขาว
- Menu: 5 items, 13px, gap 28px, Active (`Home`) ขาว Bold, ที่เหลือเทา
- Right: `Log In` text button 13px + `Contact Us` pill button (bg `#4F63FF`, padding `10px 24px`, radius `999px`)

### 4.3 Hero Section (Dark)
- Padding: `96px 24px 180px` (เผื่อพื้นที่ให้ Floating Cards ล้นลงมา)
- Structure แนวตั้งกลาง (Center Stack):
  1. Pill Badge: `Fly Smarter With Airlume.AI` — bg `rgba(255,255,255,0.08)`, border `1px rgba(255,255,255,0.12)`, radius `999px`, font 12px, padding `8px 16px`
  2. H1 48-64px ขาว
  3. Subtitle เทา 14px
  4. CTA `Search Flights Now →` — pill blue + วงกลมลูกศรขาวด้านขวาในปุ่ม
  5. Floating Cards Row (3 columns): `grid-template-columns: 0.9fr 1fr 0.9fr`, gap 24px, `margin-top: 48px`, `align-items: center` การ์ดกลางสูงกว่าเพื่อน 40px
- Decor: เส้นประโค้ง + ไอคอนเครื่องบินเล็กด้านซ้าย H1, จรวดเล็กด้านขวาบน (Playful Micro-Illustration)

### 4.4 Curved Transition (จุดเด่นระดับโลก)
- ใช้ SVG Wave / Curve สี `#F6F7FB` คร่อมระหว่าง Hero เข้ม → Section สว่าง
- การ์ดกลางวางคร่อมรอยต่อพอดี ทำให้เกิด Depth (Z-index: Cards > Curve)
- Implement:
```css
.curve-divider {
  height: 80px;
  background: #F6F7FB;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  margin-top: -80px;
  position: relative;
  z-index: 1;
}
.floating-cards { position: relative; z-index: 2; margin-bottom: -60px; }
```

### 4.5 Features Section (Light)
- BG: `#F6F7FB`, Padding: `100px 40px`, text-align center
- Pill Label: `AI Features Section` — bg `#E8EBFF`, text `#4F63FF`, 12px, radius 999px, padding 6px 16px
- H2 + Subtitle (เหมือน Hero แต่สีเข้ม)
- Grid: `grid-template-columns: repeat(4, 1fr)`, gap `20px`, margin-top `48px`
  - Row 1: Card 1 (Active น้ำเงินเข้ม) + 3 Cards ขาว
  - Row 2: 4 Cards ขาว
- Responsive: Desktop 4 cols → Tablet 2 cols → Mobile 1 col

---

## 5. Components Spec (ถอดแบบ 1:1)

### 5.1 Pill Button + Circle Arrow (Primary CTA)
- Height 48px, Radius 999px, BG Gradient Blue, Padding left 24px, right 6px
- ด้านในขวา: วงกลมขาว 36px + ลูกศร `→` สีน้ำเงิน
- Shadow: `0 8px 24px rgba(51,71,255,0.45)`
- Hover: translateY(-2px) + shadow เข้มขึ้น

```html
<button class="cta">
  Search Flights Now <span class="cta-arrow">→</span>
</button>
```

### 5.2 Floating Card — Left (Points)
- Size: ~280×200px, BG White, Radius 20px, Padding 20px
- Shadow: `0 20px 60px rgba(6,10,46,0.25)`
- ภายใน: Label 12px Bold + `Last Update` 11px muted + ตัวเลข `13,200` 28px สี primary + Badge `Ready` + แถบ `Next Reward` + ปุ่มวงกลม `→`
- ด้านล่างมี 2 Mini Chat Skeleton Cards ซ้อนเหลื่อม (สร้างมิติ)

### 5.3 Floating Card — Center (Smart Search / Hero Card)
- Size 320×380px, BG `#FFFFFF`, Radius 28px, Padding 24px, สูงที่สุด
- Top Pill: `Airlume Smart Search` 12px bg `#F2F4FF`
- Title: `Scanning 200+` (ดำ Bold) + `Airlines In Real-Time` (เทา)
- Row: วงกลม Progress `94%` (stroke blue 6px) + text 12px
- Image: รูปเครื่องบิน Radius 16px, aspect 16/10, object-fit cover
- Bottom Floating Badge: `90% Users Satisfied` + Avatar Stack (Social Proof)

### 5.4 Floating Card — Right (Best Deal / Glass)
- Size 280×340px, BG Glass Dark + Border Glow 1.5px, Radius 24px
- Backdrop-filter: blur(20px), Inner Glow `inset 0 1px 0 rgba(255,255,255,0.3)`
- Outer Glow: `0 0 40px rgba(79,99,255,0.5)`
- ภายใน: Pill `Best Deal Found`, `NYC → LAX` 20px Bold ขาว, `Only $179` 24px, เส้นประวงกลม + ปุ่มวงกลมขาว `→` มุมล่างซ้าย

### 5.5 Feature Card (Grid 8 ใบ)
- Size: 1fr, Min-height 220px, Radius 20px, Padding 24px, text-align left
- Default (ขาว): BG White, Border `1px solid #EDEFF7`, Shadow `0 4px 20px rgba(18,22,58,0.04)`
- Active (น้ำเงิน): BG `#1A22CE` / `#2026D6`, Text ขาว, ไม่มี border
- Icon: วงกลม 44px BG `#EDEFFF` (Active = `rgba(255,255,255,0.15)`) + ไอคอน line style 20px สี `#3347FF` (Active = ขาว)
- Title 15px Bold → Desc 12.5px muted (Active = `rgba(255,255,255,0.75)`) → Link `Learn more →` 13px SemiBold
- Hover: translateY(-4px), shadow `0 12px 32px rgba(18,22,58,0.10)`

---

## 6. Effects, Radius, Shadow Tokens

```css
:root {
  --radius-pill: 999px;
  --radius-card: 20px;
  --radius-card-lg: 28px;
  --radius-img: 16px;

  --shadow-card: 0 20px 60px rgba(6,10,46,0.25);
  --shadow-soft: 0 4px 20px rgba(18,22,58,0.06);
  --shadow-cta: 0 8px 24px rgba(51,71,255,0.45);
  --shadow-glow: 0 0 40px rgba(79,99,255,0.5);

  --blur-glass: blur(20px);
}
```

- ทุกการ์ดต้องมี Radius ≥20px (Friendly Tech)
- ปุ่มทุกปุ่มเป็น Pill (999px) เท่านั้น ห้ามใช้ปุ่มเหลี่ยม
- การ์ดขาวใช้เงาฟุ้งอ่อน การ์ดลอยบน Hero ใช้เงาเข้ม + Glow

---

## 7. UX Patterns ระดับโลกที่ต้องลอกไปใช้

1. **3-Second Value Test:** H1 + Sub + CTA เห็นครบโดยไม่ต้อง scroll
2. **Bait → Proof → Action:** Badge (ดึงดูด) → ตัวเลข `13,200 / 94% / $179` (พิสูจน์) → CTA (ปิดการขาย)
3. **Social Proof Micro-Badge:** `90% Users Satisfied + Avatar Stack` วางทับรูป — เพิ่ม Trust โดยไม่เปลืองพื้นที่
4. **Loss Aversion Copy:** `Price expected to drop...`, `Saved 28%`, `Next Reward $20 off` — กระตุ้นให้รีบ action
5. **One Active Card:** ใน Grid 8 ใบ ให้ Active แค่ใบแรก (สีน้ำเงิน) เพื่อนำสายตา
6. **Progressive Visual Weight:** Hero หนัก (เข้ม+ใหญ่) → Features เบา (สว่าง+การ์ดเล็ก) ทำให้สายตาไหลลงธรรมชาติ
7. **Arrow Affordance:** ทุกการ์ดมี `→` — บอกว่า "กดได้" โดยไม่ต้องใช้ปุ่มใหญ่

---

## 8. Responsive & Accessibility

- **Breakpoints:** `1280 / 1024 / 768 / 480`
  - ≤1024px: Floating Cards 3→1 column stack, การ์ดกลางขึ้นก่อน
  - ≤768px: Features Grid 4→2→1, H1 48px→32px, Navbar ซ่อนเมนูเป็น Hamburger
- **Touch:** CTA height ≥48px, Feature card ทั้งใบกดได้ (stretched-link)
- **A11y:** Contrast ขาวบนน้ำเงิน ≥4.5:1, ปุ่มมี focus-ring `2px solid #7BCBFF`, รูปเครื่องบินต้องมี alt, Progress 94% ต้องมี aria-label

---

## 9. Tailwind Quick Tokens (พร้อมเอาไปวาง)

```js
// tailwind.config.js extend
colors: {
  navy: { 950: '#060A2E', 900: '#0E1445' },
  primary: { 50:'#F2F4FF', 100:'#E8EBFF', 500:'#4F63FF', 600:'#3347FF' },
  light: '#F6F7FB',
  ink: '#12163A',
  muted: '#6B7194',
},
borderRadius: { card: '20px', 'card-lg': '28px', pill: '999px' },
boxShadow: {
  card: '0 20px 60px rgba(6,10,46,0.25)',
  soft: '0 4px 20px rgba(18,22,58,0.06)',
  cta: '0 8px 24px rgba(51,71,255,0.45)',
  glow: '0 0 40px rgba(79,99,255,0.5)',
},
fontFamily: { sans: ['Plus Jakarta Sans','Inter','IBM Plex Sans Thai','sans-serif'] }
```

---

## 10. Checklist เมื่อเอาไปใช้กับเว็บใหม่

- [ ] Hero เข้ม + H1 2 บรรทัดกลาง + Pill Badge + Sub 2 บรรทัด + CTA Pill ที่มีวงกลมลูกศร
- [ ] Floating Cards 3 ใบเล่าเรื่อง (ซ้าย: ตัวเลข/แต้ม, กลาง: search/progress + รูป, ขวา: glass deal)
- [ ] Curve Divider เชื่อม Hero → Section สว่าง
- [ ] Section สว่าง: Pill Label + H2 + Sub + Grid 4 cols (ใบแรก Active น้ำเงิน)
- [ ] Icon วงกลมอ่อน + Title Bold + Desc เทา + `Learn more →`
- [ ] Radius 20-28px / ปุ่ม Pill / เงาฟุ้ง / Glass + Glow ครบทุกระบบ
- [ ] ตัวเลขเด่น (Price / % / Points) ใหญ่กว่าตัวอักษร 2 เท่า
- [ ] Social Proof Badge + Avatar Stack
- [ ] Responsive 4→2→1 และ H1 ย่อบนมือถือ

> ใช้ไฟล์นี้เป็น Single Source of Truth — ถ้าจะทำหน้าใหม่ ให้ยึด Color, Type Scale, Radius, Shadow และโครง Hero → Curve → Features Grid ตามนี้ จะได้ฟีลพรีเมียม AI SaaS ระดับโลกแบบในภาพ 100%
