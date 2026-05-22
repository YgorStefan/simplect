# Design: Tela Administrativa de Contratos

**Data:** 2026-05-21  
**Escopo:** Frontend puro (HTML + CSS + JS ES modules), sem backend, API ou bibliotecas externas.

---

## Estrutura de arquivos

```
pages/contracts/list.html
scripts/contracts/list.js
scripts/contracts/contracts.requests.js
style/contracts.css
```

---

## Arquitetura

`list.html` carrega `list.js` como módulo ES. `list.js` importa `getContracts` e `createContract` de `contracts.requests.js`. Ao inicializar, chama `getContracts()`, popula o estado e chama `render()`. Toda interação do usuário muda o estado e chama `render()` — sem recarregar a página.

### Estado (`state` em `list.js`)

```js
{
  contracts: [],       // todos os registros carregados
  search: '',          // busca por contratante, documento, modelo
  statusFilter: '',    // filtro por status
  sortField: '',       // campo de ordenação ativo
  sortDir: 'asc',      // 'asc' | 'desc'
  page: 1,
  perPage: 10,
  loading: false,
  saving: false,
  error: null
}
```

### Pipeline de render

A cada mudança de estado, `render()` executa em ordem:
1. Filtra por `search` (match em contratante, documento, modelo — case-insensitive)
2. Filtra por `statusFilter`
3. Ordena por `sortField` + `sortDir`
4. Fatia pelo `page` e `perPage`
5. Atualiza DOM: tabela, paginação, controles

Todos os valores dinâmicos são escapados (`escapeHtml`) antes de irem ao `innerHTML`, evitando injeção de HTML a partir de dados de contratos criados no formulário.

---

## Modelo de dados

```js
{
  id: string,
  modelo: string,
  contratante: string,
  tipoDocumento: 'CPF' | 'CNPJ',
  documento: string,
  email: string,
  cep: string,
  endereco: string,
  numero: string,
  bairro: string,
  cidade: string,
  uf: string,
  status: 'nao_enviado' | 'aguardando_assinatura' | 'assinado' | 'cancelado',
  createdAt: string   // ISO date string — exibido como dd/mm/yyyy nos detalhes
}
```

### Mapeamento de status (enum → label de UI)

| Valor interno | Label exibido |
|---|---|
| `nao_enviado` | Não enviado |
| `aguardando_assinatura` | Aguardando assinatura |
| `assinado` | Assinado |
| `cancelado` | Cancelado |

Aplicado em: badge na tabela, select de filtro, painel de detalhes.

### Mock data

25 registros em `contracts.requests.js`, variando entre 4 modelos, 4 status e contratantes/documentos distintos — suficiente para 3 páginas de 10 registros e para testar busca, filtro e ordenação.

Cada modelo tem um template de prévia hardcoded com parágrafos usando `**negrito**` e itens de lista com `-`. Os dados do contrato são interpolados via `{{campo}}` antes da renderização.

---

## `contracts.requests.js`

Exporta:
- `getContracts()` → `Promise<contract[]>` — resolve após ~300ms com os 25 registros mock. Com `?simulateError` na URL, a primeira chamada rejeita uma vez (e sucede no retry) — permite exercer o estado de erro e o botão "Tentar novamente"
- `createContract(data)` → `Promise<contract>` — resolve após ~500ms; rejeita deterministicamente quando `data.documento === '00000000000'` (permite testar estado de erro sem comportamento aleatório)

---

## `list.js`

### Listagem

Tabela com colunas: Modelo, Contratante, Documento, Endereço, Status, Ações.

**Formato da coluna Endereço:** `{endereco}, {numero} - {bairro}, {cidade}/{uf}`

**Ordenação:** colunas Contratante e Modelo são clicáveis no `<thead>`. Click na coluna ativa alterna `asc`/`desc`; click em coluna diferente define como ativa com `asc`. Indicador ↑/↓ na coluna ativa. Ordenar reseta para a página 1.

### Controles

- Input de busca: filtra por contratante, documento e modelo simultaneamente
- Select de status: opções "Todos", "Não enviado", "Aguardando assinatura", "Assinado", "Cancelado"
- Paginação: botões Anterior/Próximo + indicador "Página X de Y"

### Estados visuais

| Estado | Comportamento |
|--------|--------------|
| loading | Spinner/skeleton no lugar da tabela; controles desabilitados |
| vazio | Mensagem "Nenhum contrato encontrado" no tbody |
| erro | Banner de erro acima da tabela; botão para tentar novamente |
| salvando | Botão de submit desabilitado com indicador visual |

### Modais (3 `<dialog>`)

**`#details`** — abre ao clicar "Ver detalhes" na coluna Ações. Exibe:
- Modelo, Contratante, Documento, Endereço completo, CEP, Status, Data de criação, E-mail

**`#preview`** — abre ao clicar "Ver prévia" na coluna Ações. Renderiza o template do modelo com dados interpolados. Parser:
- `**texto**` → `<strong>texto</strong>`
- Linha iniciada por `-` → item de `<ul>`
- Demais linhas → `<p>`

**`#form`** — abre via botão "Novo contrato". Campos obrigatórios:
Modelo (select com os 4 modelos), Nome do contratante, Tipo de documento (select: CPF/CNPJ), Documento (texto livre, validação apenas de preenchimento obrigatório — sem máscara), E-mail, CEP, Endereço, Número, Bairro, Cidade, UF (select com os 27 estados brasileiros).
Ao submeter: valida campos obrigatórios → chama `createContract()` → em caso de sucesso fecha o modal e adiciona o registro ao estado → em caso de erro exibe mensagem no modal.

---

## `list.html`

Estrutura estática:

```
<header>           — título "Contratos" + botão "Novo contrato"
<section.filters>  — input de busca + select de status
<table>            — thead fixo + tbody preenchido via JS
<nav.pagination>   — botões Anterior/Próximo + indicador de página
<dialog#details>   — detalhes do contrato
<dialog#preview>   — prévia do contrato
<dialog#form>      — formulário de criação
```

`<script type="module" src="...">` no final do `<body>`. Sem lógica inline.

---

## `contracts.css`

Estilo administrativo funcional:
- Tabela com linhas zebradas
- Badges coloridos por status (cor distinta por valor)
- Estados de loading via `opacity` reduzida
- `::backdrop` semi-transparente nos dialogs
- Scroll horizontal na tabela em telas pequenas
- Sem reset externo; apenas o necessário para a tela
