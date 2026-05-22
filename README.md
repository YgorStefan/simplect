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

## Estrutura

```
pages/contracts/list.html                 a tela
scripts/contracts/list.js                 lógica e interação
scripts/contracts/contracts.requests.js   dados e operações (mock)
style/contracts.css                        estilos
```
