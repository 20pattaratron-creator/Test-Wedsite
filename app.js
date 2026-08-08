const PROFILE_LINKS = {
  github: "https://github.com/YOUR-USERNAME",
  linkedin: "https://www.linkedin.com/in/YOUR-PROFILE",
  email: "mailto:your.email@example.com",
  resume: "#resume"
};

const demoData = {
  2026: {
    all: {
      monthly:[1.18,1.26,1.39,1.47,1.63,1.72,1.84,1.91,2.04,2.12,2.24,2.38],
      forecast:[2.46,2.54,2.63], sales:21.18, delivery:17.05, profit:5.44, expense:2.63,
      target:24, yoy:18.4, conversion:80.5, quality:97.8,
      funnel:[21.18,17.05,14.62], segments:[35,27,21,17]
    },
    khonkaen:{monthly:[.72,.78,.84,.91,.98,1.03,1.09,1.16,1.23,1.26,1.34,1.42],forecast:[1.47,1.51,1.57],sales:12.76,delivery:10.31,profit:3.37,expense:1.54,target:14.4,yoy:20.8,conversion:80.8,quality:98.2,funnel:[12.76,10.31,8.84],segments:[38,25,20,17]},
    ubon:{monthly:[.46,.48,.55,.56,.65,.69,.75,.75,.81,.86,.90,.96],forecast:[.99,1.03,1.06],sales:8.42,delivery:6.74,profit:2.07,expense:1.09,target:9.6,yoy:14.9,conversion:80.0,quality:97.2,funnel:[8.42,6.74,5.78],segments:[31,30,22,17]}
  },
  2025: {
    all:{monthly:[1.02,1.08,1.14,1.21,1.28,1.36,1.45,1.51,1.62,1.74,1.81,1.90],forecast:[1.96,2.02,2.09],sales:17.12,delivery:13.76,profit:4.21,expense:2.29,target:22,yoy:11.7,conversion:80.4,quality:96.9,funnel:[17.12,13.76,11.66],segments:[34,26,22,18]},
    khonkaen:{monthly:[.62,.66,.69,.74,.78,.83,.88,.93,.97,1.05,1.08,1.14],forecast:[1.18,1.21,1.25],sales:10.37,delivery:8.38,profit:2.61,expense:1.37,target:13.2,yoy:12.3,conversion:80.8,quality:97.4,funnel:[10.37,8.38,7.10],segments:[37,24,21,18]},
    ubon:{monthly:[.40,.42,.45,.47,.50,.53,.57,.58,.65,.69,.73,.76],forecast:[.78,.81,.84],sales:6.75,delivery:5.38,profit:1.60,expense:.92,target:8.8,yoy:10.8,conversion:79.7,quality:96.2,funnel:[6.75,5.38,4.56],segments:[30,31,23,16]}
  }
};

const customerRows = [
  ["A","โรงพยาบาลตัวอย่าง A",3.42,"16.1%"],["A","สหกรณ์ตัวอย่าง B",2.81,"13.3%"],["A","บริษัทตัวอย่าง C",2.34,"11.0%"],
  ["B","โรงเรียนตัวอย่าง D",1.67,"7.9%"],["B","หน่วยงานตัวอย่าง E",1.43,"6.8%"],["C","ลูกค้าตัวอย่าง F",.88,"4.2%"]
];

const segmentLabels=["ราชการ/สหกรณ์","โรงพยาบาล","โรงเรียน","บริษัทเอกชน"];
const months=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const moneyM=n=>`${n.toFixed(2)}M`;

function current(){
  const y=document.getElementById('year-filter')?.value||'2026';
  const b=document.getElementById('branch-filter')?.value||'all';
  return demoData[y][b];
}

function initHeroChart(){
  const el=document.getElementById('hero-mini-chart'); if(!el) return;
  [34,48,43,61,54,72,64,78,70,86,79,92].forEach(h=>{const i=document.createElement('i');i.style.height=h+'%';el.appendChild(i)});
}

function renderKPIs(d){
  const cards=[
    ['ยอดขายก่อน VAT',moneyM(d.sales),'↗ '+d.yoy.toFixed(1)+'%','💰'],
    ['ยอดส่งสินค้า',moneyM(d.delivery),d.conversion.toFixed(1)+'% ของยอดขาย','🚚'],
    ['กำไรสุทธิ',moneyM(d.profit),((d.profit/d.sales)*100).toFixed(1)+'% margin','📈'],
    ['Data Quality',d.quality.toFixed(1)+'%','ผ่าน validation','✓']
  ];
  document.getElementById('kpi-grid').innerHTML=cards.map(x=>`<div class="kpi"><div class="kpi-top"><span class="kpi-label">${x[0]}</span><span class="kpi-icon">${x[3]}</span></div><div class="kpi-value">${x[1]}</div><div class="kpi-change">${x[2]}</div></div>`).join('');
}

function lineChart(elId, actual, forecast=[], labels=months){
  const el=document.getElementById(elId); if(!el)return;
  const all=[...actual,...forecast]; const max=Math.max(...all)*1.15; const min=Math.min(...all)*.82;
  const W=760,H=220,pad={l:38,r:18,t:12,b:30}; const iw=W-pad.l-pad.r, ih=H-pad.t-pad.b;
  const x=i=>pad.l+(i/(all.length-1))*iw; const y=v=>pad.t+(1-(v-min)/(max-min))*ih;
  const actPts=actual.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
  const fPts=forecast.length?[`${x(actual.length-1)},${y(actual.at(-1))}`,...forecast.map((v,i)=>`${x(actual.length+i)},${y(v)}`)].join(' '):'';
  let grid=''; for(let i=0;i<5;i++){const yy=pad.t+i*ih/4;grid+=`<line class="chart-grid-line" x1="${pad.l}" y1="${yy}" x2="${W-pad.r}" y2="${yy}"/>`}
  let axes=''; labels.concat(forecast.map((_,i)=>`F${i+1}`)).forEach((m,i)=>{if(i%2===0||i>=12)axes+=`<text class="chart-axis" x="${x(i)}" y="${H-9}" text-anchor="middle">${m}</text>`});
  const points=actual.map((v,i)=>`<circle class="chart-point" cx="${x(i)}" cy="${y(v)}" r="3"/>`).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="กราฟแนวโน้มรายเดือน"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0b63b6" stop-opacity=".18"/><stop offset="1" stop-color="#0b63b6" stop-opacity="0"/></linearGradient></defs>${grid}${axes}<polygon class="chart-area" points="${pad.l},${H-pad.b} ${actPts} ${x(actual.length-1)},${H-pad.b}"/><polyline class="chart-line" points="${actPts}"/>${points}${forecast.length?`<polyline class="chart-forecast" points="${fPts}"/>`:''}</svg>`;
}

function renderFunnel(d){
  const max=d.funnel[0]; const labels=['ยอดสั่งผลิต','ยอดส่งสินค้า','ยอดรับชำระ'];
  document.getElementById('funnel').innerHTML=d.funnel.map((v,i)=>`<div class="funnel-row"><label>${labels[i]}</label><div class="funnel-track"><i style="width:${v/max*100}%"></i></div><b>${moneyM(v)}</b></div>`).join('');
}

function renderSegments(d){
  document.getElementById('segments').innerHTML=d.segments.map((v,i)=>`<div class="segment-row"><span>${segmentLabels[i]}</span><div class="segment-bar"><i style="width:${v}%"></i></div><b>${v}%</b></div>`).join('');
}

function renderTarget(d){
  const pct=Math.min(100,d.sales/d.target*100);
  document.getElementById('target-bar').style.width=pct+'%';
  document.getElementById('target-label').textContent=`${pct.toFixed(1)}% ของเป้าหมาย ${moneyM(d.target)}`;
  document.getElementById('target-mid').textContent=moneyM(d.target/2);document.getElementById('target-max').textContent=moneyM(d.target);
}

function renderAnalytics(d){
  document.getElementById('customer-table').innerHTML=customerRows.map(r=>`<div class="customer-row"><span class="abc ${r[0]}">${r[0]}</span><span>${r[1]}</span><b>${moneyM(r[2])}</b><span>${r[3]}</span></div>`).join('');
  document.getElementById('quality').innerHTML=`<div class="quality-score"><strong>${d.quality.toFixed(1)}%</strong><span>Overall data quality<br>จาก validation rules</span></div>${[['วันที่ครบถ้วน','99.6%',''],['เลขเอกสารไม่ซ้ำ','98.9%',''],['Customer master','96.8%',''],['ลิงก์หลักฐาน','93.4%','warn']].map(x=>`<div class="quality-item"><span>${x[0]}</span><em class="${x[2]}">${x[1]}</em></div>`).join('')}`;
  const fsum=d.forecast.reduce((a,b)=>a+b,0); document.getElementById('forecast-total').textContent=`3 เดือน ≈ ${moneyM(fsum)}`;
  lineChart('forecast-chart',d.monthly.slice(-6),d.forecast,['ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']);
  const gap=Math.max(0,d.target-d.sales); const deliveryGap=d.sales-d.delivery;
  document.getElementById('insights').innerHTML=[
    ['🎯 Target Gap',`ยังเหลือ ${moneyM(gap)} เพื่อถึงเป้าหมายปีที่เลือก ควรโฟกัสลูกค้า A-class และ quote ที่มีโอกาสปิดสูง`],
    ['🚚 Delivery Gap',`ยอดขายสูงกว่ายอดส่งสินค้า ${moneyM(deliveryGap)} ควรตรวจงานค้างส่งและ due date ก่อนสิ้นเดือน`],
    ['🧹 Data Action',`Data quality ${d.quality.toFixed(1)}% อยู่ในระดับดี แต่ควรติดตามรายการที่ไม่มีลิงก์หลักฐานและ customer master ที่ยังไม่ครบ`]
  ].map(x=>`<div class="insight"><b>${x[0]}</b><p>${x[1]}</p></div>`).join('');
}

function renderDashboard(){
  const d=current(); renderKPIs(d); lineChart('sales-chart',d.monthly,d.forecast);renderFunnel(d);renderSegments(d);renderTarget(d);renderAnalytics(d);
}

function renderDocument(type='quote'){
  const isReceipt=type==='receipt'; const titles={quote:['ใบเสนอราคา','QUOTATION'],invoice:['ใบแจ้งหนี้ / ใบส่งสินค้า / ใบกำกับภาษี','INVOICE / DELIVERY ORDER / TAX INVOICE'],receipt:['ใบเสร็จรับเงิน','RECEIPT']};
  const [th,en]=titles[type]; const logo=isReceipt?'assets/logo-green.png':'assets/logo-blue.png';
  const rows=type==='quote'?[['1','ชุดตัวอย่างสินค้า A','12','ชุด','9,500.00','114,000.00'],['2','งานพิมพ์ตัวอย่าง B','5','ชุด','18,000.00','90,000.00']]:[['1','ชุดตัวอย่างสินค้า A','12','ชุด','9,500.00','114,000.00'],['2','งานพิมพ์ตัวอย่าง B','5','ชุด','18,000.00','90,000.00']];
  const sub=204000,vat=14280,total=218280;
  document.getElementById('document-preview').innerHTML=`<div class="paper ${isReceipt?'green':''}"><div class="paper-head"><img src="${logo}" alt=""><div class="paper-company"><b>บริษัทตัวอย่าง จำกัด</b><span>DEMO COMPANY CO., LTD.</span><span>ข้อมูลทั้งหมดเป็นข้อมูลจำลองสำหรับ Portfolio</span></div><div class="paper-title"><h3>${th}</h3><span>${en}</span></div></div><div class="paper-rule"></div><div class="paper-meta"><div class="meta-box"><b>ลูกค้า:</b> บริษัทลูกค้าตัวอย่าง จำกัด<br><b>ที่อยู่:</b> 99/9 ถนนตัวอย่าง อำเภอเมือง จังหวัดตัวอย่าง 40000<br><b>เลขประจำตัวผู้เสียภาษี:</b> 0-0000-00000-00-0</div><div class="meta-box"><b>เลขที่:</b> DEMO-2026-001<br><b>วันที่:</b> 08/08/2569<br><b>เงื่อนไข:</b> เครดิต 30 วัน</div></div><table class="paper-table"><thead><tr><th>#</th><th>รายละเอียด</th><th>จำนวน</th><th>หน่วย</th><th class="num">ราคา/หน่วย</th><th class="num">จำนวนเงิน</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i>3?'num':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="paper-total"><div><span>รวมก่อน VAT</span><b>${sub.toLocaleString('th-TH',{minimumFractionDigits:2})}</b></div><div><span>VAT 7%</span><b>${vat.toLocaleString('th-TH',{minimumFractionDigits:2})}</b></div><div class="grand"><span>ยอดสุทธิ</span><b>${total.toLocaleString('th-TH',{minimumFractionDigits:2})} บาท</b></div></div></div>`;
}

function switchView(view,btn){
  document.querySelectorAll('.demo-view').forEach(v=>v.classList.remove('active'));document.getElementById('view-'+view)?.classList.add('active');
  document.querySelectorAll('.demo-menu').forEach(b=>b.classList.remove('active'));btn?.classList.add('active');
  document.getElementById('demo-title').textContent={overview:'Executive Dashboard',analytics:'Business Analytics',documents:'Business Documents'}[view];
}

function initInteractions(){
  document.querySelectorAll('.demo-menu').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view,btn)));
  ['branch-filter','year-filter'].forEach(id=>document.getElementById(id)?.addEventListener('change',renderDashboard));
  document.querySelectorAll('.doc-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.doc-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderDocument(btn.dataset.doc)}));
  document.querySelectorAll('.pill').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.pill').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
  const toggle=document.getElementById('nav-toggle'),nav=document.getElementById('nav');toggle?.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  document.getElementById('copy-resume')?.addEventListener('click',async()=>{const text=[...document.querySelectorAll('#resume-bullets li')].map(li=>'• '+li.textContent.trim()).join('\n');try{await navigator.clipboard.writeText(text);document.getElementById('copy-status').textContent='คัดลอกแล้ว ✓'}catch{document.getElementById('copy-status').textContent='เลือกข้อความจากกล่องด้านขวาเพื่อคัดลอก'}});
}

function renderProfileLinks(){
  const labels={github:['GitHub','Source / Projects'],linkedin:['LinkedIn','Professional profile'],email:['Email','Contact'],resume:['Resume','Case-study bullets']};
  document.getElementById('contact-links').innerHTML=Object.entries(PROFILE_LINKS).map(([k,v])=>`<a class="profile-link" href="${v}" ${v.startsWith('http')?'target="_blank" rel="noreferrer"':''}><b>${labels[k][0]}</b><span>${labels[k][1]} →</span></a>`).join('');
}

function initReveal(){
  const els=document.querySelectorAll('.reveal'); if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('visible'));return}
  const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target)}}),{threshold:.12});els.forEach(e=>io.observe(e));
}

initHeroChart();initInteractions();renderDashboard();renderDocument();renderProfileLinks();initReveal();
