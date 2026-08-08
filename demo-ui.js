function portfolioDemoToast(message){
  let el=document.getElementById('demo-toast');
  if(!el){el=document.createElement('div');el.id='demo-toast';el.className='demo-toast';document.body.appendChild(el);}
  el.textContent=message;el.classList.add('show');clearTimeout(window.__demoToastTimer);
  window.__demoToastTimer=setTimeout(()=>el.classList.remove('show'),2200);
}

function countDemoRows(){
  let count=0;
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);if(!key?.startsWith('biz2_'))continue;
    try{
      const pack=JSON.parse(localStorage.getItem(key)||'{}');
      ['quotes','invoices','receipts','issuedInvoices','issuedReceipts','expenses','productions'].forEach(type=>count+=Array.isArray(pack[type])?pack[type].length:0);
    }catch(_){/* ignore */}
  }
  return count;
}

async function clearAttachmentDb(){
  if(!('indexedDB' in window))return;
  try{indexedDB.deleteDatabase('comform-local-files');}catch(_){/* ignore */}
}

function installPortfolioDemoUi(){
  const copy=document.querySelector('.demo-public-copy');
  if(copy&&!document.getElementById('demo-local-chip')){
    const chip=document.createElement('span');chip.id='demo-local-chip';chip.className='demo-local-chip';
    chip.textContent=`Local only · ${countDemoRows()} records`;copy.appendChild(chip);
  }

  document.getElementById('demo-reset-sample')?.addEventListener('click',async()=>{
    if(!confirm('เติมข้อมูลตัวอย่างใหม่จะล้างข้อมูลที่คุณทดลองกรอกใน browser นี้ก่อน ต้องการดำเนินการต่อหรือไม่?'))return;
    await clearAttachmentDb();
    window.ComformPortfolioDemo?.resetToSample?.();
    location.reload();
  });

  document.getElementById('demo-clear-data')?.addEventListener('click',async()=>{
    if(!confirm('ล้างข้อมูลที่ทดสอบทั้งหมดใน browser นี้? การกระทำนี้ไม่กระทบข้อมูลของผู้เข้าชมคนอื่น'))return;
    await clearAttachmentDb();
    window.ComformPortfolioDemo?.clearDemoData?.();
    location.reload();
  });

  const button=document.createElement('button');
  button.type='button';button.className='demo-help-button';button.textContent='? วิธีทดลองระบบ';
  const panel=document.createElement('aside');panel.className='demo-help-panel';panel.setAttribute('aria-label','วิธีทดลอง Portfolio Demo');
  panel.innerHTML=`
    <h3>เส้นทางทดลองที่แนะนำ</h3>
    <p>หน้า Demo ใช้หน้าตาและ business workflow ใกล้เคียงระบบจริง แต่ตัด Firebase, Login และ Google Drive ออกเพื่อความปลอดภัย</p>
    <div class="demo-help-steps">
      <div class="demo-help-step"><b>1</b><div><strong>ใบเสนอราคา</strong><span>เลือกสาขา กรอกลูกค้า เพิ่มสินค้า แล้วกดบันทึก จากนั้นดูรายการที่เมนูค้นหา</span></div></div>
      <div class="demo-help-step"><b>2</b><div><strong>สั่งผลิตสินค้า</strong><span>กรอกต้นทุน ราคาขาย ระยะเวลาส่ง และเครดิตผู้ผลิต ระบบจะคำนวณ VAT/กำไรให้</span></div></div>
      <div class="demo-help-step"><b>3</b><div><strong>หลักฐานใบส่งสินค้า</strong><span>เลือกใบสั่งผลิตที่มีอยู่ ระบบเติมข้อมูลอ้างอิงให้ แล้วบันทึกเพื่อเชื่อม workflow</span></div></div>
      <div class="demo-help-step"><b>4</b><div><strong>หลักฐานใบเสร็จรับเงิน</strong><span>เลือกบิลที่ยังไม่ชำระ บันทึกใบเสร็จ แล้วตรวจสถานะใน Dashboard / ศูนย์เชื่อมโยงเอกสาร</span></div></div>
      <div class="demo-help-step"><b>5</b><div><strong>Business Analytics</strong><span>ลองเปลี่ยนปี เดือน สาขา แล้วดู KPI, Forecast, Pareto/ABC และ Data Quality</span></div></div>
    </div>
    <div class="demo-help-note">ข้อมูลที่คุณกรอกถูกเก็บใน localStorage/IndexedDB ของ browser นี้เท่านั้น การรีเซ็ตหรือล้างข้อมูลจะไม่กระทบผู้ใช้คนอื่น</div>`;
  button.addEventListener('click',()=>panel.classList.toggle('open'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open');});
  document.body.append(panel,button);

  setTimeout(()=>portfolioDemoToast('Demo พร้อมใช้งาน — ข้อมูลทั้งหมดเป็น local-only'),650);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installPortfolioDemoUi);
else installPortfolioDemoUi();
