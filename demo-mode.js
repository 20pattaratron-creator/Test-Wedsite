(() => {
  'use strict';
  const VERSION='nexora-public-demo-v2';
  const SEED_FLAG='nexora_demo_seed_version';
  const branches=['khonkaen','ubon'];
  const now=new Date();
  const year=now.getFullYear();
  const month=Math.max(0,Math.min(11,now.getMonth()));
  const key=(b,y,m)=>`biz2_${b}_${y}_${String(m+1).padStart(2,'0')}`;
  const empty=()=>({quotes:[],invoices:[],receipts:[],issuedInvoices:[],issuedReceipts:[],expenses:[],productions:[]});
  const iso=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const item=(product,qty,unit,cost,sale)=>({product,qty,unit,costUnit:cost,costTotal:qty*cost,saleUnit:sale,saleTotal:qty*sale,priceUnit:sale});
  const customers=['บริษัท ออโรร่าเดโม รีเทล จำกัด','โรงพยาบาลเมฆาสาธิต','โรงเรียนอนาคตเดโม','สหกรณ์ตัวอย่างก้าวหน้า จำกัด','บริษัท พิกเซลพอยต์เดโม จำกัด'];
  const makers=['โรงพิมพ์อัลฟาเดโม','เบต้าซัพพลายเดโม','เดโมเทคซิสเต็ม'];
  function production(id,b,m,d,cust,job,total,cost){
    const it=item(job,100,'ชิ้น',cost/100,total/100); const subtotal=total; const vatAmt=subtotal*.07;
    return {id,no:`PO-DEMO-${String(id).padStart(4,'0')}`,date:iso(year,m,d),branch:b,maker:makers[id%makers.length],customer:cust,job,qty:100,items:[it],costTotal:cost,costRawTotal:cost,costVatAmt:cost*.07,costGrandTotal:cost*1.07,subtotal,itemSaleTotal:total,saleTotal:total,total:total+vatAmt,useVat:1,vatMode:'exclusive',vatAmt,commAmt:0,profit:subtotal-cost,deliveryLeadDays:7,supplierCreditTerm:'credit30',supplierPaymentStatus:id%3===0?'paid':'pending',note:'ข้อมูลสมมติสำหรับ Portfolio Demo'};
  }
  function invoice(id,b,m,d,cust,total,prod){
    const vatAmt=total*.07; return {id,no:`INV-DEMO-${String(id).padStart(4,'0')}`,date:iso(year,m,d),branch:b,customer:cust,salesPerson:'Demo User',items:[item(prod.job,100,'ชิ้น',prod.costTotal/100,total/100)],subtotal:total,itemSaleTotal:total,saleTotal:total,total:total+vatAmt,useVat:1,vatAmt,costTotal:prod.costTotal,commAmt:0,profit:total-prod.costTotal,paymentStatus:id%2?'pending':'paid',sourceProductionId:prod.id,sourceProductionNo:prod.no,note:'ข้อมูลสมมติ'};
  }
  function receipt(id,b,m,d,cust,total,inv){
    const vatAmt=total*.07; return {id,no:`RCP-DEMO-${String(id).padStart(4,'0')}`,date:iso(year,m,d),branch:b,customer:cust,salesPerson:'Demo User',invNo:inv.no,invoiceId:inv.id,items:inv.items,subtotal:total,itemSaleTotal:total,saleTotal:total,total:total+vatAmt,useVat:1,vatAmt,costTotal:inv.costTotal,commAmt:0,profit:total-inv.costTotal,note:'ข้อมูลสมมติ'};
  }
  function quote(id,b,m,d,cust,total){return {id,no:`QT-DEMO-${String(id).padStart(4,'0')}`,date:iso(year,m,d),branch:b,customer:cust,salesPerson:'Demo User',items:[item('ชุดเอกสารตัวอย่าง',50,'ชุด',55,total/50)],subtotal:total,total:total*1.07,useVat:1,vatAmt:total*.07,status:id%2?'เสนอราคา':'อนุมัติ',note:'ข้อมูลสมมติ'};}
  function expense(id,b,m,d,desc,amount){return {id,date:iso(year,m,d),branch:b,cat:'ค่าใช้จ่ายสำนักงาน',desc,amount,by:'Demo User',note:'ข้อมูลสมมติ'};}
  function clearBiz(){
    const remove=[];
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k && (k.startsWith('biz2_')||k.startsWith('nexora_demo_')||k.startsWith('comform_')))remove.push(k);}
    remove.forEach(k=>localStorage.removeItem(k));
  }
  function seed(force=false){
    if(!force && localStorage.getItem(SEED_FLAG)===VERSION)return;
    if(force)clearBiz();
    let id=1;
    for(let back=5;back>=0;back--){
      const dt=new Date(year,month-back,1); const y=dt.getFullYear(), m=dt.getMonth();
      branches.forEach((b,bi)=>{
        const data=empty();
        for(let j=0;j<3;j++){
          const cust=customers[(j+bi+back)%customers.length];
          const sales=18000 + (back*2300)+(j*5200)+(bi*3600);
          const cost=Math.round(sales*(.56 + j*.03));
          const p=production(id++,b,m,4+j*6,cust,['งานพิมพ์แบบฟอร์ม Demo','ชุดบรรจุภัณฑ์ Demo','สื่อประชาสัมพันธ์ Demo'][j],sales,cost);
          p.date=iso(y,m,4+j*6); data.productions.push(p);
          const inv=invoice(id++,b,m,9+j*6,cust,sales,p); inv.date=iso(y,m,9+j*6); data.invoices.push(inv);
          if(j<2){const r=receipt(id++,b,m,14+j*6,cust,sales,inv);r.date=iso(y,m,14+j*6);data.receipts.push(r);}
          data.quotes.push({...quote(id++,b,m,2+j*6,cust,sales*1.05),date:iso(y,m,2+j*6)});
        }
        data.expenses.push({...expense(id++,b,m,7,'ค่าเดินทางและจัดส่ง (Demo)',2200+bi*500),date:iso(y,m,7)});
        data.expenses.push({...expense(id++,b,m,18,'วัสดุสำนักงาน (Demo)',1400+back*100),date:iso(y,m,18)});
        localStorage.setItem(key(b,y,m),JSON.stringify(data));
      });
    }
    localStorage.setItem(SEED_FLAG,VERSION);
  }
  function resetData(){
    if(!confirm('รีเซ็ตข้อมูลทดลองทั้งหมดและเติมข้อมูลสมมติเริ่มต้นใหม่หรือไม่?'))return;
    seed(true); location.reload();
  }
  function showGuide(){
    alert('วิธีทดลองระบบ Portfolio Demo\n\n1) เลือกเมนูใบเสนอราคา หรือสั่งผลิตสินค้า\n2) เลือกสาขา DEMO และกรอกข้อมูลได้ตามต้องการ\n3) กดบันทึก แล้วกลับ Dashboard / Business Analytics เพื่อดูผล\n4) ทดลองสร้างหลักฐานใบส่งสินค้าและใบเสร็จเพื่อดู Linked Workflow\n5) ข้อมูลทั้งหมดเก็บเฉพาะ Browser เครื่องนี้ ไม่มี Firebase และไม่ส่งเข้าระบบบริษัทจริง\n6) กด “รีเซ็ตข้อมูล Demo” เพื่อคืนค่าเริ่มต้นได้ทุกเมื่อ');
  }
  window.CurrentUser={uid:'public-demo',email:'demo@nexora.invalid',displayName:'Portfolio Visitor',branch:'all',role:'demo'};
  window.ComformAuth={getCurrentProfile:()=>window.CurrentUser};
  window.DemoMode={seed,resetData,showGuide,version:VERSION};
  seed(false);
  document.addEventListener('DOMContentLoaded',()=>{
    document.body.classList.add('auth-ready');
    const wm=document.createElement('div'); wm.className='demo-watermark'; wm.textContent='PUBLIC DEMO • LOCAL BROWSER DATA ONLY'; document.body.appendChild(wm);
  });
})();
