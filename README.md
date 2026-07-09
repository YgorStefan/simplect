# Tela de Contratos

Tela administrativa de contratos feita só com HTML, CSS e JavaScript puro (módulos ES). Sem framework, sem build, sem dependência nenhuma.

## Como rodar

Precisa de um servidor local. Não adianta dar duplo clique no `list.html` - os módulos ES são bloqueados quando aberto como arquivo (`file://`).

Escolhe uma opção:

```bash
# Python
python -m http.server 8000
```

```bash
# ou Node
npx serve
```

Depois abre no navegador:

```
http://localhost:8000/pages/contracts/list.html
```

(se usar `npx serve`, a porta costuma ser 3000)

## O que dá pra fazer

- Listar, buscar (por contratante, documento ou modelo), filtrar por status, ordenar e paginar
- Ver detalhes e prévia do contrato
- Criar, editar e excluir contratos
- Editar o conteúdo do contrato, que aceita negrito , listas (linhas com `-`) e parágrafos

Os dados são 4 contratos de exemplo, fixos e em memória - não tem backend nem banco. Recarregar a página volta tudo ao estado inicial.

Dica: adicione `?simulateError` na URL pra ver o estado de erro com o botão de tentar de novo.

## Login e admin

O acesso ao sistema é protegido por um login mockado (sessão salva em `localStorage`, sem backend real). Credenciais de demonstração, disponíveis também na própria tela de login:

- **Admin:** `admin@simplect.com` / `admin123`
- **Usuário comum:** `usuario@simplect.com` / `user123`

Qualquer usuário autenticado vê o sistema inteiro, incluindo o painel **Admin** (`/pages/admin/index.html`), que reúne:

- **Usuários** — CRUD mockado (listar, criar, editar, excluir)
- **Atividades** — histórico mockado, somente leitura
- **Configurações** — formulário de exemplo, sem persistência (recarregar volta ao estado inicial, igual ao resto do sistema)

## Estrutura

```
pages/contracts/list.html                 a tela
scripts/contracts/list.js                 lógica e interação
scripts/contracts/contracts.requests.js   dados e operações (mock)
style/contracts.css                        estilos
```

## Testes

Suíte E2E (Playwright) e testes unitários (`node:test`, nativo do Node — sem dependência extra).

```bash
# Testes unitários (funções puras de formatação/máscara)
node --test teste/unit/format.test.mjs

# Testes E2E (dashboard, contratos, templates, login, admin)
cd teste
npm install
npx playwright test
```

Não há testes de carga/performance: o projeto é 100% front-end estático, sem backend/servidor para testar sob carga.
