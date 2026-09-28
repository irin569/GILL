# 🎮 GAME STORE - ร้านขายเกมออนไลน์แบบครบวงจร (Full-Stack Digital Game Key Platform)

ระบบร้านขายเกมออนไลน์และดิจิทัลไลเซนส์ (Digital Product & Game Key Distribution) แบบครบวงจร พัฒนาด้วย **React 19, TypeScript, Tailwind CSS v4, Node.js/Express** มีทั้งหน้าร้าน (Storefront) ระบบสั่งซื้อและชำระเงินอัตโนมัติ (Instant Digital Auto-Delivery) และระบบจัดการหลังบ้านระดับองค์กร (Admin & Staff Backoffice) พร้อม Role-Based Access Control (RBAC), Audit Log, และระบบสต็อกคีย์ที่ไม่ขายซ้ำ

---

## 🚀 ฟีเจอร์หลักของระบบ

### 1. ระบบหน้าร้าน (Storefront)
- **Hero Banner:** สไลด์แสดงเกมไฮไลต์ยอดนิยม พร้อมปุ่มซื้อทันทีและดูข้อมูล
- **Flash Sale Section:** นาฬิกานับถอยหลังสด (Live Countdown Timer) พร้อมแถบแสดงจำนวนคีย์ที่เหลือ
- **ระบบค้นหาและตัวกรองละเอียด (Search & Filter):**
  - ค้นหาด้วยชื่อเกม, SKU, แท็ก
  - กรองตามหมวดหมู่: Game Key, Gift Card, DLC, Bundle, Game Top-up
  - กรองตามแพลตฟอร์ม: Steam, Epic Games, PlayStation, Xbox, Nintendo, PC
  - กรองตามโซน: Global, TH/Asia, US, EU
  - กรองตามแนวเกม: Action, RPG, Open World, Shooter, Strategy, Sports, Adventure
  - เรียงลำดับ: แนะนำ, ราคา ต่ำ-สูง, ราคา สูง-ต่ำ, เรตติ้ง, ขายดี, มาใหม่
- **หน้ารายละเอียดสินค้า (Product Detail Modal):**
  - แกลเลอรีรูปภาพและสกรีนช็อต
  - ตารางเปรียบเทียบสเปกคอมพิวเตอร์ (Minimum vs Recommended System Requirements)
  - จำนวนสต็อกคีย์คงเหลือแบบ Real-time
  - ระบบรีวิวพร้อมสัญลักษณ์ "ผู้ซื้อที่ยืนยันแล้ว" (Verified Purchase)
  - สินค้าแนะนำที่เกี่ยวข้อง
  - ปุ่มใส่ตะกร้า (Add to Cart), ซื้อทันที (Buy Now), และบันทึกสิ่งที่อยากได้ (Wishlist)

### 2. ระบบตะกร้า & Checkout & ชำระเงิน (Payment Module)
- **ตะกร้าสินค้า (Cart Drawer):**
  - เลือกสินค้าเป็นรายชิ้น, ปรับเพิ่ม-ลดจำนวนตามสต็อกที่มีอยู่จริง
  - ระบบคูปองส่วนลดแบบ Real-time (เช่น `GAME2026` ลด 20%, `WELCOME10` ลด 10%)
  - สรุปยอดรวม, ส่วนลด, ค่าธรรมเนียม
- **การชำระเงินและส่งมอบสินค้า (Instant Auto-Delivery):**
  - **Thai QR PromptPay:** แสดง QR Code รองรับแอปธนาคาร พร้อมระบบตรวจยอดจำลอง
  - **บัตรเครดิต/เดบิต (Visa/Mastercard):** รองรับโครงสร้างความปลอดภัย PCI-DSS โดยไม่บันทึกเลขบัตรเครดิตเต็มรูปแบบลงฐานข้อมูลร้าน
  - **โอนเงินผ่านธนาคาร & Digital Wallet (TrueMoney):** รองรับการตรวจสอบยอด
  - **ส่งมอบ Game Key ทันที:** เมื่อชำระเงินสำเร็จ ระบบจะตัดสต็อกคีย์ที่สถานะ `available` เปลี่ยนเป็น `sold` พร้อมระบุ Order ID, User ID และส่งรหัสให้ลูกค้าคัดลอกทันทีบนหน้าจอ พร้อมคำแนะนำการ Redeem คีย์สำหรับ Steam, Epic และ PlayStation

### 3. ระบบสมาชิก (Customer Dashboard)
- ภาพรวมบัญชี (ยอดเงินคงเหลือในกระเป๋า, แต้มสะสม Rewards)
- ประวัติคำสั่งซื้อทั้งหมด พร้อมใบเสร็จและสถานะการจัดส่ง
- **คลัง Game Keys ส่วนตัว:** รหัสคีย์ทั้งหมดที่เคยซื้อ พร้อมปุ่มคัดลอก 1 คลิก
- รายการสิ่งที่อยากได้ (Wishlist) พร้อมปุ่มย้ายลงตะกร้าทันที
- คลังคูปองส่วนลดที่ใช้งานได้
- ระบบแจ้งปัญหา & สนับสนุน (Support Tickets) แชตตอบโต้กับทีมงานแบบ Real-time
- แก้ไขโปรไฟล์และเปลี่ยนรหัสผ่าน

### 4. ระบบหลังบ้าน (Admin & Staff Backoffice)
- **Dashboard วิเคราะห์ข้อมูล:**
  - ยอดขายวันนี้, ยอดขายเดือนนี้, รายได้รวม, จำนวนคำสั่งซื้อ, สมาชิกทั้งหมด
  - กราฟแท่งแสดงแนวโน้มยอดขายรายสัปดาห์ (Weekly Sales Trend)
  - กราฟสัดส่วนยอดขายตามแพลตฟอร์ม (Platform Distribution)
  - ตารางแจ้งเตือนคีย์เหลือน้อย (Low Stock Alert)
  - ตารางคำสั่งซื้อล่าสุด
- **การจัดการสินค้า (Products CRUD):** เพิ่ม, แก้ไข, ลบ, จัดการราคา, ต้นทุน, ส่วนลด, รูปภาพ และสเปก
- **คลัง Game Keys ดิจิทัล:**
  - เพิ่มคีย์เดี่ยว หรือนำเข้าคีย์แบบกลุ่ม (Bulk Import / CSV)
  - ตรวจสอบคีย์ซ้ำในระบบอัตโนมัติ (ป้องกันข้อผิดพลาด)
  - ดูสถานะคีย์: Available, Sold, Revoked พร้อมประวัติ Order ID ที่ซื้อไป
- **การจัดการคำสั่งซื้อ (Orders & Refunds):** เปลี่ยนสถานะคำสั่งซื้อ และระบบคืนเงินพร้อมบันทึกเหตุผล
- **การจัดการลูกค้า (Customers):** ดูรายชื่อ, ยอดซื้อสะสม, ป้าย VIP, และระบบระงับบัญชี (Ban)
- **การตลาดและโปรโมชั่น (Coupons & Promotions):** กำหนดโค้ดส่วนลด %, จำนวนเงิน, ขั้นต่ำ, ลดสูงสุด, วันหมดอายุ, สิทธิ์การใช้
- **ระบบ Support Tickets:** ตอบกลับข้อความลูกค้า, เปลี่ยนสถานะคำร้อง (Open, Pending, Answered, Closed)
- **บันทึกการกระทำในระบบ (Audit Trail Log):** บันทึกทุก Action ของแอดมิน (ผู้ทำ, บทบาท, กิจกรรม, เป้าหมาย, IP, วันเวลา)
- **ตั้งค่าระบบร้านค้า & กู้คืนข้อมูล (Settings & Demo Reset):** เปิด/ปิดช่องทางชำระเงิน, กำหนดเกณฑ์แจ้งเตือนสต็อก, สิทธิ์ Role Matrix, และปุ่ม Reset ข้อมูลจำลอง

---

## 🔑 บัญชีทดสอบระบบ (Demo Accounts)

ระบบมีฟังก์ชัน **1-Click Demo Switcher** ที่มุมขวาบนของ Navbar และในหน้าต่างเข้าสู่ระบบ (Login Modal) สามารถคลิกเพื่อสลับบทบาทได้ทันที:

| บทบาท (Role) | อีเมล (Email) | สิทธิ์การเข้าถึง |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@gamestore.local` | สิทธิ์สูงสุดทุกเมนูหลังบ้าน, ตั้งค่าร้าน, Audit Log, จัดการคีย์ |
| **Store Staff** | `staff@gamestore.local` | จัดการสินค้า, ออเดอร์, นำเข้าคีย์, ตอบ Ticket ลูกค้า |
| **VIP Customer** | `vip@gamestore.local` | ลูกค้าประจำ มียอดซื้อ, มี Game Keys ในคลัง, มีแต้มสะสม |
| **Regular Customer** | `user@gamestore.local` | ลูกค้าทั่วไป มีประวัติสั่งซื้อบัตรเติมเงิน Steam |

*(รหัสผ่านในโหมดทดสอบสามารถกรอกอะไรก็ได้ เช่น `123456` หรือคลิกปุ่ม 1-Click Demo)*

---

## 🛠 การติดตั้งและรันโปรเจกต์ (Installation & Development)

### ข้อกำหนดระบบ (Prerequisites)
- Node.js version 18.0 ขึ้นไป
- npm หรือ pnpm หรือ yarn

### ขั้นตอนการรัน
```bash
# 1. ติดตั้ง Dependencies ทั้งหมด
npm install

# 2. คัดลอกไฟล์ Environment Variables
cp .env.example .env

# 3. เริ่มต้น Development Server
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema Architecture)

ระบบออกแบบตามมาตรฐาน Relational / Document Store สามารถเชื่อมต่อกับ **Firebase Firestore** หรือ **PostgreSQL / Cloud SQL**:

```
+----------------+       +------------------+       +-----------------+
|     users      | 1   N |      orders      | 1   N |   order_items   |
+----------------+ <---> +------------------+ <---> +-----------------+
| id             |       | id               |       | id              |
| name, email    |       | user_id          |       | order_id        |
| role, phone    |       | subtotal, total  |       | product_id      |
| wallet_balance |       | status, fee      |       | delivered_keys  |
| points         |       | payment_method   |       | price, qty      |
+----------------+       +------------------+       +-----------------+
                                  |
                                  | 1
                                  |
                                  v N
+----------------+       +------------------+
|    products    | 1   N |    game_keys     |
+----------------+ <---> +------------------+
| id, sku, name  |       | id               |
| platform, cost |       | product_id       |
| price, stock   |       | key_string       |
| category       |       | status (avail/   |
| description    |       |         sold)    |
+----------------+       | order_id         |
                         +------------------+
```

---

## 💳 การเชื่อมต่อ Payment Gateway จริงใน Production

### 1. Thai QR PromptPay
ใช้ฟังก์ชันแปลงรหัส EMVCo QR Code มาตรฐานธนาคารแห่งประเทศไทย โดยตั้งค่า `VITE_PROMPTPAY_ID` เป็นเบอร์โทรศัพท์ร้าน หรือเลขประจำตัวผู้เสียภาษี 13 หลัก

### 2. บัตรเครดิต/เดบิต (เช่น Omise / GB Prime Pay / Stripe)
1. สมัครบัญชีผู้ให้บริการ Payment Gateway
2. นำ Public Key มาใส่ใน Frontend เพื่อสร้าง Card Token (เช่น `omise.createToken`)
3. ส่งเฉพาะ `token_id` ไปยัง Backend API
4. Backend ทำการ Charge ยอดเงินผ่าน Secret Key
5. เมื่อได้รับ Webhook แจ้งสถานะ `charge.complete` ให้เปลี่ยนสถานะ Order เป็น `Paid` และปลดล็อก Game Key ให้ลูกค้าทันที

---

## 🚢 ขั้นตอนการ Deploy สู่ Production

### การ Deploy บน Google Cloud Run / Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]
```

---

## 🛡️ มาตรการความปลอดภัย (Security & Compliance)
- **RBAC Strict Guard:** ลูกค้าไม่สามารถเข้าถึงหน้าหลังบ้าน Admin ได้เด็ดขาด
- **No Plaintext Credit Card:** ไม่มีการบันทึกเลขบัตรเครดิตลงฐานข้อมูลของระบบ
- **Digital Key Protection:** ซ่อนและ Mask รหัสคีย์ทั้งหมดจนกว่าสถานะคำสั่งซื้อจะถูกชำระเงินเรียบร้อย
- **Anti-Double Selling:** มีระบบ Lock และ Reserve คีย์แบบ Transactional ป้องกันการขายคีย์ซ้ำให้ลูกค้าคนละคน
