const STORAGE_KEY = 'mock_stock_pro_state_v1';
const INITIAL_CASH = 1000000; // เงินทุนเริ่มต้น 1,000,000 บาท

// ข้อมูลหุ้นเริ่มต้นในตลาด
const DEFAULT_STOCKS = [
  { symbol: 'PTT', name: 'บมจ. ปตท.', sector: 'พลังงาน', price: 34.50, prevPrice: 34.50, history: [33.8, 34.0, 34.2, 33.9, 34.1, 34.3, 34.5, 34.4, 34.6, 34.5] },
  { symbol: 'AOT', name: 'บมจ. ท่าอากาศยานไทย', sector: 'ขนส่ง/ท่องเที่ยว', price: 61.25, prevPrice: 61.25, history: [59.5, 60.0, 60.25, 60.5, 60.0, 60.75, 61.0, 61.5, 61.0, 61.25] },
  { symbol: 'KBANK', name: 'บมจ. ธนาคารกสิกรไทย', sector: 'ธนาคาร', price: 152.00, prevPrice: 152.00, history: [149.0, 149.5, 150.0, 151.0, 150.5, 151.5, 152.0, 151.5, 152.5, 152.0] },
  { symbol: 'ADVANC', name: 'บมจ. แอดวานซ์ อินโฟร์ เซอร์วิส', sector: 'สื่อสาร', price: 278.00, prevPrice: 278.00, history: [272.0, 273.0, 275.0, 274.0, 276.0, 277.0, 276.0, 278.0, 277.0, 278.0] },
  { symbol: 'DELTA', name: 'บมจ. เดลต้า อีเลคโทรนิคส์', sector: 'ชิ้นส่วนอิเล็กฯ', price: 114.50, prevPrice: 114.50, history: [108.0, 109.5, 111.0, 110.0, 112.5, 113.0, 112.0, 114.0, 115.0, 114.5] },
  { symbol: 'CPALL', name: 'บมจ. ซีพี ออลล์', sector: 'ค้าปลีก', price: 64.00, prevPrice: 64.00, history: [62.5, 63.0, 62.75, 63.25, 63.5, 63.75, 64.25, 64.0, 63.75, 64.0] },
  { symbol: 'BDMS', name: 'บมจ. กรุงเทพดุสิตเวชการ', sector: 'การแพทย์', price: 28.75, prevPrice: 28.75, history: [28.0, 28.25, 28.25, 28.5, 28.5, 28.75, 28.5, 28.75, 28.75, 28.75] },
  { symbol: 'GULF', name: 'บมจ. กัลฟ์ เอ็นเนอร์จี', sector: 'พลังงาน/โครงสร้างฯ', price: 56.50, prevPrice: 56.50, history: [54.5, 55.0, 55.25, 55.5, 55.25, 56.0, 56.25, 56.0, 56.75, 56.5] }
];

// คลังข่าวเศรษฐกิจและข่าวรายหุ้นสำหรับจำลองกราฟขึ้นลง
const NEWS_BANK = [
  { symbol: 'PTT', impact: 0.055, headline: 'ราคาน้ำมันดิบโลกพุ่งทะลุแนวต้าน หนุนกำไรกลุ่มพลังงาน PTT โตเด่น' },
  { symbol: 'PTT', impact: -0.045, headline: 'กลุ่มโอเปกพลัสส่งสัญญาณเพิ่มกำลังการผลิต กดดันราคาน้ำมันและหุ้น PTT อ่อนตัว' },
  { symbol: 'AOT', impact: 0.065, headline: 'ยอดนักท่องเที่ยวต่างชาติเข้าไทยพุ่งเกินคาด รับไฮซีซั่น ดันหุ้น AOT บวกแรง' },
  { symbol: 'AOT', impact: -0.05, headline: 'สายการบินปรับลดตารางบินชั่วคราวจากต้นทุนเชื้อเพลิง กระทบ AOT ย่อตัว' },
  { symbol: 'KBANK', impact: 0.045, headline: 'กนง. คงอัตราดอกเบี้ยนโยบาย หนุนส่วนต่างดอกเบี้ยกลุ่มธนาคาร KBANK แข็งแกร่ง' },
  { symbol: 'KBANK', impact: -0.05, headline: 'ความกังวลหนี้ครัวเรือนกดดันกลุ่มแบงก์ นักลงทุนขายทำกำไร KBANK' },
  { symbol: 'ADVANC', impact: 0.04, headline: 'ยอดผู้ใช้ 5G และเน็ตบ้านโตต่อเนื่อง โบรกเกอร์ปรับเพิ่มเป้าปันผล ADVANC' },
  { symbol: 'ADVANC', impact: -0.035, headline: 'การแข่งขันแพ็กเกจมือถือรุนแรงขึ้น กดดันมาร์จิ้นกลุ่มสื่อสาร ADVANC' },
  { symbol: 'DELTA', impact: 0.075, headline: 'กระแสลงทุน Data Center และ AI บูม ดันยอดคำสั่งซื้อชิ้นส่วน DELTA พุ่งกระฉูด' },
  { symbol: 'DELTA', impact: -0.065, headline: 'ตลาดหลักทรัพย์ฯ เตือนหุ้นผันผวนสูง นักลงทุนเทขายทำกำไร DELTA ระยะสั้น' },
  { symbol: 'CPALL', impact: 0.045, headline: 'มาตรการกระตุ้นการจับจ่ายภาครัฐหนุนยอดขายสาขาเดิม CPALL ฟื้นตัวชัด' },
  { symbol: 'CPALL', impact: -0.04, headline: 'ต้นทุนค่าไฟฟ้าและค่าขนส่งปรับตัวสูงขึ้น กดดันกำไรกลุ่มค้าปลีก CPALL' },
  { symbol: 'BDMS', impact: 0.04, headline: 'ผู้ป่วยต่างชาติบินเข้ามารักษาในไทยเพิ่มขึ้น ดันรายได้โรงพยาบาล BDMS ทำนิวไฮ' },
  { symbol: 'BDMS', impact: -0.035, headline: 'แรงขายปรับพอร์ตหุ้นกลุ่ม Defensive หลังนักลงทุนย้ายเงินเข้าหุ้นเทคโนโลยี' },
  { symbol: 'GULF', impact: 0.06, headline: 'GULF คว้าสัญญาโรงไฟฟ้าพลังงานสะอาดและธุรกิจ Cloud ใหม่ หนุนอนาคตเติบโต' },
  { symbol: 'GULF', impact: -0.045, headline: 'อัตราผลตอบแทนพันธบัตรพุ่งสูง กดดันหุ้นกลุ่มโรงไฟฟ้าที่มีภาระดอกเบี้ย' },
  { symbol: 'ALL', impact: 0.035, headline: 'ฟันด์โฟลว์ต่างชาติไหลเข้าซื้อสุทธิหุ้นไทย รับเศรษฐกิจฟื้นตัว ทั้งตลาดเขียวสดใส' },
  { symbol: 'ALL', impact: -0.035, headline: 'ความกังวลเศรษฐกิจโลกชะลอตัว กดดันดัชนีตลาดหุ้นปรับตัวลดลงทั้งกระดาน' }
];

// โหลดหรือสร้าง State เริ่มต้น
function loadInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('State parse error', e);
    }
  }
  return {
    cash: INITIAL_CASH,
    stocks: JSON.parse(JSON.stringify(DEFAULT_STOCKS)),
    holdings: {}, // { PTT: { qty: 100, avgCost: 34.0 } }
    transactions: [],
    realizedPL: 0,
    selectedSymbol: 'PTT',
    tickCount: 10,
    timeLabels: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30'],
    newsFeed: [
      {
        time: '15:30',
        symbol: 'ALL',
        impact: 0,
        headline: 'ตลาดเปิดทำการปกติ นักลงทุนจับตาทิศทางผลประกอบการไตรมาสล่าสุด'
      }
    ]
  };
}

let state = loadInitialState();
let isSimRunning = true;
let simInterval = null;
let stockPriceChart = null;
let allocationChart = null;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(num) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatSignedMoney(num) {
  if (Math.abs(num) < 0.005) return '0.00';
  return (num > 0 ? '+' : '') + formatMoney(num);
}

function getPLClass(num) {
  if (num > 0.005) return 'positive';
  if (num < -0.005) return 'negative';
  return 'neutral';
}

function getCurrentTimeStr() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

// คำนวณมูลค่าพอร์ตรวม
function getPortfolioMetrics() {
  let stockMarketValue = 0;
  let unrealizedPL = 0;

  Object.entries(state.holdings).forEach(([symbol, pos]) => {
    const stock = state.stocks.find((s) => s.symbol === symbol);
    const currentPrice = stock ? stock.price : pos.avgCost;
    const mktVal = pos.qty * currentPrice;
    stockMarketValue += mktVal;
    unrealizedPL += (currentPrice - pos.avgCost) * pos.qty;
  });

  const totalNetWorth = state.cash + stockMarketValue;
  const totalReturnPct = ((totalNetWorth - INITIAL_CASH) / INITIAL_CASH) * 100;

  return {
    stockMarketValue,
    unrealizedPL,
    totalNetWorth,
    totalReturnPct
  };
}

// จำลองการเดินตลาด 1 รอบ (ราคาขยับตามธรรมชาติ + มีโอกาสเกิดข่าวด่วน)
function stepMarket(forceNews = false) {
  state.tickCount += 1;
  const timeStr = getCurrentTimeStr();
  state.timeLabels.push(timeStr);
  if (state.timeLabels.length > 25) state.timeLabels.shift();

  // เลือกว่าจะมีข่าวด่วนในรอบนี้หรือไม่ (ทุกๆ 3 รอบ หรือเมื่อกดปุ่มสุ่มข่าว)
  let activeNews = null;
  if (forceNews || state.tickCount % 3 === 0) {
    const randomTemplate = NEWS_BANK[Math.floor(Math.random() * NEWS_BANK.length)];
    activeNews = {
      time: timeStr,
      symbol: randomTemplate.symbol,
      impact: randomTemplate.impact,
      headline: randomTemplate.headline
    };
    applyNewsImpact(activeNews);
  }

  // ปรับราคาหุ้นทุกตัวเล็กน้อยตามกลไกตลาด
  state.stocks.forEach((stock) => {
    stock.prevPrice = stock.price;
    // ความผันผวนปกติ +-0.8%
    const normalNoise = (Math.random() - 0.49) * 0.016;
    let newsShock = 0;
    if (activeNews && (activeNews.symbol === stock.symbol || activeNews.symbol === 'ALL')) {
      newsShock = activeNews.impact;
    }

    const newPrice = Math.max(1.0, Number((stock.price * (1 + normalNoise + newsShock)).toFixed(2)));
    stock.price = newPrice;
    stock.history.push(newPrice);
    if (stock.history.length > 25) stock.history.shift();
  });

  saveState();
  renderAll();
}

function applyNewsImpact(newsObj) {
  state.newsFeed.unshift(newsObj);
  if (state.newsFeed.length > 30) state.newsFeed.pop();

  const banner = document.getElementById('breakingNewsBanner');
  const tag = document.getElementById('bannerTag');
  const headlineEl = document.getElementById('bannerHeadline');

  banner.classList.remove('good-news', 'bad-news', 'neutral-news');
  tag.classList.remove('tag-good', 'tag-bad', 'tag-neutral');

  const targetText = newsObj.symbol === 'ALL' ? 'ทั้งตลาด' : newsObj.symbol;
  if (newsObj.impact > 0) {
    banner.classList.add('good-news');
    tag.classList.add('tag-good');
    tag.textContent = `ข่าวดี (${targetText} +${(newsObj.impact * 100).toFixed(1)}%)`;
  } else if (newsObj.impact < 0) {
    banner.classList.add('bad-news');
    tag.classList.add('tag-bad');
    tag.textContent = `ข่าวร้าย (${targetText} ${(newsObj.impact * 100).toFixed(1)}%)`;
  } else {
    banner.classList.add('neutral-news');
    tag.classList.add('tag-neutral');
    tag.textContent = 'ข่าวตลาด';
  }

  headlineEl.textContent = `[${newsObj.time}] ${newsObj.headline}`;
}

// เลือกหุ้นเพื่อดูกราฟและเตรียมเทรด
function selectStock(symbol) {
  state.selectedSymbol = symbol;
  document.getElementById('orderSymbol').value = symbol;
  updateOrderFormCalculations();
  renderStockChart();
  renderMarketTable();
}

// อัปเดตการ์ดสรุปยอด
function renderSummaryCards() {
  const { stockMarketValue, unrealizedPL, totalNetWorth, totalReturnPct } = getPortfolioMetrics();

  document.getElementById('totalNetWorth').textContent = `${formatMoney(totalNetWorth)} ฿`;
  const returnEl = document.getElementById('totalReturnPct');
  returnEl.textContent = `${totalReturnPct >= 0 ? '+' : ''}${totalReturnPct.toFixed(2)}% จากทุนเริ่มต้น 1,000,000 ฿`;
  returnEl.className = `card-sub ${getPLClass(totalReturnPct)}`;

  document.getElementById('cashBalance').textContent = `${formatMoney(state.cash)} ฿`;
  document.getElementById('stockMarketValueSub').textContent = `มูลค่าหุ้นที่ถืออยู่: ${formatMoney(stockMarketValue)} ฿`;

  const unrealEl = document.getElementById('totalUnrealizedPL');
  unrealEl.textContent = `${formatSignedMoney(unrealizedPL)} ฿`;
  unrealEl.className = `card-value ${getPLClass(unrealizedPL)}`;

  const realEl = document.getElementById('totalRealizedPL');
  realEl.textContent = `${formatSignedMoney(state.realizedPL)} ฿`;
  realEl.className = `card-value ${getPLClass(state.realizedPL)}`;
}

// อัปเดตกระดานหุ้น
function renderMarketTable() {
  const tbody = document.getElementById('marketTableBody');
  tbody.innerHTML = '';

  state.stocks.forEach((stock) => {
    const firstPrice = stock.history[0] || stock.price;
    const diff = stock.price - firstPrice;
    const diffPct = firstPrice > 0 ? (diff / firstPrice) * 100 : 0;
    const plClass = getPLClass(diff);
    const arrow = diff > 0.005 ? '▲' : diff < -0.005 ? '▼' : '•';

    const tr = document.createElement('tr');
    if (stock.symbol === state.selectedSymbol) tr.classList.add('selected-row');

    tr.innerHTML = `
      <td class="stock-symbol-cell">
        <strong>${stock.symbol}</strong>
        <small>${stock.name}</small>
      </td>
      <td><span class="sector-pill">${stock.sector}</span></td>
      <td class="text-right"><strong>${formatMoney(stock.price)}</strong></td>
      <td class="text-right ${plClass}">
        <strong>${arrow} ${diff >= 0 ? '+' : ''}${diffPct.toFixed(2)}%</strong>
      </td>
    `;

    tr.addEventListener('click', () => selectStock(stock.symbol));
    tbody.appendChild(tr);
  });
}

// วาดกราฟราคาหุ้นรายตัว
function renderStockChart() {
  const stock = state.stocks.find((s) => s.symbol === state.selectedSymbol) || state.stocks[0];
  if (!stock) return;

  const firstPrice = stock.history[0] || stock.price;
  const diff = stock.price - firstPrice;
  const diffPct = firstPrice > 0 ? (diff / firstPrice) * 100 : 0;
  const isUp = diff >= 0;

  document.getElementById('selectedStockTitle').textContent = `กราฟราคาหุ้น: ${stock.symbol}`;
  document.getElementById('selectedStockDesc').textContent = `${stock.name} | กลุ่ม${stock.sector}`;
  document.getElementById('selectedStockPrice').textContent = `${formatMoney(stock.price)} ฿`;

  const changeEl = document.getElementById('selectedStockChange');
  changeEl.textContent = `${isUp ? '▲ +' : '▼ '}${formatMoney(diff)} (${isUp ? '+' : ''}${diffPct.toFixed(2)}%)`;
  changeEl.className = `price-change ${isUp ? 'positive' : 'negative'}`;

  // อัปเดตข่าวล่าสุดของหุ้นตัวนี้
  const relatedNews = state.newsFeed.find((n) => n.symbol === stock.symbol || n.symbol === 'ALL');
  document.getElementById('selectedStockLatestNews').textContent = relatedNews
    ? `[${relatedNews.time}] ${relatedNews.headline}`
    : 'ยังไม่มีข่าวด่วนเฉพาะตัว ราคาเคลื่อนไหวตามภาวะตลาด';

  const lineColor = isUp ? '#16a34a' : '#dc2626';
  const fillColor = isUp ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)';

  const ctx = document.getElementById('stockPriceChart').getContext('2d');
  if (stockPriceChart) {
    stockPriceChart.data.labels = state.timeLabels.slice(-stock.history.length);
    stockPriceChart.data.datasets[0].label = `ราคา ${stock.symbol} (บาท)`;
    stockPriceChart.data.datasets[0].data = stock.history;
    stockPriceChart.data.datasets[0].borderColor = lineColor;
    stockPriceChart.data.datasets[0].backgroundColor = fillColor;
    stockPriceChart.update('none');
  } else {
    stockPriceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: state.timeLabels.slice(-stock.history.length),
        datasets: [
          {
            label: `ราคา ${stock.symbol} (บาท)`,
            data: stock.history,
            borderColor: lineColor,
            backgroundColor: fillColor,
            borderWidth: 2.5,
            pointRadius: 3,
            tension: 0.25,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => `${Number(val).toFixed(2)} ฿`
            }
          }
        }
      }
    });
  }
}

// อัปเดตรายการตัวเลือกหุ้นในฟอร์มซื้อขาย และฟอร์ม Admin
function syncStockDropdowns() {
  const orderSelect = document.getElementById('orderSymbol');
  const adminTargetSelect = document.getElementById('adminNewsTarget');

  const currentOrderVal = orderSelect.value || state.selectedSymbol;
  orderSelect.innerHTML = '';
  adminTargetSelect.innerHTML = '<option value="ALL">ทั้งตลาด (ALL)</option>';

  state.stocks.forEach((s) => {
    const opt1 = document.createElement('option');
    opt1.value = s.symbol;
    opt1.textContent = `${s.symbol} - ${s.name} (${formatMoney(s.price)} ฿)`;
    orderSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = s.symbol;
    opt2.textContent = `${s.symbol} (${s.name})`;
    adminTargetSelect.appendChild(opt2);
  });

  if (state.stocks.some((s) => s.symbol === currentOrderVal)) {
    orderSelect.value = currentOrderVal;
  }
}

// คำนวณยอดในฟอร์มส่งคำสั่งซื้อขาย
function updateOrderFormCalculations() {
  const symbol = document.getElementById('orderSymbol').value;
  const type = document.getElementById('orderType').value;
  const qty = parseInt(document.getElementById('orderQty').value, 10) || 0;
  const stock = state.stocks.find((s) => s.symbol === symbol);
  const price = stock ? stock.price : 0;

  document.getElementById('orderPrice').value = `${formatMoney(price)} บาท`;
  document.getElementById('orderEstimatedTotal').textContent = `${formatMoney(qty * price)} บาท`;

  const powerLabel = document.getElementById('orderPowerLabel');
  const maxPowerEl = document.getElementById('orderMaxPower');
  const submitBtn = document.getElementById('executeOrderBtn');

  if (type === 'BUY') {
    const maxBuy = price > 0 ? Math.floor(state.cash / price) : 0;
    powerLabel.textContent = 'กำลังซื้อสูงสุด (จากเงินสดที่มี):';
    maxPowerEl.textContent = `${maxBuy.toLocaleString()} หุ้น`;
    submitBtn.textContent = `ยืนยันคำสั่งซื้อ ${symbol} (BUY)`;
    submitBtn.className = 'btn btn-buy full-width';
  } else {
    const owned = state.holdings[symbol] ? state.holdings[symbol].qty : 0;
    powerLabel.textContent = 'จำนวนหุ้นที่ถือครองพร้อมขาย:';
    maxPowerEl.textContent = `${owned.toLocaleString()} หุ้น`;
    submitBtn.textContent = `ยืนยันคำสั่งขาย ${symbol} (SELL)`;
    submitBtn.className = 'btn btn-sell-action full-width';
  }
}

// ส่งคำสั่งซื้อ / ขาย
document.getElementById('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const symbol = document.getElementById('orderSymbol').value;
  const type = document.getElementById('orderType').value;
  const qty = parseInt(document.getElementById('orderQty').value, 10);
  const stock = state.stocks.find((s) => s.symbol === symbol);

  if (!stock || isNaN(qty) || qty <= 0) {
    alert('กรุณาระบุจำนวนหุ้นที่ต้องการให้ถูกต้อง (อย่างน้อย 1 หุ้น)');
    return;
  }

  const price = stock.price;
  const totalValue = qty * price;
  const timestamp = `${new Date().toLocaleDateString('th-TH')} ${getCurrentTimeStr()}`;

  if (type === 'BUY') {
    if (totalValue > state.cash + 1e-6) {
      alert(`เงินสดไม่เพียงพอ! คุณมีเงินสด ${formatMoney(state.cash)} บาท แต่คำสั่งซื้อนี้ต้องใช้ ${formatMoney(totalValue)} บาท`);
      return;
    }

    state.cash -= totalValue;
    if (!state.holdings[symbol]) {
      state.holdings[symbol] = { qty: 0, avgCost: 0 };
    }
    const pos = state.holdings[symbol];
    const newTotalQty = pos.qty + qty;
    const newTotalCost = pos.qty * pos.avgCost + totalValue;
    pos.qty = newTotalQty;
    pos.avgCost = newTotalCost / newTotalQty;

    state.transactions.unshift({
      time: timestamp,
      symbol,
      type: 'BUY',
      qty,
      price,
      total: totalValue,
      realizedPL: null
    });
  } else {
    const pos = state.holdings[symbol];
    if (!pos || qty > pos.qty) {
      alert(`จำนวนหุ้นไม่พอขาย! คุณมีหุ้น ${symbol} อยู่ในพอร์ต ${pos ? pos.qty : 0} หุ้น`);
      return;
    }

    const realized = (price - pos.avgCost) * qty;
    state.realizedPL += realized;
    state.cash += totalValue;
    pos.qty -= qty;

    if (pos.qty <= 0) {
      delete state.holdings[symbol];
    }

    state.transactions.unshift({
      time: timestamp,
      symbol,
      type: 'SELL',
      qty,
      price,
      total: totalValue,
      realizedPL: realized
    });
  }

  document.getElementById('orderQty').value = '';
  saveState();
  renderAll();
});

// ปุ่มลัดสัดส่วน %
document.querySelectorAll('.pct-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const pct = parseFloat(btn.dataset.pct);
    const symbol = document.getElementById('orderSymbol').value;
    const type = document.getElementById('orderType').value;
    const stock = state.stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    if (type === 'BUY') {
      const maxBuy = Math.floor(state.cash / stock.price);
      document.getElementById('orderQty').value = Math.max(1, Math.floor(maxBuy * pct));
    } else {
      const owned = state.holdings[symbol] ? state.holdings[symbol].qty : 0;
      document.getElementById('orderQty').value = owned > 0 ? Math.max(1, Math.floor(owned * pct)) : 0;
    }
    updateOrderFormCalculations();
  });
});

document.getElementById('orderSymbol').addEventListener('change', (e) => {
  selectStock(e.target.value);
});
document.getElementById('orderType').addEventListener('change', updateOrderFormCalculations);
document.getElementById('orderQty').addEventListener('input', updateOrderFormCalculations);

// วาดกราฟสัดส่วนพอร์ต (เงินสด vs หุ้นแต่ละตัว)
function renderAllocationChart() {
  const labels = ['เงินสด (Cash)'];
  const data = [Number(state.cash.toFixed(2))];
  const colors = ['#94a3b8', '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#14b8a6'];

  Object.entries(state.holdings).forEach(([symbol, pos]) => {
    const stock = state.stocks.find((s) => s.symbol === symbol);
    const val = pos.qty * (stock ? stock.price : pos.avgCost);
    if (val > 0) {
      labels.push(symbol);
      data.push(Number(val.toFixed(2)));
    }
  });

  const ctx = document.getElementById('allocationChart').getContext('2d');
  if (allocationChart) {
    allocationChart.data.labels = labels;
    allocationChart.data.datasets[0].data = data;
    allocationChart.update('none');
  } else {
    allocationChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Prompt', size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${formatMoney(ctx.parsed)} ฿ (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }
}

// แสดงฟีดข่าว
function renderNewsFeed() {
  const list = document.getElementById('newsFeedList');
  list.innerHTML = '';

  state.newsFeed.forEach((item) => {
    const div = document.createElement('div');
    const sentiment = item.impact > 0 ? 'good' : item.impact < 0 ? 'bad' : '';
    const impactLabel =
      item.impact > 0
        ? `+${(item.impact * 100).toFixed(1)}%`
        : item.impact < 0
        ? `${(item.impact * 100).toFixed(1)}%`
        : 'ปกติ';

    div.className = `news-item ${sentiment}`;
    div.innerHTML = `
      <div class="news-item-meta">
        <span><strong>${item.symbol === 'ALL' ? 'ภาพรวมตลาด' : item.symbol}</strong> • ผลกระทบ ${impactLabel}</span>
        <span>${item.time} น.</span>
      </div>
      <div class="news-item-title">${item.headline}</div>
    `;
    list.appendChild(div);
  });
}

// แสดงตารางหุ้นที่ถือครอง
function renderHoldingsTable() {
  const tbody = document.getElementById('holdingsBody');
  const emptyState = document.getElementById('holdingsEmptyState');
  tbody.innerHTML = '';

  const entries = Object.entries(state.holdings);
  if (entries.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  entries.forEach(([symbol, pos]) => {
    const stock = state.stocks.find((s) => s.symbol === symbol);
    const currentPrice = stock ? stock.price : pos.avgCost;
    const marketVal = pos.qty * currentPrice;
    const unrealPL = (currentPrice - pos.avgCost) * pos.qty;
    const plClass = getPLClass(unrealPL);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${symbol}</strong></td>
      <td class="text-right">${pos.qty.toLocaleString()}</td>
      <td class="text-right">${formatMoney(pos.avgCost)}</td>
      <td class="text-right">${formatMoney(currentPrice)}</td>
      <td class="text-right"><strong>${formatMoney(marketVal)}</strong></td>
      <td class="text-right ${plClass}"><strong>${formatSignedMoney(unrealPL)}</strong></td>
      <td class="text-center">
        <button type="button" class="btn-quick-sell" data-symbol="${symbol}">ขายทั้งหมด</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-quick-sell').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sym = btn.dataset.symbol;
      const pos = state.holdings[sym];
      if (!pos) return;
      selectStock(sym);
      document.getElementById('orderType').value = 'SELL';
      document.getElementById('orderQty').value = pos.qty;
      updateOrderFormCalculations();
    });
  });
}

// แสดงประวัติคำสั่งซื้อขาย
function renderHistoryTable() {
  const tbody = document.getElementById('historyBody');
  const emptyState = document.getElementById('historyEmptyState');
  tbody.innerHTML = '';

  if (state.transactions.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  state.transactions.forEach((tx) => {
    const tr = document.createElement('tr');
    const badgeClass = tx.type === 'BUY' ? 'badge-buy' : 'badge-sell';
    const plText = tx.realizedPL !== null ? `${formatSignedMoney(tx.realizedPL)} ฿` : '-';
    const plClass = tx.realizedPL !== null ? getPLClass(tx.realizedPL) : 'neutral';

    tr.innerHTML = `
      <td>${tx.time}</td>
      <td><strong>${tx.symbol}</strong></td>
      <td><span class="badge ${badgeClass}">${tx.type}</span></td>
      <td class="text-right">${tx.qty.toLocaleString()}</td>
      <td class="text-right">${formatMoney(tx.price)}</td>
      <td class="text-right">${formatMoney(tx.total)}</td>
      <td class="text-right ${plClass}"><strong>${plText}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

// ระบบสลับโหมด User / Admin
document.getElementById('userModeBtn').addEventListener('click', () => {
  document.getElementById('userModeBtn').classList.add('active');
  document.getElementById('adminModeBtn').classList.remove('active');
  document.getElementById('adminPanel').classList.add('hidden');
});

document.getElementById('adminModeBtn').addEventListener('click', () => {
  document.getElementById('adminModeBtn').classList.add('active');
  document.getElementById('userModeBtn').classList.remove('active');
  document.getElementById('adminPanel').classList.remove('hidden');
});

// Admin: ประกาศข่าวด่วนกำหนดเอง
document.getElementById('adminNewsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const target = document.getElementById('adminNewsTarget').value;
  const impact = parseFloat(document.getElementById('adminNewsImpact').value);
  const headline = document.getElementById('adminNewsHeadline').value.trim();
  if (!headline) return;

  const timeStr = getCurrentTimeStr();
  state.timeLabels.push(timeStr);
  if (state.timeLabels.length > 25) state.timeLabels.shift();

  const newsObj = { time: timeStr, symbol: target, impact, headline: `[ข่าวประกาศ] ${headline}` };
  applyNewsImpact(newsObj);

  state.stocks.forEach((stock) => {
    stock.prevPrice = stock.price;
    if (target === 'ALL' || target === stock.symbol) {
      stock.price = Math.max(1.0, Number((stock.price * (1 + impact)).toFixed(2)));
    }
    stock.history.push(stock.price);
    if (stock.history.length > 25) stock.history.shift();
  });

  document.getElementById('adminNewsHeadline').value = '';
  if (target !== 'ALL') selectStock(target);
  saveState();
  renderAll();
});

// Admin: เพิ่มหุ้นใหม่หรือแก้ราคาหุ้น
document.getElementById('adminStockForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const symbol = document.getElementById('adminStockSymbol').value.trim().toUpperCase();
  const price = parseFloat(document.getElementById('adminStockPrice').value);
  const name = document.getElementById('adminStockName').value.trim();
  const sector = document.getElementById('adminStockSector').value.trim();

  if (!symbol || isNaN(price) || price <= 0) return;

  const existing = state.stocks.find((s) => s.symbol === symbol);
  if (existing) {
    existing.price = Number(price.toFixed(2));
    existing.name = name || existing.name;
    existing.sector = sector || existing.sector;
    existing.history.push(existing.price);
    if (existing.history.length > 25) existing.history.shift();
    alert(`อัปเดตราคาและข้อมูลหุ้น ${symbol} เรียบร้อยแล้ว`);
  } else {
    const history = Array(10).fill(Number(price.toFixed(2)));
    state.stocks.push({
      symbol,
      name,
      sector,
      price: Number(price.toFixed(2)),
      prevPrice: Number(price.toFixed(2)),
      history
    });
    alert(`เพิ่มหุ้น ${symbol} เข้าสู่กระดานเรียบร้อยแล้ว`);
  }

  document.getElementById('adminStockForm').reset();
  saveState();
  renderAll();
});

// ปุ่มควบคุมการจำลองตลาด
document.getElementById('toggleSimBtn').addEventListener('click', () => {
  isSimRunning = !isSimRunning;
  const badge = document.getElementById('liveBadge');
  const btn = document.getElementById('toggleSimBtn');
  if (isSimRunning) {
    badge.classList.remove('paused');
    badge.innerHTML = '<span class="dot"></span> ตลาดเปิดจำลองอัตโนมัติ';
    btn.textContent = 'หยุดเวลาชั่วคราว';
  } else {
    badge.classList.add('paused');
    badge.innerHTML = '<span class="dot"></span> หยุดจำลองชั่วคราว';
    btn.textContent = 'เปิดจำลองอัตโนมัติ';
  }
});

document.getElementById('stepTickBtn').addEventListener('click', () => stepMarket(false));
document.getElementById('triggerNewsBtn').addEventListener('click', () => stepMarket(true));

document.getElementById('resetSystemBtn').addEventListener('click', () => {
  if (!confirm('ยืนยันรีเซ็ตพอร์ตทั้งหมดกลับไปเริ่มต้นที่เงินสด 1,000,000 บาท ใช่หรือไม่?')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadInitialState();
  renderAll();
});

function renderAll() {
  syncStockDropdowns();
  renderSummaryCards();
  renderMarketTable();
  renderStockChart();
  updateOrderFormCalculations();
  renderAllocationChart();
  renderNewsFeed();
  renderHoldingsTable();
  renderHistoryTable();
}

// เริ่มทำงาน
renderAll();
simInterval = setInterval(() => {
  if (isSimRunning) {
    stepMarket(false);
  }
}, 4000);