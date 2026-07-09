const MOCK_USERS = [
  { id: '1', nome: 'Admin Geral',    email: 'admin@simplect.com',   senha: 'admin123',  papel: 'admin', createdAt: '2024-01-10T09:00:00Z' },
  { id: '2', nome: 'Usuário Padrão', email: 'usuario@simplect.com', senha: 'user123',   papel: 'user',  createdAt: '2024-02-05T10:00:00Z' },
  { id: '3', nome: 'Camila Duarte',  email: 'camila@simplect.com',  senha: 'camila123', papel: 'user',  createdAt: '2024-03-12T11:00:00Z' },
];

let failNextLoad = new URLSearchParams(location.search).has('simulateError');

export function login(email, senha) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );
      if (!found) {
        reject(new Error('E-mail ou senha inválidos.'));
        return;
      }
      const { senha: _senha, ...publicUser } = found;
      resolve(publicUser);
    }, 400);
  });
}

export function getUsers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failNextLoad) {
        failNextLoad = false;
        reject(new Error('Erro ao carregar usuários.'));
        return;
      }
      resolve(MOCK_USERS.map(({ senha, ...u }) => ({ ...u })));
    }, 300);
  });
}

export function createUser(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === 'erro@simplect.com') {
        reject(new Error('Não foi possível salvar o usuário. Tente novamente.'));
        return;
      }
      const newUser = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
      };
      resolve(newUser);
    }, 500);
  });
}

export function updateUser(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...data, id }), 500);
  });
}

export function deleteUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(id), 400);
  });
}
