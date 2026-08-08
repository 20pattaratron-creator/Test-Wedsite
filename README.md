# Comform Esan ERP — Interactive Portfolio Demo

เวอร์ชันนี้ทำขึ้นสำหรับใช้เป็น **Portfolio / Resume Project บน GitHub Pages** โดยนำหน้าตาและ business workflow จากระบบต้นฉบับมาทำเป็น sandbox ที่ผู้เข้าชมสามารถกรอกข้อมูลและทดสอบระบบได้จริงใน browser ของตนเอง

## สิ่งที่ผู้เข้าชมทดลองได้

- Dashboard รวม / ขอนแก่น / อุบล พร้อม KPI และเป้าหมายรายเดือน
- Business Analytics, Forecast, Pareto/ABC และ Data Quality
- กรอกและบันทึกใบเสนอราคา
- กรอกและบันทึกสั่งผลิตสินค้า พร้อมต้นทุน ราคาขาย VAT ค่าคอมมิชชัน และกำไร
- สร้างหลักฐานใบส่งสินค้าจากรายการสั่งผลิต
- สร้างหลักฐานใบเสร็จจากบิลที่มีอยู่ และเปลี่ยนสถานะการชำระ
- บันทึกค่าใช้จ่าย
- ดูรายการย้อนหลังและศูนย์เชื่อมโยงเอกสาร
- สร้างแบบฟอร์มใบส่งสินค้า/ใบกำกับภาษีและใบเสร็จ พร้อม Export PDF
- Export Excel / JSON และ Import JSON เพื่อทดสอบ
- แนบรูป/PDF โดยเก็บใน IndexedDB ของ browser

## Portfolio Sandbox / ความปลอดภัย

Demo นี้ตั้งใจ **ไม่เชื่อม Firebase Authentication, Firestore หรือ Google Drive** และไม่มี API key/secret ของระบบ Production

ข้อมูลที่ผู้เข้าชมกรอกถูกเก็บเฉพาะเครื่องของผู้เข้าชม:

- `localStorage` — ข้อมูลเอกสาร, Dashboard และค่าเป้าหมาย
- `IndexedDB` — ไฟล์แนบที่ผู้เข้าชมเลือก

ผู้เข้าชมแต่ละคนจึงมีข้อมูลแยกกัน ข้อมูลไม่ถูกส่งกลับมาหาเจ้าของ Portfolio และไม่กระทบข้อมูลของผู้เข้าชมคนอื่น

ครั้งแรกที่เปิดหน้าเว็บ ระบบจะเติม **synthetic sample data** เพื่อให้ Dashboard/Analytics มีข้อมูลทันที จากแถบด้านบนสามารถกด:

- **เติมข้อมูลตัวอย่างใหม่** — รีเซ็ตกลับเป็น sample data
- **ล้างข้อมูลที่ทดสอบ** — ล้าง localStorage/IndexedDB ของ Demo ใน browser นั้น
- **? วิธีทดลองระบบ** — แสดง workflow แนะนำสำหรับ Recruiter/ผู้เยี่ยมชม

## รันบนเครื่อง

เนื่องจากเป็น static site สามารถใช้เว็บเซิร์ฟเวอร์ธรรมดาได้ เช่น:

```bash
python -m http.server 8080
```

แล้วเปิด:

```text
http://localhost:8080
```

> ไม่แนะนำให้เปิด `index.html` ด้วย `file://` โดยตรง เพราะ browser บางตัวจำกัด ES Modules และ IndexedDB

## Deploy GitHub Pages

1. สร้าง GitHub repository ใหม่
2. Upload/Push ไฟล์ทั้งหมดในโฟลเดอร์นี้ไป branch `main`
3. ไปที่ **Settings → Pages**
4. ตั้ง **Source = GitHub Actions**
5. Workflow `.github/workflows/pages.yml` จะ deploy static site โดยตรง

URL จะมีรูปแบบประมาณ:

```text
https://USERNAME.github.io/REPOSITORY-NAME/
```

## External browser libraries

ฟังก์ชัน Export ใช้ browser libraries จาก CDN:

- SheetJS 0.18.5 — Excel
- html2canvas 1.4.1 — render เอกสาร
- jsPDF 2.5.1 — PDF

หาก CDN ถูกบล็อก ฟังก์ชันหลักในการกรอก/บันทึกข้อมูลและ Dashboard ยังทำงานแบบ local ได้ แต่ Excel/PDF อาจใช้ไม่ได้จนกว่า library จะโหลดสำเร็จ

## ก่อนเปิด Repository เป็น Public

- อย่าใส่ `.env.local`
- อย่าใส่ Firebase/Google OAuth credentials ของ Production
- อย่าใส่ข้อมูลลูกค้าจริง ยอดขายจริง เลขผู้เสียภาษีจริง ที่อยู่จริง หรือไฟล์หลักฐานจริง
- ใช้ repository ใหม่สำหรับ Portfolio Demo แยกจาก source repository ของ Production
- ตรวจ Git history ก่อนเปิด Public เพราะ secret ที่เคย commit จะยังอยู่ในประวัติแม้ลบออกจากไฟล์ปัจจุบันแล้ว

## ไฟล์สำคัญ

- `index.html` — UI หลักที่ปรับจากระบบต้นฉบับเป็น Portfolio Demo
- `style.css` — หน้าตาระบบหลัก
- `app.js` — business logic, forms, dashboard, analytics และ local storage
- `demo-mode.js` — synthetic sample data และ local-only sandbox
- `demo-ui.js` / `demo-mode.css` — แถบ Demo, reset/clear และคู่มือทดลอง
- `delivery-tax-document.js` — แบบฟอร์มใบส่งสินค้า/ใบกำกับภาษี
- `receipt-document.js` — แบบฟอร์มใบเสร็จรับเงิน
