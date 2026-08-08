# Public Safety Checklist — Interactive Portfolio Demo

ตรวจรายการนี้ก่อนเปิด GitHub repository เป็น Public

- [ ] ใช้เฉพาะข้อมูลสังเคราะห์/ข้อมูลตัวอย่าง ไม่มีข้อมูลลูกค้า ยอดขาย เอกสาร หรือไฟล์แนบจริง
- [ ] ไม่มี `.env.local`, Firebase API configuration สำหรับ production, OAuth Client ID, access token หรือ service-account key
- [ ] ไม่มี Firebase Authentication / Firestore production connection ในหน้า Demo
- [ ] ไม่มี Google Drive production connection ในหน้า Demo
- [ ] ชื่อ ที่อยู่ เบอร์โทร เลขประจำตัวผู้เสียภาษี และข้อมูลลูกค้าในเอกสารตัวอย่างเป็นข้อมูล Demo
- [ ] ผู้เข้าชมบันทึกข้อมูลลง `localStorage` ของ browser ของตนเองเท่านั้น
- [ ] ไฟล์แนบที่ทดลองอัปโหลดถูกเก็บใน IndexedDB ของ browser ของผู้เข้าชมเท่านั้น
- [ ] มีปุ่มล้างข้อมูล Demo และเติมข้อมูลตัวอย่างใหม่
- [ ] ตรวจ Git history ก่อน Public เพื่อให้แน่ใจว่าไม่เคย commit secret หรือข้อมูลจริงมาก่อน

> แนะนำ: สร้าง repository ใหม่สำหรับ Portfolio Demo แยกจาก repository ระบบ production เพื่อไม่ให้ Git history เก่าหรือไฟล์ที่เคยลบแล้วถูกเปิดเผยโดยไม่ตั้งใจ
