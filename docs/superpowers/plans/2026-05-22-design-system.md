# Design System + Layout — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a base visual do app — CSS variables, componentes reutilizáveis, navegação top nav, roteamento hash-based e sistema de toasts — que todas as telas seguintes consumirão.

**Architecture:** Dois arquivos CSS compartilhados (`base.css` com variáveis e nav, `components.css` com todos os componentes), dois módulos JS (`router.js` e `toast.js`), e uma página de demonstração para verificação visual. Cada página HTML importa os dois CSS e os módulos que precisar.

**Tech Stack:** HTML5, CSS3 (custom properties, `@keyframes`, `<dialog>`), ES Modules (sem bundler). Servidor local para paths absolutos: `npx serve .` na raiz do projeto.

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `style/base.css` | Criar | Variáveis, reset, tipografia, nav top |
| `style/components.css` | Criar | Botões, badges, tabela, modal, toasts, forms, paginação |
| `scripts/shared/router.js` | Criar | Marca link ativo na nav |
| `scripts/shared/toast.js` | Criar | Exibe e remove notificações toast |
| `pages/demo.html` | Criar | Página de demonstração visual de todos os componentes |

---

## Task 1: Estrutura de diretórios e `style/base.css`

**Files:**
- Create: `style/base.css`
- Create: `pages/demo.html` (shell vazio, expandido nas tasks seguintes)

- [ ] **Passo 1: Criar os diretórios**

```bash
mkdir -p style scripts/shared pages/contracts pages/dashboard pages/templates
```

- [ ] **Passo 2: Criar `style/base.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --color-nav-bg:     #0f172a;
  --color-nav-text:   #f8fafc;
  --color-nav-active: #3b82f6;

  --color-bg:         #f8fafc;
  --color-surface:    #ffffff;
  --color-border:     #e2e8f0;

  --color-text:       #0f172a;
  --color-text-muted: #64748b;

  --color-primary:       #3b82f6;
  --color-primary-hover: #2563eb;

  --color-danger:  #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;

  --badge-nao-enviado-bg:    #f1f5f9;
  --badge-nao-enviado-text:  #475569;
  --badge-aguardando-bg:     #fef9c3;
  --badge-aguardando-text:   #92400e;
  --badge-assinado-bg:       #dcfce7;
  --badge-assinado-text:     #166534;
  --badge-cancelado-bg:      #fee2e2;
  --badge-cancelado-text:    #991b1b;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --font:      'Inter', system-ui, sans-serif;
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 14px;
  --text-lg:   16px;
  --text-xl:   20px;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, .08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, .12);
}

body {
  margin: 0;
  font-family: var(--font);
  font-size: var(--text-base);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
}

/* ---- Top Nav ---- */

.app-nav {
  background: var(--color-nav-bg);
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  gap: var(--space-8);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-nav__brand {
  color: var(--color-nav-text);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -.02em;
}

.app-nav__links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-1);
  height: 100%;
}

.app-nav__links a {
  display: flex;
  align-items: center;
  padding: 0 var(--space-3);
  color: var(--color-nav-text);
  text-decoration: none;
  font-size: var(--text-sm);
  opacity: .7;
  border-bottom: 2px solid transparent;
  transition: opacity .15s, border-color .15s;
}

.app-nav__links a:hover {
  opacity: 1;
}

.app-nav__links a.active {
  opacity: 1;
  color: var(--color-nav-active);
  border-bottom-color: var(--color-nav-active);
}

/* ---- Main layout ---- */

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin: 0;
}
```

- [ ] **Passo 3: Criar `pages/demo.html` (shell inicial)**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo — Design System</title>
  <link rel="stylesheet" href="../style/base.css">
  <link rel="stylesheet" href="../style/components.css">
</head>
<body>

<nav class="app-nav">
  <div class="app-nav__brand">upmobb</div>
  <ul class="app-nav__links">
    <li><a href="/pages/dashboard/index.html" data-page="dashboard">Dashboard</a></li>
    <li><a href="/pages/contracts/list.html"  data-page="contratos">Contratos</a></li>
    <li><a href="/pages/templates/index.html" data-page="templates">Templates</a></li>
    <li><a href="/pages/demo.html"            data-page="demo" class="active">Demo</a></li>
  </ul>
</nav>

<main class="app-main">
  <div class="page-header">
    <h1 class="page-title">Design System — Componentes</h1>
  </div>

  <!-- componentes adicionados nas tasks seguintes -->

</main>

<script type="module" src="../scripts/shared/toast.js"></script>
</body>
</html>
```

- [ ] **Passo 4: Iniciar servidor local e verificar a nav**

```bash
npx serve . --listen 3000
```

Abrir `http://localhost:3000/pages/demo.html`. Verificar:
- Nav escura (`#0f172a`) com link "Demo" ativo em azul
- Fundo de página em cinza claro (`#f8fafc`)
- Fonte Inter carregada (letras bem definidas, não system-ui)

- [ ] **Passo 5: Commit**

```bash
git add style/base.css pages/demo.html
git commit -m "adiciona base.css com variáveis, nav e layout"
```

---

## Task 2: Botões e badges em `style/components.css`

**Files:**
- Create: `style/components.css`
- Modify: `pages/demo.html` (adiciona seção de botões e badges)

- [ ] **Passo 1: Criar `style/components.css` com botões e badges**

```css
/* ===========================
   BOTÕES
   =========================== */

.btn-primary,
.btn-secondary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background .15s, border-color .15s, opacity .15s;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-danger:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg);
}

.btn-danger {
  background: var(--color-danger);
  color: #fff;
  border-color: var(--color-danger);
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
}

/* ===========================
   BADGES DE STATUS
   =========================== */

.badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
}

.badge--nao-enviado {
  background: var(--badge-nao-enviado-bg);
  color: var(--badge-nao-enviado-text);
}

.badge--aguardando {
  background: var(--badge-aguardando-bg);
  color: var(--badge-aguardando-text);
}

.badge--assinado {
  background: var(--badge-assinado-bg);
  color: var(--badge-assinado-text);
}

.badge--cancelado {
  background: var(--badge-cancelado-bg);
  color: var(--badge-cancelado-text);
}
```

- [ ] **Passo 2: Adicionar seção de botões e badges no `pages/demo.html`**

Substituir o comentário `<!-- componentes adicionados nas tasks seguintes -->` por:

```html
  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Botões</h2>
    <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center;">
      <button class="btn-primary">Novo contrato</button>
      <button class="btn-secondary">Cancelar</button>
      <button class="btn-danger">Excluir</button>
      <button class="btn-primary" disabled>Salvando...</button>
    </div>
  </section>

  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Badges de status</h2>
    <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center;">
      <span class="badge badge--nao-enviado">Não enviado</span>
      <span class="badge badge--aguardando">Aguardando assinatura</span>
      <span class="badge badge--assinado">Assinado</span>
      <span class="badge badge--cancelado">Cancelado</span>
    </div>
  </section>

  <!-- próximos componentes -->
```

- [ ] **Passo 3: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Verificar:
- Botão primário azul, hover mais escuro
- Botão secundário com borda, hover cinza claro
- Botão danger vermelho
- Botão primário disabled com opacidade reduzida e cursor `not-allowed`
- Badges com cores corretas por status

- [ ] **Passo 4: Commit**

```bash
git add style/components.css pages/demo.html
git commit -m "adiciona botões e badges ao design system"
```

---

## Task 3: Componente de tabela

**Files:**
- Modify: `style/components.css` (append tabela)
- Modify: `pages/demo.html` (adiciona seção de tabela)

- [ ] **Passo 1: Adicionar estilos de tabela ao final de `style/components.css`**

```css
/* ===========================
   TABELA
   =========================== */

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table thead th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: .05em;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  white-space: nowrap;
}

.table thead th.sortable {
  cursor: pointer;
  user-select: none;
}

.table thead th.sortable:hover {
  color: var(--color-text);
}

.table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background .1s;
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.table tbody tr:hover {
  background: #eff6ff;
}

.table tbody td {
  padding: var(--space-3) var(--space-4);
  color: var(--color-text);
}

.table tbody td.text-muted {
  color: var(--color-text-muted);
}

.table-empty {
  text-align: center;
  padding: var(--space-8) var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
```

- [ ] **Passo 2: Adicionar seção de tabela no `pages/demo.html`**

Substituir o comentário `<!-- próximos componentes -->` por:

```html
  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Tabela</h2>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="sortable">Modelo ↑</th>
            <th class="sortable">Contratante</th>
            <th>Documento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Prestação de Serviços</td>
            <td>Maria Silva</td>
            <td class="text-muted">123.456.789-00</td>
            <td><span class="badge badge--assinado">Assinado</span></td>
            <td><button class="btn-secondary" style="padding: 4px 10px; font-size: 12px;">Ver detalhes</button></td>
          </tr>
          <tr>
            <td>Locação</td>
            <td>João Pereira</td>
            <td class="text-muted">98.765.432/0001-10</td>
            <td><span class="badge badge--aguardando">Aguardando assinatura</span></td>
            <td><button class="btn-secondary" style="padding: 4px 10px; font-size: 12px;">Ver detalhes</button></td>
          </tr>
          <tr>
            <td>Confidencialidade</td>
            <td>Tech Corp LTDA</td>
            <td class="text-muted">11.222.333/0001-44</td>
            <td><span class="badge badge--cancelado">Cancelado</span></td>
            <td><button class="btn-secondary" style="padding: 4px 10px; font-size: 12px;">Ver detalhes</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- próximos componentes -->
```

- [ ] **Passo 3: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Verificar:
- Tabela com borda arredondada e sombra leve
- Header em cinza com letras maiúsculas
- Linhas zebradas (pares com fundo levemente diferente)
- Hover em azul claro (`#eff6ff`)
- Badges corretos na coluna Status

- [ ] **Passo 4: Commit**

```bash
git add style/components.css pages/demo.html
git commit -m "adiciona componente de tabela ao design system"
```

---

## Task 4: Componente de formulário

**Files:**
- Modify: `style/components.css` (append forms)
- Modify: `pages/demo.html` (adiciona seção de formulário)

- [ ] **Passo 1: Adicionar estilos de formulário ao final de `style/components.css`**

```css
/* ===========================
   FORMULÁRIOS
   =========================== */

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.form-label .required {
  color: var(--color-danger);
  margin-left: 2px;
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font);
  font-size: var(--text-base);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
}

.form-input--error,
.form-select--error {
  border-color: var(--color-danger);
}

.form-input--error:focus,
.form-select--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, .15);
}

.form-input:disabled,
.form-select:disabled {
  opacity: .5;
  cursor: not-allowed;
  background: var(--color-bg);
}

.form-error {
  font-size: var(--text-xs);
  color: var(--color-danger);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Passo 2: Adicionar seção de formulário no `pages/demo.html`**

Substituir o comentário `<!-- próximos componentes -->` por:

```html
  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Formulário</h2>
    <div style="background: var(--color-surface); padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--color-border); max-width: 560px;">
      <div class="form-grid" style="margin-bottom: var(--space-4)">
        <div class="form-group">
          <label class="form-label">Nome <span class="required">*</span></label>
          <input class="form-input" type="text" placeholder="Ex: Maria Silva">
        </div>
        <div class="form-group">
          <label class="form-label">E-mail <span class="required">*</span></label>
          <input class="form-input form-input--error" type="email" placeholder="email@exemplo.com" value="inválido">
          <span class="form-error">E-mail inválido</span>
        </div>
      </div>
      <div class="form-group" style="margin-bottom: var(--space-4)">
        <label class="form-label">Status</label>
        <select class="form-select">
          <option>Não enviado</option>
          <option>Aguardando assinatura</option>
          <option>Assinado</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom: var(--space-4)">
        <label class="form-label">Campo desabilitado</label>
        <input class="form-input" type="text" value="Não editável" disabled>
      </div>
      <div style="display: flex; gap: var(--space-2); justify-content: flex-end">
        <button class="btn-secondary">Cancelar</button>
        <button class="btn-primary">Salvar</button>
      </div>
    </div>
  </section>

  <!-- próximos componentes -->
```

- [ ] **Passo 3: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Verificar:
- Input normal: borda cinza, foco com borda azul + halo
- Input com erro: borda vermelha + mensagem de erro abaixo
- Input desabilitado: opacidade reduzida, cursor bloqueado
- Select com estilo consistente
- Grid de 2 colunas colapsando para 1 em tela pequena

- [ ] **Passo 4: Commit**

```bash
git add style/components.css pages/demo.html
git commit -m "adiciona componente de formulário ao design system"
```

---

## Task 5: Componente modal (`<dialog>`)

**Files:**
- Modify: `style/components.css` (append modal)
- Modify: `pages/demo.html` (adiciona seção de modal + botão para abrir)

- [ ] **Passo 1: Adicionar estilos de modal ao final de `style/components.css`**

```css
/* ===========================
   MODAL (<dialog>)
   =========================== */

.modal {
  width: 90%;
  max-width: 560px;
  padding: 0;
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.modal::backdrop {
  background: rgba(0, 0, 0, .4);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.modal__close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0;
  line-height: 1;
}

.modal__close:hover {
  color: var(--color-text);
}

.modal__body {
  padding: var(--space-6);
  max-height: 60vh;
  overflow-y: auto;
}

.modal__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
```

- [ ] **Passo 2: Adicionar seção de modal no `pages/demo.html`**

Substituir o comentário `<!-- próximos componentes -->` por:

```html
  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Modal</h2>
    <button class="btn-primary" onclick="document.getElementById('demo-modal').showModal()">Abrir modal</button>
  </section>

  <dialog class="modal" id="demo-modal">
    <div class="modal__header">
      Detalhes do contrato
      <button class="modal__close" onclick="document.getElementById('demo-modal').close()">×</button>
    </div>
    <div class="modal__body">
      <p style="color: var(--color-text-muted); font-size: var(--text-sm)">Conteúdo do modal aqui. Pode conter formulários, texto, tabelas ou qualquer outro componente.</p>
    </div>
    <div class="modal__footer">
      <button class="btn-secondary" onclick="document.getElementById('demo-modal').close()">Fechar</button>
      <button class="btn-primary">Confirmar</button>
    </div>
  </dialog>

  <!-- próximos componentes -->
```

- [ ] **Passo 3: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Clicar em "Abrir modal". Verificar:
- Modal centralizado com bordas arredondadas e sombra
- Backdrop semi-transparente escurecendo o fundo
- Botão × fecha o modal
- Botão "Fechar" no rodapé também fecha

- [ ] **Passo 4: Commit**

```bash
git add style/components.css pages/demo.html
git commit -m "adiciona componente modal ao design system"
```

---

## Task 6: Paginação

**Files:**
- Modify: `style/components.css` (append paginação)
- Modify: `pages/demo.html` (adiciona seção de paginação)

- [ ] **Passo 1: Adicionar estilos de paginação ao final de `style/components.css`**

```css
/* ===========================
   PAGINAÇÃO
   =========================== */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.pagination__info {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  min-width: 100px;
  text-align: center;
}
```

- [ ] **Passo 2: Adicionar seção de paginação no `pages/demo.html`**

Substituir o comentário `<!-- próximos componentes -->` por:

```html
  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Paginação</h2>
    <nav class="pagination">
      <button class="btn-secondary" disabled>Anterior</button>
      <span class="pagination__info">Página 1 de 3</span>
      <button class="btn-secondary">Próximo</button>
    </nav>
  </section>

  <!-- próximos componentes -->
```

- [ ] **Passo 3: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Verificar:
- Botões Anterior/Próximo alinhados com o indicador de página
- Botão Anterior desabilitado com opacidade reduzida

- [ ] **Passo 4: Commit**

```bash
git add style/components.css pages/demo.html
git commit -m "adiciona componente de paginação ao design system"
```

---

## Task 7: `scripts/shared/toast.js` + estilos de toast

**Files:**
- Modify: `style/components.css` (append toasts)
- Create: `scripts/shared/toast.js`
- Modify: `pages/demo.html` (adiciona botões de teste de toast)

- [ ] **Passo 1: Adicionar estilos de toast ao final de `style/components.css`**

```css
/* ===========================
   TOASTS
   =========================== */

.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 1000;
}

.toast {
  background: var(--color-surface);
  border-left: 4px solid;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-md);
  font-size: var(--text-sm);
  min-width: 280px;
  max-width: 380px;
  animation: toast-in .2s ease forwards;
}

.toast--success { border-color: var(--color-success); }
.toast--error   { border-color: var(--color-danger);  }
.toast--info    { border-color: var(--color-primary);  }

.toast.removing {
  animation: toast-out .2s ease forwards;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}

@keyframes toast-out {
  from { opacity: 1; transform: translateY(0);   }
  to   { opacity: 0; transform: translateY(8px); }
}
```

- [ ] **Passo 2: Criar `scripts/shared/toast.js`**

```js
let container = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.className = 'toast-container'
    document.body.appendChild(container)
  }
  return container
}

export function toast(message, type = 'info') {
  const el = document.createElement('div')
  el.className = `toast toast--${type}`
  el.textContent = message
  getContainer().appendChild(el)

  setTimeout(() => {
    el.classList.add('removing')
    el.addEventListener('animationend', () => el.remove(), { once: true })
  }, 3500)
}
```

- [ ] **Passo 3: Adicionar seção de toasts no `pages/demo.html`**

Substituir o comentário `<!-- próximos componentes -->` por:

```html
  <section style="margin-bottom: var(--space-8)">
    <h2 style="font-size: var(--text-lg); margin-bottom: var(--space-4)">Toasts</h2>
    <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
      <button class="btn-primary"   id="toast-success">Toast sucesso</button>
      <button class="btn-secondary" id="toast-info">Toast info</button>
      <button class="btn-danger"    id="toast-error">Toast erro</button>
    </div>
  </section>
```

Substituir o `<script>` no final do body por:

```html
<script type="module">
  import { toast } from '../scripts/shared/toast.js'
  document.getElementById('toast-success').onclick = () => toast('Contrato criado com sucesso!', 'success')
  document.getElementById('toast-info').onclick    = () => toast('Processando sua solicitação...', 'info')
  document.getElementById('toast-error').onclick   = () => toast('Erro ao salvar. Tente novamente.', 'error')
</script>
```

- [ ] **Passo 4: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Clicar nos botões de toast. Verificar:
- Toast aparece no canto inferior direito com animação de entrada
- Borda esquerda colorida conforme o tipo (verde/azul/vermelho)
- Toast desaparece automaticamente após ~3.5s com animação de saída
- Múltiplos toasts empilham verticalmente

- [ ] **Passo 5: Commit**

```bash
git add style/components.css scripts/shared/toast.js pages/demo.html
git commit -m "adiciona sistema de toasts ao design system"
```

---

## Task 8: `scripts/shared/router.js`

**Files:**
- Create: `scripts/shared/router.js`

- [ ] **Passo 1: Criar `scripts/shared/router.js`**

```js
export function markActive(pageKey) {
  const link = document.querySelector(`[data-page="${pageKey}"]`)
  if (link) link.classList.add('active')
}
```

- [ ] **Passo 2: Adicionar uso no `pages/demo.html`**

No bloco `<script type="module">` existente, adicionar no início:

```js
import { markActive } from '../scripts/shared/router.js'
markActive('demo')
```

Remover o `class="active"` hardcoded do link "Demo" na nav — o router passa a gerenciar isso:

```html
<!-- antes -->
<li><a href="/pages/demo.html" data-page="demo" class="active">Demo</a></li>

<!-- depois -->
<li><a href="/pages/demo.html" data-page="demo">Demo</a></li>
```

- [ ] **Passo 3: Verificar no navegador**

Recarregar `http://localhost:3000/pages/demo.html`. Verificar:
- Link "Demo" ainda aparece destacado em azul (a classe `.active` é aplicada via JS)
- Nenhum erro no console

- [ ] **Passo 4: Commit**

```bash
git add scripts/shared/router.js pages/demo.html
git commit -m "adiciona router.js compartilhado para navegação ativa"
```

---

## Task 9: Shells HTML das páginas

**Files:**
- Create: `pages/contracts/list.html` (shell — sem lógica de contrato ainda)
- Create: `pages/dashboard/index.html` (shell)
- Create: `pages/templates/index.html` (shell)

- [ ] **Passo 1: Criar `pages/contracts/list.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contratos — upmobb</title>
  <link rel="stylesheet" href="../../style/base.css">
  <link rel="stylesheet" href="../../style/components.css">
  <link rel="stylesheet" href="../../style/contracts.css">
</head>
<body>

<nav class="app-nav">
  <div class="app-nav__brand">upmobb</div>
  <ul class="app-nav__links">
    <li><a href="/pages/dashboard/index.html" data-page="dashboard">Dashboard</a></li>
    <li><a href="/pages/contracts/list.html"  data-page="contratos">Contratos</a></li>
    <li><a href="/pages/templates/index.html" data-page="templates">Templates</a></li>
  </ul>
</nav>

<main class="app-main">
  <div class="page-header">
    <h1 class="page-title">Contratos</h1>
  </div>
  <!-- conteúdo implementado no sub-projeto 2 -->
</main>

<script type="module">
  import { markActive } from '../../scripts/shared/router.js'
  markActive('contratos')
</script>
</body>
</html>
```

- [ ] **Passo 2: Criar `pages/dashboard/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard — upmobb</title>
  <link rel="stylesheet" href="../../style/base.css">
  <link rel="stylesheet" href="../../style/components.css">
</head>
<body>

<nav class="app-nav">
  <div class="app-nav__brand">upmobb</div>
  <ul class="app-nav__links">
    <li><a href="/pages/dashboard/index.html" data-page="dashboard">Dashboard</a></li>
    <li><a href="/pages/contracts/list.html"  data-page="contratos">Contratos</a></li>
    <li><a href="/pages/templates/index.html" data-page="templates">Templates</a></li>
  </ul>
</nav>

<main class="app-main">
  <div class="page-header">
    <h1 class="page-title">Dashboard</h1>
  </div>
  <!-- conteúdo implementado no sub-projeto 3 -->
</main>

<script type="module">
  import { markActive } from '../../scripts/shared/router.js'
  markActive('dashboard')
</script>
</body>
</html>
```

- [ ] **Passo 3: Criar `pages/templates/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Templates — upmobb</title>
  <link rel="stylesheet" href="../../style/base.css">
  <link rel="stylesheet" href="../../style/components.css">
</head>
<body>

<nav class="app-nav">
  <div class="app-nav__brand">upmobb</div>
  <ul class="app-nav__links">
    <li><a href="/pages/dashboard/index.html" data-page="dashboard">Dashboard</a></li>
    <li><a href="/pages/contracts/list.html"  data-page="contratos">Contratos</a></li>
    <li><a href="/pages/templates/index.html" data-page="templates">Templates</a></li>
  </ul>
</nav>

<main class="app-main">
  <div class="page-header">
    <h1 class="page-title">Templates</h1>
  </div>
  <!-- conteúdo implementado no sub-projeto 4 -->
</main>

<script type="module">
  import { markActive } from '../../scripts/shared/router.js'
  markActive('templates')
</script>
</body>
</html>
```

- [ ] **Passo 4: Criar `style/contracts.css` (arquivo vazio — referenciado no shell)**

```css
/* Estilos específicos da tela de contratos — implementado no sub-projeto 2 */
```

- [ ] **Passo 5: Verificar navegação entre páginas**

Com o servidor rodando em `http://localhost:3000`:
- Navegar para `http://localhost:3000/pages/dashboard/index.html` — link "Dashboard" deve estar ativo (azul)
- Clicar em "Contratos" na nav — deve ir para a lista, link "Contratos" ativo
- Clicar em "Templates" — deve ir para a página de templates, link "Templates" ativo
- Clicar em volta para Dashboard — link "Dashboard" ativo novamente

- [ ] **Passo 6: Commit**

```bash
git add pages/ style/contracts.css
git commit -m "adiciona shells HTML das páginas com navegação funcional"
```

---

## Revisão de cobertura do spec

| Requisito do spec | Task que implementa |
|---|---|
| CSS variables completas em `base.css` | Task 1 |
| Reset mínimo e tipografia | Task 1 |
| Top nav com marca, links e estado ativo | Task 1 |
| `.app-main` com max-width e padding | Task 1 |
| Botões (primary, secondary, danger, disabled) | Task 2 |
| Badges de status com variantes | Task 2 |
| Tabela com zebra, hover, scroll horizontal | Task 3 |
| Formulários com estados (foco, erro, disabled) | Task 4 |
| Modal `<dialog>` com header/body/footer | Task 5 |
| Paginação | Task 6 |
| Toasts com tipos e animação | Task 7 |
| `router.js` marcando link ativo | Task 8 |
| Shells HTML das 3 páginas | Task 9 |
| `style/contracts.css` criado | Task 9 |
