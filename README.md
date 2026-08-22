# DEMO WORKS 999 — ERP & Business Analytics Public Demo

Portfolio sandbox สำหรับนำขึ้น GitHub Pages โดยดัดแปลงจากระบบ ERP ต้นแบบให้ปลอดภัยสำหรับการเผยแพร่สาธารณะ

## Public-demo safety

- บริษัท `DEMO WORKS SOLUTIONS 999 CO., LTD.` เป็นชื่อสมมติที่ใช้เฉพาะ Portfolio Demo เท่านั้น
- ที่อยู่ เบอร์โทร เลขผู้เสียภาษี ลูกค้า ผู้ผลิต และยอดเงินเป็นข้อมูลสังเคราะห์
- ตัด Firebase Authentication, Firestore และ Google Drive Production ออกจาก runtime
- ข้อมูลที่ผู้เข้าชมกรอกเก็บใน `localStorage` / `IndexedDB` ของ Browser ของผู้เข้าชมเท่านั้น
- ผู้เข้าชมสามารถกด `รีเซ็ตข้อมูล Demo` เพื่อคืนข้อมูลตัวอย่างได้
- ไม่รวมไฟล์ import ฐานข้อมูลจริงหรือ Firestore rules/config ของระบบ Production

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

1. สร้าง repository ใหม่ เช่น `erp-business-analytics-demo`
2. Push ไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น branch `main`
3. GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**
4. Workflow `.github/workflows/pages.yml` จะ build และ deploy ให้อัตโนมัติ

> แนะนำให้ใช้ repository แยกจาก source production จริงเสมอ


## หน้าจอออกใบส่งสินค้า / ใบกำกับภาษี

เวอร์ชันนี้คืนหน้าจอเอกสารแบบ 2 คอลัมน์ตามระบบต้นฉบับ: ฟอร์มกรอกข้อมูลด้านซ้าย + Preview เอกสาร A4 แบบเรียลไทม์ด้านขวา พร้อม Save / Print / PDF / Download PDF

เปิดตรงได้ด้วย `?page=delivery-tax-doc` หลัง URL ของ GitHub Pages เช่น `https://USERNAME.github.io/REPOSITORY/?page=delivery-tax-doc`

เมนูนี้อ่านใบสั่งผลิตจาก localStorage ของ Demo โดยตรง จึงทดลองเลือกข้อมูลสั่งผลิตได้โดยไม่ต้องเชื่อม Firebase จริง
