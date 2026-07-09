import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from './templates.requests.js';
import { markActive } from '../shared/router.js';
import { toast } from '../shared/toast.js';
import { escapeHtml, formatDate, truncate } from '../shared/format.js';
import { requireAuth, mountUserMenu } from '../shared/auth.js';

const state = { templates: [], editingId: null, deletingId: null };
const session = requireAuth();

function render() {
  const tbody = document.getElementById('table-body');
  if (state.templates.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Nenhum template cadastrado.</td></tr>`;
    return;
  }
  tbody.innerHTML = state.templates.map(t => `
    <tr>
      <td>${escapeHtml(t.nome)}</td>
      <td class="template-preview text-muted">${escapeHtml(truncate(t.conteudo))}</td>
      <td class="text-muted">${formatDate(t.createdAt)}</td>
      <td>
        <div class="actions-cell">
          <button class="icon-btn" data-action="edit" data-id="${t.id}" title="Editar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn--danger" data-action="delete" data-id="${t.id}" title="Excluir">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openForm(template = null) {
  state.editingId = template ? template.id : null;
  document.getElementById('form-title').textContent = template ? 'Editar template' : 'Novo template';
  document.getElementById('btn-submit').textContent = template ? 'Salvar alterações' : 'Salvar';
  document.getElementById('f-nome').value = template ? template.nome : '';
  document.getElementById('f-conteudo').value = template ? template.conteudo : '';
  document.getElementById('form-error').textContent = '';
  document.getElementById('form-error').classList.add('hidden');
  document.getElementById('f-nome').classList.remove('invalid');
  document.getElementById('f-conteudo').classList.remove('invalid');
  document.getElementById('dialog-form').showModal();
}

function closeForm() {
  document.getElementById('dialog-form').close();
  document.getElementById('template-form').reset();
}

async function submitForm(e) {
  e.preventDefault();
  const nome = document.getElementById('f-nome').value.trim();
  const conteudo = document.getElementById('f-conteudo').value.trim();
  let valid = true;
  if (!nome) { document.getElementById('f-nome').classList.add('invalid'); valid = false; }
  if (!conteudo) { document.getElementById('f-conteudo').classList.add('invalid'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  const isEditing = !!state.editingId;
  try {
    if (isEditing) {
      const updated = await updateTemplate(state.editingId, { nome, conteudo });
      const idx = state.templates.findIndex(t => t.id === state.editingId);
      if (idx !== -1) state.templates[idx] = { ...state.templates[idx], ...updated };
    } else {
      const created = await createTemplate({ nome, conteudo });
      state.templates.push(created);
    }
    closeForm();
    render();
    toast(isEditing ? 'Template atualizado com sucesso.' : 'Template criado com sucesso.', 'success');
  } catch (err) {
    const errEl = document.getElementById('form-error');
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = isEditing ? 'Salvar alterações' : 'Salvar';
  }
}

function openConfirm(id) {
  state.deletingId = id;
  const t = state.templates.find(t => t.id === id);
  document.getElementById('confirm-message').textContent =
    `Tem certeza que deseja excluir o template "${t?.nome}"? Esta ação não pode ser desfeita.`;
  document.getElementById('dialog-confirm').showModal();
}

function closeConfirm() {
  document.getElementById('dialog-confirm').close();
  state.deletingId = null;
}

async function confirmDelete() {
  if (!state.deletingId) return;
  await deleteTemplate(state.deletingId);
  state.templates = state.templates.filter(t => t.id !== state.deletingId);
  closeConfirm();
  render();
  toast('Template excluído.', 'info');
}

async function init() {
  markActive('templates');

  document.getElementById('btn-new').addEventListener('click', () => openForm());
  document.getElementById('btn-close-form').addEventListener('click', closeForm);
  document.getElementById('btn-cancel-form').addEventListener('click', closeForm);
  document.getElementById('template-form').addEventListener('submit', submitForm);
  document.getElementById('btn-close-confirm').addEventListener('click', closeConfirm);
  document.getElementById('btn-cancel-delete').addEventListener('click', closeConfirm);
  document.getElementById('btn-confirm-delete').addEventListener('click', confirmDelete);

  document.getElementById('table-body').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'edit') openForm(state.templates.find(t => t.id === id));
    if (btn.dataset.action === 'delete') openConfirm(id);
  });

  try {
    state.templates = await getTemplates();
  } catch {
    state.templates = [];
  }
  render();
}

if (session) {
  mountUserMenu(session);
  init();
}
