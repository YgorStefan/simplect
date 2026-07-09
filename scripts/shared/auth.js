import { escapeHtml } from './format.js';

const SESSION_KEY = 'simplect:session';
const LOGIN_PATH = '/pages/login/index.html';

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function requireAuth() {
  const session = getSession();
  if (!session) {
    location.href = LOGIN_PATH;
    return null;
  }
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  location.href = LOGIN_PATH;
}

export function mountUserMenu(session) {
  const el = document.getElementById('nav-user');
  if (!el) return;
  el.innerHTML = `
    <span class="app-nav__user-name">${escapeHtml(session.nome)}</span>
    <button type="button" class="app-nav__logout" id="btn-logout">Sair</button>
  `;
  document.getElementById('btn-logout').addEventListener('click', logout);
}
