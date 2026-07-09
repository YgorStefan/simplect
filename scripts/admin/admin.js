import { getUsers, createUser, updateUser, deleteUser } from './users.requests.js';
import { getActivities } from './activities.requests.js';
import { escapeHtml, formatDate } from '../shared/format.js';
import { requireAuth, mountUserMenu } from '../shared/auth.js';
import { markActive } from '../shared/router.js';
import { toast } from '../shared/toast.js';

const PAPEL_LABELS = { admin: 'Admin', user: 'Usuário' };

const state = { users: [], editingId: null, deletingId: null };

const usersBody = document.getElementById('users-body');
const activitiesBody = document.getElementById('activities-body');
const dialogForm = document.getElementById('dialog-form');
const dialogConfirm = document.getElementById('dialog-confirm');
const userForm = document.getElementById('user-form');
const formTitle = document.getElementById('form-title');
const formError = document.getElementById('form-error');
const btnSubmit = document.getElementById('btn-submit');
const confirmMessage = document.getElementById('confirm-message');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

function renderUsers() {
  if (state.users.length === 0) {
    usersBody.innerHTML = `<tr><td colspan="5" class="table-empty">Nenhum usuário cadastrado.</td></tr>`;
    return;
  }
  usersBody.innerHTML = state.users.map(u => `
    <tr>
      <td>${escapeHtml(u.nome)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(PAPEL_LABELS[u.papel] ?? u.papel)}</td>
      <td class="text-muted">${formatDate(u.createdAt)}</td>
      <td>
        <div class="actions-cell">
          <button class="icon-btn" data-action="edit" data-id="${u.id}" title="Editar" aria-label="Editar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn--danger" data-action="delete" data-id="${u.id}" title="Excluir" aria-label="Excluir">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderActivities(activities) {
  if (activities.length === 0) {
    activitiesBody.innerHTML = `<tr><td colspan="4" class="table-empty">Nenhuma atividade registrada.</td></tr>`;
    return;
  }
  activitiesBody.innerHTML = activities.map(a => `
    <tr>
      <td>${escapeHtml(a.usuario)}</td>
      <td>${escapeHtml(a.acao)}</td>
      <td>${escapeHtml(a.alvo)}</td>
      <td class="text-muted">${formatDate(a.data)}</td>
    </tr>
  `).join('');
}

function openForm(user = null) {
  state.editingId = user ? user.id : null;
  formTitle.textContent = user ? 'Editar usuário' : 'Novo usuário';
  btnSubmit.textContent = user ? 'Salvar alterações' : 'Salvar';
  userForm.reset();
  userForm.nome.value = user ? user.nome : '';
  userForm.email.value = user ? user.email : '';
  userForm.papel.value = user ? user.papel : 'user';
  formError.classList.add('hidden');
  formError.textContent = '';
  dialogForm.showModal();
}

function closeForm() {
  dialogForm.close();
}

async function submitForm(e) {
  e.preventDefault();
  const nome = userForm.nome.value.trim();
  const email = userForm.email.value.trim();
  const papel = userForm.papel.value;
  if (!nome || !email) {
    formError.textContent = 'Preencha todos os campos obrigatórios.';
    formError.classList.remove('hidden');
    return;
  }

  const isEditing = !!state.editingId;
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Salvando...';

  try {
    if (isEditing) {
      const updated = await updateUser(state.editingId, { nome, email, papel });
      state.users = state.users.map(u => u.id === state.editingId ? { ...u, ...updated } : u);
    } else {
      const created = await createUser({ nome, email, papel });
      state.users = [created, ...state.users];
    }
    closeForm();
    renderUsers();
    toast(isEditing ? 'Usuário atualizado com sucesso.' : 'Usuário criado com sucesso.', 'success');
  } catch (err) {
    formError.textContent = err.message;
    formError.classList.remove('hidden');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = isEditing ? 'Salvar alterações' : 'Salvar';
  }
}

function openConfirm(user) {
  state.deletingId = user.id;
  confirmMessage.textContent = `Excluir o usuário ${user.nome}? Esta ação não pode ser desfeita.`;
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
    await deleteUser(id);
    state.users = state.users.filter(u => u.id !== id);
    closeConfirm();
    renderUsers();
    toast('Usuário excluído.', 'info');
  } finally {
    btnConfirmDelete.disabled = false;
    btnConfirmDelete.textContent = 'Excluir';
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelector(`.admin-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });
}

function initSettingsForm() {
  document.getElementById('settings-form').addEventListener('submit', e => {
    e.preventDefault();
    toast('Configurações salvas (simulado — não persiste).', 'success');
  });
}

async function init() {
  initTabs();
  initSettingsForm();

  document.getElementById('btn-new-user').addEventListener('click', () => openForm());
  document.getElementById('btn-close-form').addEventListener('click', closeForm);
  document.getElementById('btn-cancel-form').addEventListener('click', closeForm);
  userForm.addEventListener('submit', submitForm);
  document.getElementById('btn-close-confirm').addEventListener('click', closeConfirm);
  document.getElementById('btn-cancel-delete').addEventListener('click', closeConfirm);
  btnConfirmDelete.addEventListener('click', confirmDelete);

  usersBody.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const user = state.users.find(u => u.id === btn.dataset.id);
    if (!user) return;
    if (btn.dataset.action === 'edit') openForm(user);
    if (btn.dataset.action === 'delete') openConfirm(user);
  });

  try {
    state.users = await getUsers();
  } catch {
    state.users = [];
  }
  renderUsers();

  const activities = await getActivities();
  renderActivities(activities);
}

const session = requireAuth();
if (session) {
  mountUserMenu(session);
  markActive('admin');
  init();
}
