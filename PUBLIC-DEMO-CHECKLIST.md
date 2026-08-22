# Public Demo Checklist

ก่อนเปิด Repository เป็น Public:

- [x] เปลี่ยนชื่อบริษัทเป็นชื่อสมมติ NEXORA DATAWORKS
- [x] เปลี่ยนที่อยู่ เบอร์โทร และเลขผู้เสียภาษีเป็นข้อมูล Demo
- [x] เปลี่ยนรายชื่อผู้ผลิต preset เป็นชื่อสมมติ
- [x] ไม่รวมฐานข้อมูล import จริงจากโปรเจกต์ต้นฉบับ
- [x] ไม่รวม Firebase config / Firestore rules / Firebase Auth runtime
- [x] ไม่รวม Google Drive OAuth runtime
- [x] ข้อมูลที่ผู้ชมกรอกเก็บเฉพาะ Browser ของผู้ชม
- [x] มีปุ่มรีเซ็ตข้อมูล Demo
- [x] มีข้อมูลสังเคราะห์เริ่มต้นสำหรับ Dashboard และ Analytics
- [x] ตั้ง Vite `base: './'` เพื่อรองรับ GitHub Pages repository path
- [x] มี GitHub Actions สำหรับ build/deploy

## ควรตรวจเพิ่มก่อนเผยแพร่

- เปิด Live Demo ใน Incognito แล้วลองบันทึก ใบเสนอราคา → สั่งผลิต → ใบส่งสินค้า → ใบเสร็จ
- ตรวจว่าปิดหน้าแล้วเปิดใหม่ ข้อมูลทดลองยังอยู่เฉพาะ Browser นั้น
- กด `รีเซ็ตข้อมูล Demo` และตรวจว่ากลับเป็นข้อมูลตัวอย่าง
- อย่านำ `.env`, Firebase project keys, Google Drive folder IDs หรือ JSON ฐานข้อมูลจริงเข้ามาใส่ใน repo นี้
