// Portfolio Demo bootstrap
// Everything in this file stays in the visitor's browser. No remote APIs are used.
(() => {
  const DEMO_MARKER = 'comform_portfolio_demo_seed_v3';
  const APP_PREFIX = 'biz2_';
  const DEMO_KEYS = [
    'comform_delivery_targets_v2',
    'comform_sales_targets_v1',
    'comform_delivery_tax_document_draft_v1',
    'comform_receipt_document_draft_v1',
    'comform_auto_backup_index_v1'
  ];

  const pad = n => String(n).padStart(2, '0');
  const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const round = n => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
  const emptyPack = () => ({
    quotes: [], invoices: [], receipts: [], issuedInvoices: [], issuedReceipts: [], expenses: [], productions: []
  });
  const keyFor = (branch, year, month) => `${APP_PREFIX}${branch}_${year}_${pad(month + 1)}`;

  function agencyMeta(customer) {
    const name = String(customer || '');
    if (name.startsWith('รพ.') || name.includes('โรงพยาบาล')) return {
      customerAgencyGroup: 'hospital', customerAgencyGroupLabel: 'โรงพยาบาล',
      customerAgencyType: 'hospital', customerAgencyTypeLabel: 'โรงพยาบาล', customerPrefix: 'รพ.'
    };
    if (name.startsWith('สอ.') || name.includes('สหกรณ์ออมทรัพย์')) return {
      customerAgencyGroup: 'government_coop_association', customerAgencyGroupLabel: 'ราชการ / สหกรณ์ / สมาคม',
      customerAgencyType: 'savings_cooperative', customerAgencyTypeLabel: 'สหกรณ์ออมทรัพย์', customerPrefix: 'สอ.'
    };
    if (name.startsWith('รร.') || name.includes('โรงเรียน')) return {
      customerAgencyGroup: 'school', customerAgencyGroupLabel: 'โรงเรียน',
      customerAgencyType: 'school', customerAgencyTypeLabel: 'โรงเรียน', customerPrefix: 'รร.'
    };
    return {
      customerAgencyGroup: 'private_company', customerAgencyGroupLabel: 'บริษัทเอกชน',
      customerAgencyType: 'limited_company', customerAgencyTypeLabel: 'บริษัทจำกัด', customerPrefix: 'บจก.'
    };
  }

  function item(product, qty, unit, costUnit, priceUnit) {
    const costTotal = round(qty * costUnit);
    const saleTotal = round(qty * priceUnit);
    return {
      product,
      qty,
      unit,
      costMode: 'unit',
      costValue: costUnit,
      costUnit,
      costLump: 0,
      costTotal,
      saleMode: 'unit',
      saleValue: priceUnit,
      priceUnit,
      saleTotal
    };
  }

  function makeProduction({ id, no, date, customer, maker, job, items, leadDays = 30, commRate = 2 }) {
    const itemSaleTotal = round(items.reduce((s, x) => s + Number(x.saleTotal || 0), 0));
    const costTotal = round(items.reduce((s, x) => s + Number(x.costTotal || 0), 0));
    const subtotal = itemSaleTotal;
    const vatAmt = round(subtotal * 0.07);
    const total = round(subtotal + vatAmt);
    const commAmt = round(subtotal * commRate / 100);
    const profit = round(subtotal - costTotal - commAmt);
    const dateObj = new Date(`${date}T00:00:00`);
    const delivery = new Date(dateObj); delivery.setDate(delivery.getDate() + leadDays);
    const due = new Date(delivery); due.setDate(due.getDate() + 30);
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const thai = `${pad(dateObj.getDate())}/${pad(m + 1)}/${y + 543}`;
    return {
      id, schemaVersion: 3, no, date, year: y, yearCE: y, yearBE: y + 543, buddhistYear: y + 543,
      month: m, monthIndex: m, monthNumber: m + 1, dateThai: thai, displayDate: thai,
      maker, customer, ...agencyMeta(customer), job, items,
      qty: items.reduce((s, x) => s + x.qty, 0), unit: items.length === 1 ? items[0].unit : '',
      costMode: items.length === 1 ? 'unit' : 'mixed', costValue: items.length === 1 ? items[0].costUnit : 0,
      costUnit: items.length === 1 ? items[0].costUnit : 0, costLump: 0, costTotal,
      costSubtotal: costTotal, costUseVat: 0, costVatMode: 'extract', costVatAmt: 0, costGrandTotal: costTotal,
      saleMode: 'unit', saleValue: items.length === 1 ? items[0].priceUnit : 0,
      priceUnit: items.length === 1 ? items[0].priceUnit : 0, saleLump: 0,
      itemSaleTotal, saleTotal: itemSaleTotal, subtotal, useVat: 1, vatMode: 'add', vatAmt, total,
      commMode: 'percent', commRate, commAmt, profit,
      deliveryLeadDays: leadDays, shippingLeadDays: leadDays,
      deliveryDueDate: delivery.toISOString().slice(0, 10), estimatedDeliveryDate: delivery.toISOString().slice(0, 10),
      supplierCreditTerm: '30', supplierCreditDays: 30,
      supplierDueDate: due.toISOString().slice(0, 10), supplierPaymentStatus: 'pending', supplierPaymentNote: '',
      invoiceStatus: 'pending', invoiceNo: '', invoiceId: '', note: 'ข้อมูลจำลองสำหรับ Portfolio Demo', attachments: []
    };
  }

  function makeQuote(prod, id, no) {
    const subtotal = prod.subtotal;
    const vatAmt = round(subtotal * 0.07);
    return {
      id, no, date: prod.date, customer: prod.customer, ...agencyMeta(prod.customer), salesPerson: 'Demo Sales',
      items: prod.items.map(x => ({ product: x.product, qty: x.qty, unit: x.unit, priceUnit: x.priceUnit, total: x.saleTotal })),
      subtotal, useVat: 1, vatAmt, total: round(subtotal + vatAmt), note: 'ใบเสนอราคาตัวอย่าง', attachments: [], approved: id % 3 !== 0
    };
  }

  function makeInvoice(prod, id, no, paid = false) {
    const subtotal = prod.subtotal;
    const vatAmt = round(subtotal * 0.07);
    const due = new Date(`${prod.date}T00:00:00`); due.setDate(due.getDate() + 30);
    return {
      id, no, date: prod.date, dueDate: due.toISOString().slice(0, 10), customer: prod.customer, ...agencyMeta(prod.customer),
      salesPerson: 'Demo Sales', items: prod.items.map(x => ({
        product: x.product, qty: x.qty, unit: x.unit, priceUnit: x.priceUnit,
        costUnit: x.costUnit, costTotal: x.costTotal, saleTotal: x.saleTotal, total: x.saleTotal
      })),
      itemSaleTotal: subtotal, saleTotal: subtotal, subtotal, useVat: 1, vatMode: 'add', vatAmt,
      total: round(subtotal + vatAmt), costTotal: prod.costTotal, commMode: 'percent', commRate: prod.commRate,
      commAmt: prod.commAmt, profit: prod.profit,
      sourceProductionNo: prod.no, sourceProductionId: prod.id, sourceProductionBranch: '',
      creditTerm: '30', paymentStatus: paid ? 'paid' : 'pending', paid, isPaid: paid,
      note: 'หลักฐานใบส่งสินค้าจำลอง', attachments: []
    };
  }

  function makeReceipt(inv, id, no) {
    return {
      id, no, date: inv.date, customer: inv.customer, ...agencyMeta(inv.customer), salesPerson: inv.salesPerson,
      invNo: inv.no, sourceInvoiceNo: inv.no, sourceInvoiceId: inv.id,
      items: inv.items.map(x => ({ ...x })), itemSaleTotal: inv.subtotal, saleTotal: inv.subtotal,
      subtotal: inv.subtotal, useVat: inv.useVat, vatMode: inv.vatMode, vatAmt: inv.vatAmt, total: inv.total,
      costTotal: inv.costTotal, commMode: inv.commMode, commRate: inv.commRate, commAmt: inv.commAmt,
      profit: inv.profit, paymentStatus: 'paid', paid: true, isPaid: true,
      note: 'หลักฐานใบเสร็จรับเงินจำลอง', attachments: []
    };
  }

  function seedBranchMonth(branch, year, month, branchIndex) {
    const pack = emptyPack();
    const customers = branch === 'khonkaen'
      ? ['บจก. ตัวอย่างโซลูชัน', 'สอ. ตัวอย่างออมทรัพย์', 'รพ. ตัวอย่างเมดิคอล', 'รร. ตัวอย่างวิทยา']
      : ['บจก. เดโมอีสาน', 'สอ. เดโมยูเนี่ยน', 'รพ. เดโมเฮลท์', 'รร. เดโมศึกษา'];
    const products = [
      ['ชุดเอกสารประชาสัมพันธ์', 'ชุด', 5200, 7900],
      ['งานพิมพ์แบบฟอร์มองค์กร', 'กล่อง', 3200, 5100],
      ['ชุดของที่ระลึกองค์กร', 'ชุด', 6800, 9800],
      ['สื่อประชาสัมพันธ์กิจกรรม', 'ชุด', 4500, 7200]
    ];
    const dayBase = 4 + ((month * 3 + branchIndex) % 7);
    for (let i = 0; i < 2; i++) {
      const p = products[(month + i + branchIndex) % products.length];
      const customer = customers[(month * 2 + i) % customers.length];
      const qty = 14 + ((month + i * 3 + branchIndex) % 9) * 2;
      const priceBoost = 1 + month * 0.025 + branchIndex * 0.035;
      const item1 = item(p[0], qty, p[1], p[2], round(p[3] * priceBoost));
      const id = Number(`${year}${pad(month + 1)}${branchIndex + 1}${i + 1}01`);
      const prod = makeProduction({
        id,
        no: `PD-${branch === 'khonkaen' ? 'KK' : 'UB'}-${String(year).slice(-2)}${pad(month + 1)}-${i + 1}`,
        date: iso(year, month, Math.min(24, dayBase + i * 9)), customer,
        maker: i % 2 ? 'Demo Production Partner B' : 'Demo Production Partner A',
        job: p[0], items: [item1], leadDays: [21, 30, 45][(month + i) % 3], commRate: i ? 2.5 : 2
      });
      pack.productions.push(prod);
      pack.quotes.push(makeQuote(prod, id + 10, `QT-${branch === 'khonkaen' ? 'KK' : 'UB'}-${String(year).slice(-2)}${pad(month + 1)}-${i + 1}`));

      // Most productions have delivery evidence; a few remain pending so visitors can see workflow status.
      const shouldInvoice = !((month + i + branchIndex) % 5 === 0);
      if (shouldInvoice) {
        const isPaid = ((month + i + branchIndex) % 3 !== 0);
        const inv = makeInvoice(prod, id + 20, `IV-${branch === 'khonkaen' ? 'KK' : 'UB'}-${String(year).slice(-2)}${pad(month + 1)}-${i + 1}`, isPaid);
        inv.sourceProductionBranch = branch;
        prod.invoiceStatus = 'created'; prod.invoiceNo = inv.no; prod.invoiceId = inv.id;
        pack.invoices.push(inv);
        if (isPaid) pack.receipts.push(makeReceipt(inv, id + 30, `RC-${branch === 'khonkaen' ? 'KK' : 'UB'}-${String(year).slice(-2)}${pad(month + 1)}-${i + 1}`));
      }
    }

    pack.expenses.push({
      id: Number(`${year}${pad(month + 1)}${branchIndex + 1}91`),
      no: `EX-${branch === 'khonkaen' ? 'KK' : 'UB'}-${String(year).slice(-2)}${pad(month + 1)}-1`,
      date: iso(year, month, 12), cat: 'ค่าขนส่ง', desc: 'ค่าขนส่งสินค้า (ข้อมูลจำลอง)', by: 'Demo User', amount: round(11800 + month * 650 + branchIndex * 1200), note: '', attachments: []
    });
    pack.expenses.push({
      id: Number(`${year}${pad(month + 1)}${branchIndex + 1}92`),
      no: `EX-${branch === 'khonkaen' ? 'KK' : 'UB'}-${String(year).slice(-2)}${pad(month + 1)}-2`,
      date: iso(year, month, 22), cat: 'ค่าใช้จ่ายสำนักงาน', desc: 'ค่าใช้จ่ายสำนักงาน (ข้อมูลจำลอง)', by: 'Demo User', amount: round(7200 + month * 420 + branchIndex * 800), note: '', attachments: []
    });

    return pack;
  }

  function clearBusinessData() {
    const remove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith(APP_PREFIX) || key.startsWith('comform_auto_backup_v1_') || DEMO_KEYS.includes(key)) remove.push(key);
    }
    remove.forEach(key => localStorage.removeItem(key));
  }

  function seedDemoData({ force = false } = {}) {
    if (force) clearBusinessData();
    const existingBiz = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).some(k => k && k.startsWith(APP_PREFIX));
    const marker = localStorage.getItem(DEMO_MARKER);
    if (!force && (existingBiz || marker === 'cleared' || marker === 'seeded')) return false;

    [2025, 2026].forEach(year => {
      const lastMonth = year === 2026 ? 7 : 11;
      ['khonkaen', 'ubon'].forEach((branch, bi) => {
        for (let month = 0; month <= lastMonth; month++) {
          localStorage.setItem(keyFor(branch, year, month), JSON.stringify(seedBranchMonth(branch, year, month, bi)));
        }
      });
    });
    localStorage.setItem('comform_sales_targets_v1', JSON.stringify({ all: 2000000, khonkaen: 1200000, ubon: 800000 }));
    localStorage.setItem('comform_delivery_targets_v2', JSON.stringify({ all: 1600000, khonkaen: 950000, ubon: 650000 }));
    localStorage.setItem(DEMO_MARKER, 'seeded');
    return true;
  }

  function clearDemoData() {
    clearBusinessData();
    localStorage.setItem(DEMO_MARKER, 'cleared');
  }

  window.ComformPortfolioDemo = Object.freeze({
    seedDemoData,
    clearDemoData,
    resetToSample: () => seedDemoData({ force: true }),
    marker: DEMO_MARKER,
    localOnly: true
  });

  // Seed only on the very first visit. After a visitor clears data, keep it empty until they explicitly reset.
  seedDemoData();
})();
