import { getContracts, createContract, updateContract, deleteContract, TEMPLATES } from './contracts.requests.js';
import { markActive } from '../shared/router.js';
import { toast } from '../shared/toast.js';

const STATUS_LABELS = {
  nao_enviado: 'Não enviado',
  aguardando_assinatura: 'Aguardando assinatura',
  assinado: 'Assinado',
  cancelado: 'Cancelado',
};

const STATUS_BADGE = {
  nao_enviado:           'badge--nao-enviado',
  aguardando_assinatura: 'badge--aguardando',
  assinado:              'badge--assinado',
  cancelado:             'badge--cancelado',
};

const state = {
  contracts: [],
  search: '',
  statusFilter: '',
  sortField: '',
  sortDir: 'asc',
  page: 1,
  perPage: 10,
  loading: false,
  saving: false,
  error: null,
  editingId: null,
  deletingId: null,
};

const tableBody      = document.getElementById('table-body');
const paginationInfo = document.getElementById('pagination-info');
const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');
const errorBanner    = document.getElementById('error-banner');
const errorMessage   = document.getElementById('error-message');
const tableWrapper   = document.querySelector('.table-wrapper');
const dialogDetails  = document.getElementById('dialog-details');
const dialogPreview  = document.getElementById('dialog-preview');
const detailsBody    = document.getElementById('details-body');
const previewBody    = document.getElementById('preview-body');
const dialogForm     = document.getElementById('dialog-form');
const contractForm   = document.getElementById('contract-form');
const btnSubmit      = document.getElementById('btn-submit');
const formError      = document.getElementById('form-error');
const formTitle      = document.getElementById('form-title');
const formGroupStatus = document.getElementById('form-group-status');
const fStatus        = document.getElementById('f-status');
const fTipoDoc       = document.getElementById('f-tipo-documento');
const fDocumento     = document.getElementById('f-documento');
const fCep           = document.getElementById('f-cep');
const fConteudo      = document.getElementById('f-conteudo');
const dialogConfirm  = document.getElementById('dialog-confirm');
const confirmMessage = document.getElementById('confirm-message');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

function formatAddress(c) {
  return `${c.endereco}, ${c.numero} - ${c.bairro}, ${c.cidade}/${c.uf}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])
  );
}

function onlyDigits(s) {
  return String(s).replace(/\D/g, '');
}

function maskCPF(v) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

function maskCNPJ(v) {
  const d = onlyDigits(v).slice(0, 14);
  if (d.length > 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length > 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  if (d.length > 5) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length > 2) return `${d.slice(0, 2)}.${d.slice(2)}`;
  return d;
}

function maskDocumento(v) {
  return fTipoDoc.value === 'CNPJ' ? maskCNPJ(v) : maskCPF(v);
}

function maskCEP(v) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function clearInvalid() {
  contractForm.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));
}

function applyFilters() {
  let result = state.contracts;

  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter(c =>
      c.contratante.toLowerCase().includes(q) ||
      c.documento.toLowerCase().includes(q) ||
      c.modelo.toLowerCase().includes(q)
    );
  }

  if (state.statusFilter) {
    result = result.filter(c => c.status === state.statusFilter);
  }

  if (state.sortField) {
    result = [...result].sort((a, b) => {
      const va = a[state.sortField].toLowerCase();
      const vb = b[state.sortField].toLowerCase();
      if (va < vb) return state.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return state.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
}

function parsePreview(text) {
  const lines = text.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${renderInline(trimmed.slice(2))}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (trimmed === '') continue;
      html += `<p>${renderInline(trimmed)}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}

function renderInline(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function interpolate(template, contract) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => contract[key] ?? '');
}

function corpoContrato(contract) {
  return contract.conteudo?.trim()
    ? contract.conteudo
    : interpolate(TEMPLATES[contract.modelo] ?? '', contract);
}

function openDetails(contract) {
  detailsBody.innerHTML = `
    <div class="details-head">
      <div>
        <p class="details-name">${escapeHtml(contract.contratante)}</p>
        <p class="details-sub">${escapeHtml(contract.modelo)}</p>
      </div>
      <span class="badge ${STATUS_BADGE[contract.status]}">${STATUS_LABELS[contract.status]}</span>
    </div>
    <div class="details-grid">
      <div class="detail-item"><span class="detail-label">Documento</span><span class="detail-value">${escapeHtml(contract.documento)}</span></div>
      <div class="detail-item"><span class="detail-label">E-mail</span><span class="detail-value">${escapeHtml(contract.email)}</span></div>
      <div class="detail-item detail-item-full"><span class="detail-label">Endereço</span><span class="detail-value">${escapeHtml(formatAddress(contract))}</span></div>
      <div class="detail-item"><span class="detail-label">CEP</span><span class="detail-value">${escapeHtml(contract.cep)}</span></div>
      <div class="detail-item"><span class="detail-label">Data de criação</span><span class="detail-value">${formatDate(contract.createdAt)}</span></div>
    </div>
  `;
  dialogDetails.showModal();
}

function openPreview(contract) {
  previewBody.innerHTML = parsePreview(escapeHtml(corpoContrato(contract)));
  dialogPreview.showModal();
}

function openForm() {
  state.editingId = null;
  contractForm.reset();
  clearInvalid();
  formGroupStatus.classList.add('hidden');
  fStatus.disabled = true;
  formTitle.textContent = 'Novo contrato';
  btnSubmit.textContent = 'Salvar contrato';
  formError.classList.add('hidden');
  formError.textContent = '';
  dialogForm.showModal();
}

function openEditForm(contract) {
  state.editingId = contract.id;
  contractForm.reset();
  clearInvalid();
  contractForm.modelo.value = contract.modelo;
  contractForm.contratante.value = contract.contratante;
  contractForm.tipoDocumento.value = contract.tipoDocumento;
  contractForm.documento.value = contract.documento;
  contractForm.email.value = contract.email;
  contractForm.cep.value = contract.cep;
  contractForm.endereco.value = contract.endereco;
  contractForm.numero.value = contract.numero;
  contractForm.bairro.value = contract.bairro;
  contractForm.cidade.value = contract.cidade;
  contractForm.uf.value = contract.uf;
  fConteudo.value = corpoContrato(contract);
  formGroupStatus.classList.remove('hidden');
  fStatus.disabled = false;
  fStatus.value = contract.status;
  formTitle.textContent = 'Editar contrato';
  btnSubmit.textContent = 'Salvar alterações';
  formError.classList.add('hidden');
  formError.textContent = '';
  dialogForm.showModal();
}

function closeForm() {
  dialogForm.close();
}

function showFormError(msg) {
  formError.textContent = msg;
  formError.classList.remove('hidden');
}

async function submitForm(e) {
  e.preventDefault();
  clearInvalid();

  const requiredFields = contractForm.querySelectorAll('[required]');
  let valid = true;
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    }
  });
  if (!valid) { showFormError('Preencha todos os campos obrigatórios.'); return; }

  if (!EMAIL_RE.test(contractForm.email.value.trim())) {
    contractForm.email.classList.add('invalid');
    showFormError('Informe um e-mail válido.');
    return;
  }

  const tipo = contractForm.tipoDocumento.value;
  const expectedDigits = tipo === 'CNPJ' ? 14 : 11;
  if (onlyDigits(contractForm.documento.value).length !== expectedDigits) {
    contractForm.documento.classList.add('invalid');
    showFormError(`Documento inválido para ${tipo}.`);
    return;
  }

  const data = Object.fromEntries(new FormData(contractForm));

  const isEditing = !!state.editingId;
  state.saving = true;
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Salvando...';
  formError.classList.add('hidden');

  try {
    if (isEditing) {
      const existing = state.contracts.find(c => c.id === state.editingId);
      const updated = await updateContract(state.editingId, { ...existing, ...data });
      state.contracts = state.contracts.map(c => c.id === state.editingId ? updated : c);
    } else {
      const newContract = await createContract(data);
      state.contracts = [newContract, ...state.contracts];
      state.page = 1;
    }
    closeForm();
    render();
    toast(isEditing ? 'Contrato atualizado com sucesso.' : 'Contrato criado com sucesso.', 'success');
  } catch (err) {
    showFormError(err.message);
  } finally {
    state.saving = false;
    btnSubmit.disabled = false;
    btnSubmit.textContent = isEditing ? 'Salvar alterações' : 'Salvar contrato';
  }
}

function openConfirm(contract) {
  state.deletingId = contract.id;
  confirmMessage.textContent = `Excluir o contrato de ${contract.contratante}? Esta ação não pode ser desfeita.`;
  dialogConfirm.showModal();
}

function closeConfirm() {
  state.deletingId = null;
  dialogConfirm.close();
}

async function confirmDelete() {
  const id = state.deletingId;
  if (!id) return;
  btnConfirmDelete.disabled = true;
  btnConfirmDelete.textContent = 'Excluindo...';
  try {
    await deleteContract(id);
    state.contracts = state.contracts.filter(c => c.id !== id);
    closeConfirm();
    render();
    toast('Contrato excluído.', 'info');
  } finally {
    btnConfirmDelete.disabled = false;
    btnConfirmDelete.textContent = 'Excluir';
  }
}

function clearSortIndicators() {
  document.querySelectorAll('th.sortable').forEach(th => {
    const indicator = th.querySelector('.sort-indicator');
    if (indicator) indicator.textContent = '';
    th.classList.remove('active');
    th.setAttribute('aria-sort', 'none');
  });
}

function render() {
  if (state.error) {
    errorBanner.classList.remove('hidden');
    errorMessage.textContent = state.error;
  } else {
    errorBanner.classList.add('hidden');
  }

  tableWrapper.classList.toggle('is-loading', state.loading);
  document.getElementById('search').disabled = state.loading;
  document.getElementById('filter-status').disabled = state.loading;

  if (state.loading) {
    tableBody.innerHTML = `<tr><td colspan="6" class="state-cell">Carregando...</td></tr>`;
    paginationInfo.textContent = '';
    btnPrev.disabled = true;
    btnNext.disabled = true;
    clearSortIndicators();
    return;
  }

  const filtered = applyFilters();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));

  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * state.perPage;
  const pageItems = filtered.slice(start, start + state.perPage);

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="state-cell">Nenhum contrato encontrado.</td></tr>`;
    paginationInfo.textContent = '';
    btnPrev.disabled = true;
    btnNext.disabled = true;
    clearSortIndicators();
    return;
  }

  tableBody.innerHTML = pageItems.map(c => `
    <tr>
      <td>${escapeHtml(c.modelo)}</td>
      <td>${escapeHtml(c.contratante)}</td>
      <td>${escapeHtml(c.documento)}</td>
      <td class="address-cell">${escapeHtml(formatAddress(c))}</td>
      <td><span class="badge ${STATUS_BADGE[c.status]}">${STATUS_LABELS[c.status]}</span></td>
      <td class="actions-cell">
        <button class="icon-btn" data-action="details" data-id="${c.id}" title="Ver detalhes" aria-label="Ver detalhes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="icon-btn" data-action="preview" data-id="${c.id}" title="Ver prévia" aria-label="Ver prévia">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
        </button>
        <button class="icon-btn" data-action="edit" data-id="${c.id}" title="Editar" aria-label="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
        </button>
        <button class="icon-btn icon-btn--danger" data-action="delete" data-id="${c.id}" title="Excluir" aria-label="Excluir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  paginationInfo.textContent = `Página ${state.page} de ${totalPages}`;
  btnPrev.disabled = state.page <= 1;
  btnNext.disabled = state.page >= totalPages;

  document.querySelectorAll('th.sortable').forEach(th => {
    const indicator = th.querySelector('.sort-indicator');
    if (th.dataset.field === state.sortField) {
      indicator.textContent = state.sortDir === 'asc' ? ' ↑' : ' ↓';
      th.classList.add('active');
      th.setAttribute('aria-sort', state.sortDir === 'asc' ? 'ascending' : 'descending');
    } else {
      indicator.textContent = '';
      th.classList.remove('active');
      th.setAttribute('aria-sort', 'none');
    }
  });
}

async function init() {
  state.loading = true;
  state.error = null;
  render();

  try {
    state.contracts = await getContracts();
  } catch {
    state.error = 'Erro ao carregar contratos. Tente novamente.';
  } finally {
    state.loading = false;
    render();
  }
}

await init();
markActive('contratos');

document.getElementById('search').addEventListener('input', e => {
  state.search = e.target.value;
  state.page = 1;
  render();
});

document.getElementById('filter-status').addEventListener('change', e => {
  state.statusFilter = e.target.value;
  state.page = 1;
  render();
});

document.querySelectorAll('th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const field = th.dataset.field;
    if (state.sortField === field) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortField = field;
      state.sortDir = 'asc';
    }
    state.page = 1;
    render();
  });
});

btnPrev.addEventListener('click', () => {
  if (state.page > 1) { state.page--; render(); }
});

btnNext.addEventListener('click', () => {
  const totalPages = Math.ceil(applyFilters().length / state.perPage);
  if (state.page < totalPages) { state.page++; render(); }
});

document.getElementById('btn-retry').addEventListener('click', () => {
  init();
});

tableBody.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const contract = state.contracts.find(c => c.id === btn.dataset.id);
  if (!contract) return;

  if (btn.dataset.action === 'details') openDetails(contract);
  if (btn.dataset.action === 'preview') openPreview(contract);
  if (btn.dataset.action === 'edit') openEditForm(contract);
  if (btn.dataset.action === 'delete') openConfirm(contract);
});

document.getElementById('btn-close-details').addEventListener('click', () => dialogDetails.close());
document.getElementById('btn-close-preview').addEventListener('click', () => dialogPreview.close());

dialogDetails.addEventListener('click', e => { if (e.target === dialogDetails) dialogDetails.close(); });
dialogPreview.addEventListener('click', e => { if (e.target === dialogPreview) dialogPreview.close(); });

document.getElementById('btn-new').addEventListener('click', openForm);
document.getElementById('btn-cancel-form').addEventListener('click', closeForm);
document.getElementById('btn-close-form').addEventListener('click', closeForm);
dialogForm.addEventListener('click', e => { if (e.target === dialogForm) closeForm(); });
contractForm.addEventListener('submit', submitForm);

fDocumento.addEventListener('input', () => { fDocumento.value = maskDocumento(fDocumento.value); });
fTipoDoc.addEventListener('change', () => { fDocumento.value = maskDocumento(fDocumento.value); });
fCep.addEventListener('input', () => { fCep.value = maskCEP(fCep.value); });

btnConfirmDelete.addEventListener('click', confirmDelete);
document.getElementById('btn-cancel-delete').addEventListener('click', closeConfirm);
document.getElementById('btn-close-confirm').addEventListener('click', closeConfirm);
dialogConfirm.addEventListener('click', e => { if (e.target === dialogConfirm) closeConfirm(); });
