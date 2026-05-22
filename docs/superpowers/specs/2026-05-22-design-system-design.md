# Design: Design System + Layout (Sub-projeto 1)

**Data:** 2026-05-22
**Escopo:** CSS variables, componentes reutilizáveis, navegação top nav, roteamento hash-based, sistema de toasts. Base para todos os sub-projetos seguintes.

---

## Estrutura de arquivos

```
style/
  base.css            ← variáveis CSS + reset mínimo + tipografia + nav
  components.css      ← botões, badges, modais, toasts, tabelas, forms, paginação

pages/
  contracts/list.html
  dashboard/index.html
  templates/index.html

scripts/
  shared/
    router.js         ← helper hash-based: marca link ativo na nav
    toast.js          ← sistema de notificações toast
```

Cada `<page>.html` importa `base.css` + `components.css` + seu CSS específico. `router.js` e `toast.js` são módulos ES importados onde necessário.

---

## `style/base.css`

### Variáveis

```css
:root {
  /* Navegação */
  --color-nav-bg:     #0f172a;
  --color-nav-text:   #f8fafc;
  --color-nav-active: #3b82f6;

  /* Superfícies */
  --color-bg:         #f8fafc;
  --color-surface:    #ffffff;
  --color-border:     #e2e8f0;

  /* Texto */
  --color-text:       #0f172a;
  --color-text-muted: #64748b;

  /* Ação primária */
  --color-primary:       #3b82f6;
  --color-primary-hover: #2563eb;

  /* Semânticas */
  --color-danger:  #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;

  /* Badges por status (bg / text) */
  --badge-nao-enviado-bg:           #f1f5f9;
  --badge-nao-enviado-text:         #475569;
  --badge-aguardando-bg:            #fef9c3;
  --badge-aguardando-text:          #92400e;
  --badge-assinado-bg:              #dcfce7;
  --badge-assinado-text:            #166534;
  --badge-cancelado-bg:             #fee2e2;
  --badge-cancelado-text:           #991b1b;

  /* Espaçamentos (escala 4px) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Tipografia */
  --font:      'Inter', system-ui, sans-serif;
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 14px;
  --text-lg:   16px;
  --text-xl:   20px;

  /* Bordas e sombras */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, .08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, .12);
}
```

### Reset e base

- `*, *::before, *::after { box-sizing: border-box }`
- `body { margin: 0; font-family: var(--font); font-size: var(--text-base); background: var(--color-bg); color: var(--color-text); }`
- Importa Inter via `@import` do Google Fonts (único recurso externo permitido — apenas fonte).

### Layout top nav

```html
<nav class="app-nav">
  <div class="app-nav__brand">upmobb</div>
  <ul class="app-nav__links">
    <li><a href="/pages/dashboard/index.html" data-page="dashboard">Dashboard</a></li>
    <li><a href="/pages/contracts/list.html"  data-page="contratos">Contratos</a></li>
    <li><a href="/pages/templates/index.html" data-page="templates">Templates</a></li>
  </ul>
</nav>
<main class="app-main">
  <!-- conteúdo da página -->
</main>
```

**Nota:** os paths da nav usam caminhos absolutos (`/pages/...`) — funcionam corretamente quando o projeto é servido via servidor HTTP local (ex: `npx serve .`). Não funcionam ao abrir os arquivos diretamente via `file://`.

`.app-nav`: fundo `--color-nav-bg`, altura 52px, `display: flex`, `align-items: center`, `padding: 0 var(--space-6)`.
`.app-nav__links a`: cor `--color-nav-text`, sem sublinhado, padding horizontal. Link com classe `.active` recebe cor `--color-nav-active` e indicador de borda inferior.
`.app-main`: `max-width: 1200px`, `margin: 0 auto`, `padding: var(--space-6)`.

---

## `style/components.css`

### Botões

| Classe | Aparência |
|---|---|
| `.btn-primary` | Fundo `--color-primary`, texto branco, hover `--color-primary-hover` |
| `.btn-secondary` | Borda `--color-border`, fundo transparente, hover fundo `--color-bg` |
| `.btn-danger` | Fundo `--color-danger`, texto branco |

Todos: `border-radius: var(--radius-md)`, `padding: var(--space-2) var(--space-4)`, `font-size: var(--text-sm)`, `cursor: pointer`, `transition: background .15s`.

Estado `disabled`: `opacity: .5; cursor: not-allowed`.

### Badges de status

```html
<span class="badge badge--assinado">Assinado</span>
```

`.badge`: `font-size: var(--text-xs)`, `font-weight: 600`, `padding: 2px 8px`, `border-radius: 99px`.
Variantes `--nao-enviado`, `--aguardando`, `--assinado`, `--cancelado` usam as variáveis de badge definidas em `base.css`.

### Tabela

```html
<div class="table-wrapper">
  <table class="table">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

`.table-wrapper`: `overflow-x: auto` (scroll horizontal em telas pequenas).
`.table`: `width: 100%`, `border-collapse: collapse`.
`thead th`: `font-size: var(--text-xs)`, `color: var(--color-text-muted)`, `text-transform: uppercase`, `letter-spacing: .05em`, `padding: var(--space-3) var(--space-4)`, `border-bottom: 1px solid var(--color-border)`.
`tbody tr`: padding `var(--space-3) var(--space-4)`, linha par com fundo `#f8fafc`, hover `#eff6ff`.

### Modais (`<dialog>`)

```html
<dialog class="modal" id="my-modal">
  <div class="modal__header">Título</div>
  <div class="modal__body">Conteúdo</div>
  <div class="modal__footer">
    <button class="btn-secondary">Cancelar</button>
    <button class="btn-primary">Confirmar</button>
  </div>
</dialog>
```

`.modal`: `max-width: 560px`, `width: 90%`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-md)`, `border: none`, `padding: 0`.
`::backdrop`: `background: rgba(0,0,0,.4)`.
`.modal__header`: `padding: var(--space-4) var(--space-6)`, `font-size: var(--text-lg)`, `font-weight: 600`, `border-bottom: 1px solid var(--color-border)`.
`.modal__body`: `padding: var(--space-6)`.
`.modal__footer`: `padding: var(--space-4) var(--space-6)`, `border-top: 1px solid var(--color-border)`, `display: flex`, `justify-content: flex-end`, `gap: var(--space-2)`.

### Toasts

`.toast-container`: `position: fixed; bottom: var(--space-6); right: var(--space-6); display: flex; flex-direction: column; gap: var(--space-2); z-index: 1000`.
`.toast`: `background: var(--color-surface)`, `border-left: 4px solid`, `border-radius: var(--radius-md)`, `padding: var(--space-3) var(--space-4)`, `box-shadow: var(--shadow-md)`, `font-size: var(--text-sm)`, `min-width: 280px`.
Variantes: `--success` (borda `--color-success`), `--error` (borda `--color-danger`), `--info` (borda `--color-primary`).
Animação: `@keyframes toast-in` (slide-up + fade), `@keyframes toast-out` (fade). Duração total: 4s.

### Formulários

`.form-group`: `display: flex; flex-direction: column; gap: var(--space-1)`.
`.form-label`: `font-size: var(--text-sm); font-weight: 500; color: var(--color-text)`.
`.form-input`, `.form-select`: `border: 1px solid var(--color-border)`, `border-radius: var(--radius-md)`, `padding: var(--space-2) var(--space-3)`, `font-size: var(--text-base)`, `width: 100%`, `outline: none`. Focus: `border-color: var(--color-primary)`, `box-shadow: 0 0 0 3px rgba(59,130,246,.15)`.
Estado erro: `.form-input--error` com borda `--color-danger`. `.form-error`: `font-size: var(--text-xs); color: var(--color-danger)`.
Estado desabilitado: `opacity: .5; cursor: not-allowed`.

### Paginação

```html
<nav class="pagination">
  <button class="btn-secondary" id="prev">Anterior</button>
  <span class="pagination__info">Página 1 de 3</span>
  <button class="btn-secondary" id="next">Próximo</button>
</nav>
```

`.pagination`: `display: flex; align-items: center; gap: var(--space-3); justify-content: center; margin-top: var(--space-6)`.
`.pagination__info`: `font-size: var(--text-sm); color: var(--color-text-muted)`.

---

## `scripts/shared/router.js`

Exporta `markActive(pageKey)`. Adiciona classe `.active` ao link `[data-page="<pageKey>"]` na nav. Chamado no `DOMContentLoaded` de cada página.

```js
export function markActive(pageKey) {
  document.querySelector(`[data-page="${pageKey}"]`)?.classList.add('active')
}
```

Não faz SPA. Navegação entre páginas é navegação entre arquivos HTML — o browser carrega a nova página normalmente.

---

## `scripts/shared/toast.js`

Exporta `toast(message, type = 'info')`. Tipos: `'success'`, `'error'`, `'info'`.

Comportamento:
1. Na primeira chamada, injeta `.toast-container` no `document.body`.
2. Cria elemento `.toast.toast--<type>` com o texto.
3. Aplica animação de entrada (`toast-in`).
4. Após 3.5s, aplica animação de saída (`toast-out`).
5. Remove o elemento do DOM após a animação.

```js
// uso:
import { toast } from '../shared/toast.js'
toast('Contrato criado com sucesso', 'success')
toast('Erro ao salvar', 'error')
```

---

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| Navegação | Top nav escura | Preferência do usuário |
| Cor de ação | Azul `#3b82f6` | Paleta corporativa, confiável |
| Densidade | Confortável | Equilíbrio legibilidade/dados |
| CSS | `base.css` + `components.css` | Reutilização entre as 5 telas |
| Roteamento | Hash-based, arquivos HTML separados | Sem build, sem dependências |
| Fonte externa | Inter (Google Fonts) | Única exceção à regra de sem libs |
