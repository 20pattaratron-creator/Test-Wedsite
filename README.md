# NEXORA DATAWORKS — ERP & Business Analytics Public Demo

Portfolio sandbox สำหรับนำขึ้น GitHub Pages โดยดัดแปลงจากระบบ ERP ต้นแบบให้ปลอดภัยสำหรับการเผยแพร่สาธารณะ

## Public-demo safety

- บริษัท `NEXORA DATAWORKS CO., LTD.` เป็นชื่อสมมติสำหรับ Demo เท่านั้น
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
