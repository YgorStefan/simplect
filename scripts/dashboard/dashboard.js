import { getContracts } from '../contracts/contracts.requests.js';
import { markActive } from '../shared/router.js';

const STATUS_LABELS = {
  nao_enviado:           'Não enviado',
  aguardando_assinatura: 'Aguardando assinatura',
  assinado:              'Assinado',
  cancelado:             'Cancelado',
};

const STATUS_BADGE = {
  nao_enviado:           'badge--nao-enviado',
  aguardando_assinatura: 'badge--aguardando',
  assinado:              'badge--assinado',
  cancelado:             'badge--cancelado',
};

const KPI_DEFS = [
  { key: 'total',                label: 'Total',                modifier: 'total' },
  { key: 'nao_enviado',          label: 'Não enviado',          modifier: 'nao-enviado' },
  { key: 'aguardando_assinatura',label: 'Aguardando assinatura',modifier: 'aguardando' },
  { key: 'assinado',             label: 'Assinado',             modifier: 'assinado' },
  { key: 'cancelado',            label: 'Cancelado',            modifier: 'cancelado' },
];

function countByStatus(contracts) {
  const counts = { nao_enviado: 0, aguardando_assinatura: 0, assinado: 0, cancelado: 0 };
  contracts.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });
  return { total: contracts.length, ...counts };
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])
  );
}

function renderKPIs(contracts) {
  const counts = countByStatus(contracts);
  const grid = document.getElementById('kpi-grid');
  grid.innerHTML = KPI_DEFS.map(({ key, label, modifier }) => `
    <div class="stat-card stat-card--${modifier}">
      <span class="stat-card__value">${counts[key]}</span>
      <span class="stat-card__label">${label}</span>
    </div>
  `).join('');
}

function renderRecent(contracts) {
  const recent = [...contracts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const tbody = document.getElementById('recent-body');
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Nenhum contrato.</td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(c => `
    <tr>
      <td>${escapeHtml(c.contratante)}</td>
      <td>${escapeHtml(c.modelo)}</td>
      <td><span class="badge ${STATUS_BADGE[c.status]}">${STATUS_LABELS[c.status]}</span></td>
      <td class="text-muted">${formatDate(c.createdAt)}</td>
    </tr>
  `).join('');
}

function showError() {
  document.getElementById('kpi-grid').innerHTML =
    `<p style="color:var(--color-danger);font-size:var(--text-sm)">Erro ao carregar dados.</p>`;
}

async function init() {
  markActive('dashboard');
  try {
    const contracts = await getContracts();
    renderKPIs(contracts);
    renderRecent(contracts);
  } catch {
    showError();
  }
}

init();
