import { login } from '../admin/users.requests.js';
import { setSession, getSession } from '../shared/auth.js';

const form = document.getElementById('login-form');
const btnSubmit = document.getElementById('btn-submit');
const errorBanner = document.getElementById('error-banner');
const errorMessage = document.getElementById('error-message');

if (getSession()) {
  location.href = '/pages/dashboard/index.html';
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorBanner.classList.remove('hidden');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  errorBanner.classList.add('hidden');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Entrando...';

  const email = form.email.value.trim();
  const senha = form.senha.value;

  try {
    const user = await login(email, senha);
    setSession(user);
    location.href = '/pages/dashboard/index.html';
  } catch (err) {
    showError(err.message);
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Entrar';
  }
});
