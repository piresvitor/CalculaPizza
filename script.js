// Estado global da aplicação
let currentPlatform = 'ifood'; // 'ifood' | '99food' | 'compare'
let deliveryType = 'own';      // 'own' | 'platform'
let calcMode = 'ideal';        // 'ideal' | 'simulate'
let marginUnit = 'percent';    // 'percent' | 'fixed'

const STORAGE_KEY = 'pizzaprice_pro_settings_v2';

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  updatePromoInputs();
  
  // Adiciona listener global para salvar alterações automaticamente em qualquer input/select
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      saveSettings();
      calculateAll();
    });
    el.addEventListener('change', () => {
      saveSettings();
      calculateAll();
    });
  });

  calculateAll();
});

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500';
  
  toast.className = `toast-animate pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-white text-xs font-medium border ${bgColor} flex items-center gap-2.5`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-sm"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function saveSettings() {
  const settings = {
    pizzaName: document.getElementById('pizzaName') ? document.getElementById('pizzaName').value : '',
    cmvCost: document.getElementById('cmvCost') ? document.getElementById('cmvCost').value : '',
    packagingCost: document.getElementById('packagingCost') ? document.getElementById('packagingCost').value : '',
    fixedOverhead: document.getElementById('fixedOverhead') ? document.getElementById('fixedOverhead').value : '',
    taxRate: document.getElementById('taxRate') ? document.getElementById('taxRate').value : '',
    ownCourierCost: document.getElementById('ownCourierCost') ? document.getElementById('ownCourierCost').value : '',
    clientDeliveryFee: document.getElementById('clientDeliveryFee') ? document.getElementById('clientDeliveryFee').value : '',
    ifoodCommission: document.getElementById('ifoodCommission') ? document.getElementById('ifoodCommission').value : '',
    ifoodPaymentFee: document.getElementById('ifoodPaymentFee') ? document.getElementById('ifoodPaymentFee').value : '',
    food99Commission: document.getElementById('food99Commission') ? document.getElementById('food99Commission').value : '',
    food99PaymentFee: document.getElementById('food99PaymentFee') ? document.getElementById('food99PaymentFee').value : '',
    ifoodAnticipationRate: document.getElementById('ifoodAnticipationRate') ? document.getElementById('ifoodAnticipationRate').value : '',
    food99AnticipationRate: document.getElementById('food99AnticipationRate') ? document.getElementById('food99AnticipationRate').value : '',
    freeDeliverySubsidy: document.getElementById('freeDeliverySubsidy') ? document.getElementById('freeDeliverySubsidy').value : '',
    promoType: document.getElementById('promoType') ? document.getElementById('promoType').value : '',
    promoValueInput: document.getElementById('promoValueInput') ? document.getElementById('promoValueInput').value : '',
    promoClientTotalDiscount: document.getElementById('promoClientTotalDiscount') ? document.getElementById('promoClientTotalDiscount').value : '',
    promoStoreSubsidy: document.getElementById('promoStoreSubsidy') ? document.getElementById('promoStoreSubsidy').value : ''
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    Object.keys(data).forEach(key => {
      const el = document.getElementById(key);
      if (el && data[key] !== undefined && data[key] !== '') {
        el.value = data[key];
      }
    });
  } catch (e) {
    console.error('Erro ao carregar configurações do LocalStorage:', e);
  }
}

function updatePromoInputs() {
  const type = document.getElementById('promoType') ? document.getElementById('promoType').value : 'percent';
  const sharedExtra = document.getElementById('shared-promo-extra');
  const inputContainer1 = document.getElementById('promo-input-container-1');
  const labelVal1 = document.getElementById('label-val-1');
  const explainer = document.getElementById('promo-explainer-text');

  if (sharedExtra && inputContainer1 && labelVal1) {
    if (type === 'shared_fixed') {
      sharedExtra.classList.remove('hidden');
      inputContainer1.classList.add('hidden');
      explainer.textContent = "Exemplo iFood: O cliente ganha R$ 10,00 de desconto no app, mas você (loja) só banca o seu subsídio (ex: R$ 5,00). O restante é custeado pela plataforma.";
    } else if (type === 'fixed') {
      sharedExtra.classList.add('hidden');
      inputContainer1.classList.remove('hidden');
      labelVal1.textContent = "Valor do Cupom da Loja (R$)";
      explainer.textContent = "Cupom 100% bancado por você (ex: R$ 5,00 de desconto na 1ª compra que sai integralmente do seu lucro).";
    } else {
      sharedExtra.classList.add('hidden');
      inputContainer1.classList.remove('hidden');
      labelVal1.textContent = "Desconto no Item (%)";
      explainer.textContent = "Campanha inteligente em que o preço de venda é reduzido percentualmente no app mantendo a margem ou avaliando conversão.";
    }
  }
  calculateAll();
}

function setPlatform(platform) {
  currentPlatform = platform;
  
  document.getElementById('tab-ifood').className = platform === 'ifood' 
    ? 'py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-ifood text-white shadow-lg shadow-ifood/25'
    : 'py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:bg-dark-800';
    
  document.getElementById('tab-99food').className = platform === '99food' 
    ? 'py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-food99 text-white shadow-lg shadow-food99/25'
    : 'py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:bg-dark-800';
    
  document.getElementById('tab-compare').className = platform === 'compare' 
    ? 'py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-zinc-700 text-white shadow-lg'
    : 'py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:bg-dark-800';

  const singleCard = document.getElementById('single-result-card');
  const compareCard = document.getElementById('compare-result-card');

  if (platform === 'compare') {
    singleCard.classList.add('hidden');
    compareCard.classList.remove('hidden');
  } else {
    singleCard.classList.remove('hidden');
    compareCard.classList.add('hidden');
    
    const tag = document.getElementById('result-platform-tag');
    const glow = document.getElementById('result-glow');
    if (platform === 'ifood') {
      tag.className = 'text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-ifood/20 text-ifood border border-ifood/30';
      tag.textContent = 'iFood';
      glow.className = 'absolute top-0 right-0 w-32 h-32 bg-ifood/10 rounded-full blur-2xl pointer-events-none';
    } else {
      tag.className = 'text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-food99/20 text-food99 border border-food99/30';
      tag.textContent = '99Food';
      glow.className = 'absolute top-0 right-0 w-32 h-32 bg-food99/10 rounded-full blur-2xl pointer-events-none';
    }
  }

  calculateAll();
}

function setDeliveryType(type) {
  deliveryType = type;
  const btnOwn = document.getElementById('btn-delivery-own');
  const btnPlat = document.getElementById('btn-delivery-platform');
  const ownBox = document.getElementById('own-delivery-box');

  if (type === 'own') {
    btnOwn.className = 'p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 text-left transition flex items-start gap-3';
    btnPlat.className = 'p-3.5 rounded-xl border-2 border-dark-700 bg-dark-850 hover:border-zinc-600 text-left transition flex items-start gap-3';
    ownBox.classList.remove('hidden');
  } else {
    btnOwn.className = 'p-3.5 rounded-xl border-2 border-dark-700 bg-dark-850 hover:border-zinc-600 text-left transition flex items-start gap-3';
    btnPlat.className = 'p-3.5 rounded-xl border-2 border-amber-500 bg-amber-500/10 text-left transition flex items-start gap-3';
    ownBox.classList.add('hidden');
  }
  calculateAll();
}

function setCalcMode(mode) {
  calcMode = mode;
  const btnIdeal = document.getElementById('mode-ideal');
  const btnSimulate = document.getElementById('mode-simulate');
  const inputIdeal = document.getElementById('input-mode-ideal');
  const inputSimulate = document.getElementById('input-mode-simulate');

  if (mode === 'ideal') {
    btnIdeal.className = 'py-2 px-3 rounded-lg text-xs font-semibold bg-dark-800 text-white shadow transition';
    btnSimulate.className = 'py-2 px-3 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition';
    inputIdeal.classList.remove('hidden');
    inputSimulate.classList.add('hidden');
  } else {
    btnSimulate.className = 'py-2 px-3 rounded-lg text-xs font-semibold bg-dark-800 text-white shadow transition';
    btnIdeal.className = 'py-2 px-3 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition';
    inputSimulate.classList.remove('hidden');
    inputIdeal.classList.add('hidden');
  }
  calculateAll();
}

function setMarginUnit(unit) {
  marginUnit = unit;
  const btnPct = document.getElementById('margin-unit-percent');
  const btnFix = document.getElementById('margin-unit-fixed');
  const suffix = document.getElementById('target-margin-suffix');
  const input = document.getElementById('targetMarginValue');

  if (unit === 'percent') {
    btnPct.className = 'px-2.5 py-0.5 text-xs font-mono rounded-md bg-emerald-600 text-white font-semibold';
    btnFix.className = 'px-2.5 py-0.5 text-xs font-mono rounded-md text-zinc-400 hover:text-white';
    suffix.textContent = '%';
    input.value = '22';
  } else {
    btnFix.className = 'px-2.5 py-0.5 text-xs font-mono rounded-md bg-emerald-600 text-white font-semibold';
    btnPct.className = 'px-2.5 py-0.5 text-xs font-mono rounded-md text-zinc-400 hover:text-white';
    suffix.textContent = 'R$';
    input.value = '12.00';
  }
  calculateAll();
}

function applyMarginPreset(val) {
  setMarginUnit('percent');
  document.getElementById('targetMarginValue').value = val;
  calculateAll();
}

function toggleStrategy(strategy) {
  if (strategy === 'freeDelivery') {
    const active = document.getElementById('toggleFreeDelivery').checked;
    document.getElementById('freeDeliveryDetails').classList.toggle('hidden', !active);
  } else if (strategy === 'anticipation') {
    const active = document.getElementById('toggleAnticipation').checked;
    document.getElementById('anticipationDetails').classList.toggle('hidden', !active);
  } else if (strategy === 'promo') {
    const active = document.getElementById('togglePromo').checked;
    document.getElementById('promoDetails').classList.toggle('hidden', !active);
  }
  calculateAll();
}

function toggleRatesAccordion() {
  const body = document.getElementById('rates-accordion-body');
  const chevron = document.getElementById('rates-chevron');
  body.classList.toggle('hidden');
  chevron.style.transform = body.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
}

function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById('pizzaName').value = 'Pizza Calabresa Especial (Grande - 8 fatias)';
  document.getElementById('cmvCost').value = '18.50';
  document.getElementById('packagingCost').value = '3.20';
  document.getElementById('fixedOverhead').value = '2.50';
  document.getElementById('taxRate').value = '6.0';
  document.getElementById('ownCourierCost').value = '7.00';
  document.getElementById('clientDeliveryFee').value = '5.00';
  document.getElementById('ifoodCommission').value = '12.0';
  document.getElementById('ifoodPaymentFee').value = '3.2';
  document.getElementById('food99Commission').value = '12.0';
  document.getElementById('food99PaymentFee').value = '3.2';
  document.getElementById('ifoodAnticipationRate').value = '1.59';
  document.getElementById('food99AnticipationRate').value = '1.49';
  calculateAll();
  showToast('Taxas padrão restauradas!', 'success');
}

function saveCurrentPizza() {
  const name = document.getElementById('pizzaName').value;
  const saved = JSON.parse(localStorage.getItem('pizza_prices_saved') || '[]');
  saved.push({ name, date: new Date().toLocaleDateString('pt-BR') });
  localStorage.setItem('pizza_prices_saved', JSON.stringify(saved));
  showToast(`Pizza "${name}" salva com sucesso!`, 'success');
}

function applyPsychologicalPrice() {
  if (calcMode === 'ideal') {
    const priceText = document.getElementById('final-price-display').textContent;
    const num = parseFloat(priceText.replace('R$', '').replace('.', '').replace(',', '.').trim());
    if (!isNaN(num)) {
      const rounded = Math.floor(num) + 0.90;
      setCalcMode('simulate');
      document.getElementById('currentMenuPrice').value = rounded.toFixed(2);
      showToast(`Preço ajustado para R$ ${rounded.toFixed(2)} (,90)`, 'success');
    }
  } else {
    const cur = parseFloat(document.getElementById('currentMenuPrice').value) || 0;
    const rounded = Math.floor(cur) + 0.90;
    document.getElementById('currentMenuPrice').value = rounded.toFixed(2);
    calculateAll();
    showToast(`Preço arredondado para R$ ${rounded.toFixed(2)}`, 'success');
  }
}

// Motor de Cálculo Principal
function calculateForPlatform(platform) {
  const cmv = parseFloat(document.getElementById('cmvCost').value) || 0;
  const packaging = parseFloat(document.getElementById('packagingCost').value) || 0;
  const fixed = parseFloat(document.getElementById('fixedOverhead').value) || 0;
  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  
  const productionCost = cmv + packaging + fixed;

  let commission = platform === 'ifood' 
    ? (parseFloat(document.getElementById('ifoodCommission').value) || 0)
    : (parseFloat(document.getElementById('food99Commission').value) || 0);

  if (deliveryType === 'platform') {
    commission = 23.0;
  }

  const paymentFee = platform === 'ifood'
    ? (parseFloat(document.getElementById('ifoodPaymentFee').value) || 0)
    : (parseFloat(document.getElementById('food99PaymentFee').value) || 0);

  const anticipationActive = document.getElementById('toggleAnticipation').checked;
  const anticipationRate = anticipationActive 
    ? (platform === 'ifood' ? parseFloat(document.getElementById('ifoodAnticipationRate').value) || 1.59 : parseFloat(document.getElementById('food99AnticipationRate').value) || 1.49)
    : 0;

  const freeDeliveryActive = document.getElementById('toggleFreeDelivery').checked;
  const freeDeliverySubsidy = freeDeliveryActive && document.getElementById('freeDeliverySubsidy') ? (parseFloat(document.getElementById('freeDeliverySubsidy').value) || 0) : 0;
  
  const ownCourierCost = parseFloat(document.getElementById('ownCourierCost').value) || 0;
  const clientDeliveryFee = parseFloat(document.getElementById('clientDeliveryFee').value) || 0;

  let dynamicCourierSubsidy = Math.max(0, ownCourierCost - clientDeliveryFee);
  const hintEl = document.getElementById('own-delivery-summary-hint');
  if (hintEl) {
    hintEl.innerHTML = `Subsídio atual da pizzaria no frete: <strong class="text-amber-400">R$ ${dynamicCourierSubsidy.toFixed(2).replace('.', ',')}</strong> por pedido.`;
  }

  let netDeliveryCost = 0;
  if (deliveryType === 'own') {
    netDeliveryCost = freeDeliveryActive ? ownCourierCost : dynamicCourierSubsidy;
  } else {
    netDeliveryCost = freeDeliveryActive ? freeDeliverySubsidy : 0;
  }

  const totalDeductionsPct = (commission + paymentFee + anticipationRate + taxRate) / 100;
  const totalFixedOutflow = productionCost + netDeliveryCost;

  let basePrice = 0;
  if (calcMode === 'ideal') {
    const targetVal = parseFloat(document.getElementById('targetMarginValue').value) || 0;
    if (marginUnit === 'percent') {
      const marginPct = targetVal / 100;
      const denom = 1 - totalDeductionsPct - marginPct;
      basePrice = denom > 0.05 ? totalFixedOutflow / denom : totalFixedOutflow * 3;
    } else {
      const denom = 1 - totalDeductionsPct;
      basePrice = denom > 0.05 ? (totalFixedOutflow + targetVal) / denom : totalFixedOutflow + targetVal;
    }
  } else {
    basePrice = parseFloat(document.getElementById('currentMenuPrice').value) || 0;
  }

  // TRATAMENTO DE PROMOÇÕES E COPARTICIPAÇÃO
  const promoActive = document.getElementById('togglePromo').checked;
  const promoType = document.getElementById('promoType') ? document.getElementById('promoType').value : 'percent';
  
  let effectiveSellingPrice = basePrice;
  let anchorPrice = basePrice;

  if (promoActive) {
    if (promoType === 'percent') {
      const promoVal = parseFloat(document.getElementById('promoValueInput').value) || 0;
      const discountFactor = Math.max(0.05, 1 - (promoVal / 100));
      effectiveSellingPrice = basePrice * discountFactor;
      anchorPrice = basePrice;
    } else if (promoType === 'shared_fixed') {
      const storeSubsidy = parseFloat(document.getElementById('promoStoreSubsidy').value) || 0;
      const clientDiscountTotal = parseFloat(document.getElementById('promoClientTotalDiscount').value) || 0;
      
      effectiveSellingPrice = Math.max(0, basePrice - storeSubsidy);
      anchorPrice = basePrice + (clientDiscountTotal - storeSubsidy);
    } else {
      const storeSubsidy = parseFloat(document.getElementById('promoValueInput').value) || 0;
      effectiveSellingPrice = Math.max(0, basePrice - storeSubsidy);
      anchorPrice = basePrice;
    }
  } else {
    anchorPrice = 0;
  }

  const commissionVal = effectiveSellingPrice * (commission / 100);
  const paymentVal = effectiveSellingPrice * (paymentFee / 100);
  const anticipationVal = effectiveSellingPrice * (anticipationRate / 100);
  const taxVal = effectiveSellingPrice * (taxRate / 100);

  const totalFees = commissionVal + paymentVal + anticipationVal;
  const payout = effectiveSellingPrice - totalFees;
  const netProfit = payout - taxVal - totalFixedOutflow;
  const netMargin = effectiveSellingPrice > 0 ? (netProfit / effectiveSellingPrice) * 100 : 0;

  return {
    sellingPrice: effectiveSellingPrice,
    anchorPrice: anchorPrice,
    productionCost,
    netDeliveryCost,
    commissionVal,
    paymentVal,
    anticipationVal,
    taxVal,
    totalFees,
    payout,
    netProfit,
    netMargin
  };
}

function calculateAll() {
  const pizzaName = document.getElementById('pizzaName').value || 'Pizza';
  
  if (currentPlatform === 'compare') {
    const resIfood = calculateForPlatform('ifood');
    const res99 = calculateForPlatform('99food');

    const rows = [
      ['Preço Final no App', `R$ ${resIfood.sellingPrice.toFixed(2)}`, `R$ ${res99.sellingPrice.toFixed(2)}`],
      ['Taxas Totais App', `R$ ${resIfood.totalFees.toFixed(2)}`, `R$ ${res99.totalFees.toFixed(2)}`],
      ['Repasse Líquido', `R$ ${resIfood.payout.toFixed(2)}`, `R$ ${res99.payout.toFixed(2)}`],
      ['Lucro Líquido Real', `R$ ${resIfood.netProfit.toFixed(2)}`, `R$ ${res99.netProfit.toFixed(2)}`],
      ['Margem Líquida', `${resIfood.netMargin.toFixed(1)}%`, `${res99.netMargin.toFixed(1)}%`]
    ];

    document.getElementById('compare-table-body').innerHTML = rows.map(r => `
      <tr class="hover:bg-dark-850/50 transition">
        <td class="py-3 px-2 font-medium text-zinc-300">${r[0]}</td>
        <td class="py-3 px-2 text-ifood font-bold">${r[1]}</td>
        <td class="py-3 px-2 text-food99 font-bold">${r[2]}</td>
      </tr>
    `).join('');
  } else {
    const res = calculateForPlatform(currentPlatform);

    document.getElementById('result-pizza-title').textContent = pizzaName;
    document.getElementById('final-price-display').textContent = `R$ ${res.sellingPrice.toFixed(2)}`;
    
    const anchorEl = document.getElementById('anchor-price-display');
    if (res.anchorPrice > 0 && res.anchorPrice > res.sellingPrice) {
      anchorEl.textContent = `De R$ ${res.anchorPrice.toFixed(2)}`;
      anchorEl.classList.remove('hidden');
    } else {
      anchorEl.classList.add('hidden');
    }

    const netProfitEl = document.getElementById('kpi-net-profit');
    netProfitEl.textContent = `R$ ${res.netProfit.toFixed(2)}`;
    netProfitEl.className = `text-lg font-bold font-mono ${res.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;

    document.getElementById('kpi-net-margin').textContent = `${res.netMargin.toFixed(1)}%`;
    document.getElementById('kpi-total-fees').textContent = `R$ ${res.totalFees.toFixed(2)}`;
    document.getElementById('kpi-payout').textContent = `R$ ${res.payout.toFixed(2)}`;

    document.getElementById('breakdown-delivery-type-label').textContent = deliveryType === 'own' ? 'Entrega Própria' : 'Entrega Plataforma';

    const items = [
      ['CMV Insumos + Embalagem + Fixo', `- R$ ${(res.productionCost).toFixed(2)}`],
      ['Custo Líquido de Entrega', `- R$ ${res.netDeliveryCost.toFixed(2)}`],
      ['Comissão da Plataforma', `- R$ ${res.commissionVal.toFixed(2)}`],
      ['Taxa de Pagamento Online', `- R$ ${res.paymentVal.toFixed(2)}`],
      ['Adiantamento de Recebíveis', `- R$ ${res.anticipationVal.toFixed(2)}`],
      ['Impostos / DAS', `- R$ ${res.taxVal.toFixed(2)}`]
    ];

    document.getElementById('breakdown-list').innerHTML = items.map(item => `
      <div class="flex items-center justify-between">
        <span class="text-zinc-400">${item[0]}</span>
        <span class="font-mono text-zinc-200">${item[1]}</span>
      </div>
    `).join('');
  }
}

function exportToCsv() {
  const name = document.getElementById('pizzaName').value;
  const resIfood = calculateForPlatform('ifood');
  const res99 = calculateForPlatform('99food');

  const fmt = (val) => val.toFixed(2).replace('.', ',');

  const csvRows = [
    ["Pizza", "Plataforma", "Preço Venda (R$)", "Taxas Totais (R$)", "Repasse (R$)", "Lucro Líquido (R$)", "Margem (%)"],
    [name, "iFood", fmt(resIfood.sellingPrice), fmt(resIfood.totalFees), fmt(resIfood.payout), fmt(resIfood.netProfit), resIfood.netMargin.toFixed(1).replace('.', ',')],
    [name, "99Food", fmt(res99.sellingPrice), fmt(res99.totalFees), fmt(res99.payout), fmt(res99.netProfit), res99.netMargin.toFixed(1).replace('.', ',')]
  ];

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.map(e => e.join(";")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `precificacao_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('Planilha CSV exportada com sucesso!', 'success');
}