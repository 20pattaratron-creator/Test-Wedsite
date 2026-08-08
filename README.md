# ERP & Business Analytics — Portfolio Demo (GitHub Pages)

เวอร์ชันนี้ทำขึ้นสำหรับใช้เป็น **Portfolio / Resume Showcase** โดยเฉพาะ และตั้งใจแยกออกจากระบบใช้งานจริง

## สิ่งที่ปรับเพื่อให้เปิดสาธารณะได้

- ใช้ **Synthetic / Mock Data 100%** ไม่ใช้ข้อมูลลูกค้า ยอดเงินจริง หรือเอกสารจริง
- ไม่เชื่อม Firebase, Firestore, Google Drive หรือระบบ Login จริง
- ไม่ต้องใช้ `.env` และไม่มี API key / OAuth secret
- แสดงแนวคิด Dashboard, Analytics, Document Workflow และ System Architecture ในหน้าเดียว
- Responsive และเปิดได้บน GitHub Pages โดยไม่ต้องมี backend

> ก่อน Publish ควรตรวจสิทธิ์การใช้โลโก้/ชื่อบริษัทอีกครั้ง หากเป็นทรัพย์สินของนายจ้างหรือลูกค้า

## แก้ข้อมูลส่วนตัวก่อนขึ้น GitHub

เปิด `app.js` แล้วแก้ค่าด้านบน:

```js
const PROFILE_LINKS = {
  github: "https://github.com/YOUR-USERNAME",
  linkedin: "https://www.linkedin.com/in/YOUR-PROFILE",
  email: "mailto:your.email@example.com",
  resume: "#resume"
};
```

คุณสามารถแก้ชื่อโปรเจกต์ คำอธิบาย และ Resume bullets ใน `index.html` ได้โดยตรง

## เปิดดูในเครื่อง

วิธีง่ายที่สุด:

```bash
python -m http.server 8080
```

จากนั้นเปิด `http://localhost:8080`

หรือใช้ VS Code extension เช่น Live Server ก็ได้

## Publish ด้วย GitHub Pages

1. สร้าง repository ใหม่ เช่น `erp-business-analytics-portfolio`
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น repository
3. Push ไปที่ branch `main`
4. ไปที่ **Settings → Pages → Build and deployment → Source → GitHub Actions**
5. Workflow `.github/workflows/pages.yml` จะ deploy ให้อัตโนมัติทุกครั้งที่ push เข้า `main`
6. URL ปกติจะเป็น `https://YOUR-USERNAME.github.io/REPOSITORY/`

## โครงสร้างไฟล์

```text
.
├── index.html
├── styles.css
├── app.js
├── assets/
│   ├── logo-blue.png
│   └── logo-green.png
├── .nojekyll
└── .github/
    └── workflows/
        └── pages.yml
```

## จุดเด่นที่เหมาะกับ Resume / Interview

- ERP workflow: quotation → production → delivery/invoice → receipt
- VAT / cost / profit business logic
- Business dashboard + monthly targets
- Forecasting and trend analysis
- Customer Pareto / ABC segmentation
- Data-quality monitoring and deduplication concepts
- Firebase / Firestore + Google Drive architecture (ในระบบต้นฉบับ)
- IndexedDB local fallback
- Responsive HTML/CSS/JavaScript UI

## แนะนำการใช้กับ Portfolio

ใช้หน้า GitHub Pages เป็น **Live Demo** และใน repository README ให้เพิ่มหัวข้อ:

- Problem / Business Context
- Your Role
- Key Decisions
- Architecture
- Data & Privacy
- Result / Impact
- What I would improve next

หากระบบจริงเป็นงานของบริษัทหรือลูกค้า ควรเปิดเฉพาะโค้ดสาธิต/ภาพสาธิตและเก็บ source จริงไว้ private
