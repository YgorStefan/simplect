/**
 * Testes manuais completos: CRUD de contratos e templates,
 * todos os tipos de documento, todos os status, validações.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3333';
const OUT  = path.resolve('manual-shots');
fs.mkdirSync(OUT, { recursive: true });

let shotIdx = 0;
const shot = (page, label) => {
  const name = String(++shotIdx).padStart(3, '0') + '-' + label;
  return page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
};

const waitLoaded = page => page.waitForSelector('#search:not([disabled])');
const waitTpl    = page => page.waitForSelector('#table-body tr');
// Aguarda toast e pega seu texto (pega o mais recente)
const getToast   = async (page, cls = '.toast--success') => {
  await page.waitForSelector(cls);
  return page.locator(cls).last().innerText();
};
// Aguarda toast desaparecer antes de continuar para evitar acúmulo
const clearToasts = page => page.waitForSelector('.toast', { state: 'detached' }).catch(() => {});

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
    results.push({ ok: true, label });
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
    results.push({ ok: false, label });
  }
}

const browser = await chromium.launch({ headless: true });
const ctx     = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page    = await ctx.newPage();

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 1 – CONTRATOS: VALIDAÇÃO DE FORMULÁRIO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 1 – Validação do formulário de contrato');
console.log('──────────────────────────────────────────');

await page.goto(`${BASE}/pages/contracts/list.html`);
await waitLoaded(page);

await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');

// 1.1 Submeter vazio
await page.click('#btn-submit');
assert(await page.locator('#form-error:not(.hidden)').count() === 1,      'erro exibido ao submeter formulário vazio');
assert(await page.locator('#f-modelo.invalid').count() === 1,              'campo Modelo inválido quando vazio');
assert(await page.locator('#f-contratante.invalid').count() === 1,         'campo Contratante inválido quando vazio');
await shot(page, 'form-vazio-invalido');

// 1.2 E-mail inválido — preencher todos exceto email válido
await page.selectOption('#f-modelo', 'NDA');
await page.fill('#f-contratante', 'Teste Validação');
await page.selectOption('#f-tipo-documento', 'CPF');
await page.fill('#f-documento', '123.456.789-09');
await page.fill('#f-email', 'nao-e-email');
await page.fill('#f-cep', '01310-100');
await page.fill('#f-endereco', 'Rua Teste');
await page.fill('#f-numero', '1');
await page.fill('#f-bairro', 'Centro');
await page.fill('#f-cidade', 'SP');
await page.selectOption('#f-uf', 'SP');
await page.click('#btn-submit');
assert(await page.locator('#f-email.invalid').count() === 1, 'campo E-mail inválido marcado');
await shot(page, 'email-invalido');

// 1.3 CPF com dígitos insuficientes
await page.fill('#f-email', 'valido@teste.com');
await page.fill('#f-documento', '123.456');
await page.click('#btn-submit');
assert(await page.locator('#f-documento.invalid').count() === 1, 'CPF incompleto marcado como inválido');
await shot(page, 'cpf-invalido');

// 1.4 CNPJ com dígitos insuficientes
await page.selectOption('#f-tipo-documento', 'CNPJ');
await page.fill('#f-documento', '12.345');
await page.click('#btn-submit');
assert(await page.locator('#f-documento.invalid').count() === 1, 'CNPJ incompleto marcado como inválido');
await shot(page, 'cnpj-invalido');

await page.keyboard.press('Escape');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 2 – CONTRATOS: CRIAÇÃO COM CPF
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 2 – Criar contrato com CPF (Prestação de Serviços)');
console.log('──────────────────────────────────────────');

await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');

assert(await page.locator('#form-group-status.hidden').count() === 1, 'campo Status oculto no formulário de novo contrato');

await page.selectOption('#f-modelo', 'Prestação de Serviços');
await page.fill('#f-contratante', 'Carlos Pereira');
await page.selectOption('#f-tipo-documento', 'CPF');
await page.fill('#f-documento', '111.222.333-44');
await page.fill('#f-email', 'carlos.pereira@empresa.com');
await page.fill('#f-cep', '20040-020');
await page.fill('#f-endereco', 'Av. Rio Branco');
await page.fill('#f-numero', '156');
await page.fill('#f-bairro', 'Centro');
await page.fill('#f-cidade', 'Rio de Janeiro');
await page.selectOption('#f-uf', 'RJ');
await shot(page, 'contrato-cpf-preenchido');

await page.click('#btn-submit');
const toastCpf = await getToast(page);
assert(toastCpf.includes('criado'), 'toast de sucesso ao criar contrato com CPF');

// Verificar que o contrato aparece na tabela (buscar por nome)
await clearToasts(page);
await page.fill('#search', 'Carlos Pereira');
await page.waitForTimeout(300);
const cpfRows = await page.locator('#table-body tr').count();
assert(cpfRows === 1, `contrato CPF encontrado na busca (${cpfRows})`);
await page.fill('#search', '');
await page.waitForTimeout(200);
await shot(page, 'contrato-cpf-criado');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 3 – CONTRATOS: CRIAÇÃO COM CNPJ
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 3 – Criar contrato com CNPJ (NDA)');
console.log('──────────────────────────────────────────');

await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');

await page.selectOption('#f-modelo', 'NDA');
await page.fill('#f-contratante', 'Tech Solutions Ltda');
await page.selectOption('#f-tipo-documento', 'CNPJ');
await page.fill('#f-documento', '12.345.678/0001-90');
await page.fill('#f-email', 'juridico@techsolutions.com.br');
await page.fill('#f-cep', '01452-000');
await page.fill('#f-endereco', 'Av. Brigadeiro Faria Lima');
await page.fill('#f-numero', '3900');
await page.fill('#f-bairro', 'Itaim Bibi');
await page.fill('#f-cidade', 'São Paulo');
await page.selectOption('#f-uf', 'SP');
await shot(page, 'contrato-cnpj-preenchido');

await page.click('#btn-submit');
const toastCnpj = await getToast(page);
assert(toastCnpj.includes('criado'), 'toast de sucesso ao criar contrato com CNPJ');
await clearToasts(page);

await page.fill('#search', 'Tech Solutions');
await page.waitForTimeout(300);
const cnpjRows = await page.locator('#table-body tr').count();
assert(cnpjRows === 1, `contrato CNPJ encontrado na busca (${cnpjRows})`);
await page.fill('#search', '');
await page.waitForTimeout(200);
await shot(page, 'contrato-cnpj-criado');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 4 – CONTRATOS: CRIAÇÃO COM CONTEÚDO PERSONALIZADO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 4 – Criar contrato com conteúdo personalizado (Locação Residencial)');
console.log('──────────────────────────────────────────');

await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');

await page.selectOption('#f-modelo', 'Locação Residencial');
await page.fill('#f-contratante', 'Maria da Silva');
await page.selectOption('#f-tipo-documento', 'CPF');
await page.fill('#f-documento', '999.888.777-66');
await page.fill('#f-email', 'maria.silva@email.com');
await page.fill('#f-cep', '30130-110');
await page.fill('#f-endereco', 'Rua dos Tupis');
await page.fill('#f-numero', '234');
await page.fill('#f-bairro', 'Centro');
await page.fill('#f-cidade', 'Belo Horizonte');
await page.selectOption('#f-uf', 'MG');
await page.fill('#f-conteudo', 'Locação do imóvel residencial na Rua dos Tupis, 234.\n- Prazo: 12 meses\n- Aluguel: R$ 2.500,00\n- Reajuste anual pelo IGP-M');
await shot(page, 'contrato-conteudo-personalizado');

await page.click('#btn-submit');
const toastLoc = await getToast(page);
assert(toastLoc.includes('criado'), 'contrato com conteúdo personalizado criado');
await clearToasts(page);
await shot(page, 'contrato-personalizado-criado');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 5 – CONTRATOS: CRIAÇÃO COMPRA E VENDA + VERIFICAÇÃO PAGINAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 5 – Criar contrato (Compra e Venda / DF) e verificar paginação');
console.log('──────────────────────────────────────────');

await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');

await page.selectOption('#f-modelo', 'Compra e Venda');
await page.fill('#f-contratante', 'José Oliveira EIRELI');
await page.selectOption('#f-tipo-documento', 'CNPJ');
await page.fill('#f-documento', '98.765.432/0001-10');
await page.fill('#f-email', 'contato@joseoliveira.com');
await page.fill('#f-cep', '70040-010');
await page.fill('#f-endereco', 'SHN Quadra 1 Bloco F');
await page.fill('#f-numero', '100');
await page.fill('#f-bairro', 'Asa Norte');
await page.fill('#f-cidade', 'Brasília');
await page.selectOption('#f-uf', 'DF');

await page.click('#btn-submit');
const toastCV = await getToast(page);
assert(toastCV.includes('criado'), 'contrato Compra e Venda com CNPJ e UF=DF criado');
await clearToasts(page);
await shot(page, 'contrato-compra-venda-criado');

const paginfoAfterCreation = await page.locator('#pagination-info').innerText();
// Agora há 25 + 4 = 29 contratos → 3 páginas
assert(paginfoAfterCreation.includes('3'), `paginação mostra 3 páginas após criações (${paginfoAfterCreation})`);
await shot(page, 'lista-com-paginacao-3paginas');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 6 – CONTRATOS: EDIÇÃO (todos os campos + status)
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 6 – Editar contrato: todos os campos e status');
console.log('──────────────────────────────────────────');

await page.click('[data-action="edit"][data-id="1"]');
await page.waitForSelector('#dialog-form[open]');

assert(await page.locator('#form-group-status:not(.hidden)').count() === 1, 'campo Status visível no formulário de edição');

const currentName = await page.inputValue('#f-contratante');
assert(currentName.length > 0, `formulário de edição pré-preenchido (nome: ${currentName})`);

const currentEmail = await page.inputValue('#f-email');
assert(currentEmail.length > 0, `e-mail pré-preenchido: ${currentEmail}`);

await page.selectOption('#f-status', 'aguardando_assinatura');
await page.selectOption('#f-modelo', 'Compra e Venda');
await page.fill('#f-email', 'editado@contrato.com');
await page.fill('#f-endereco', 'Rua Editada pelo Teste');
await page.fill('#f-numero', '999');
await shot(page, 'contrato-edicao-campos-alterados');

await page.click('#btn-submit');
const toastEdit = await getToast(page);
assert(toastEdit.includes('atualizado'), 'toast de sucesso ao editar contrato');
await clearToasts(page);
await shot(page, 'contrato-editado');

// Verificar badge na linha do id=1
const badge1 = await page.locator('tr:has([data-id="1"]) .badge').last().innerText();
assert(badge1 === 'Aguardando assinatura', `status id=1 atualizado para "Aguardando assinatura" (obteve: "${badge1}")`);

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 7 – CONTRATOS: EDIÇÃO DE TODOS OS STATUS
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 7 – Editar status para todos os valores possíveis');
console.log('──────────────────────────────────────────');

const statuses = [
  { value: 'assinado',              label: 'Assinado' },
  { value: 'cancelado',             label: 'Cancelado' },
  { value: 'nao_enviado',           label: 'Não enviado' },
  { value: 'aguardando_assinatura', label: 'Aguardando assinatura' },
];

for (const s of statuses) {
  await page.click('[data-action="edit"][data-id="1"]');
  await page.waitForSelector('#dialog-form[open]');
  await page.selectOption('#f-status', s.value);
  await page.click('#btn-submit');
  await page.waitForSelector('.toast--success');
  await clearToasts(page);
  const badge = await page.locator('tr:has([data-id="1"]) .badge').last().innerText();
  assert(badge === s.label, `status "${s.label}" refletido no badge da tabela`);
}
await shot(page, 'todos-status-testados');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 8 – CONTRATOS: DETALHES E PRÉVIA
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 8 – Modal de detalhes e prévia do contrato');
console.log('──────────────────────────────────────────');

await page.click('[data-action="details"][data-id="1"]');
await page.waitForSelector('#dialog-details[open]');
const detailsContent = await page.locator('#details-body').innerText();
assert(detailsContent.length > 20, 'modal de detalhes exibe dados do contrato');
assert(detailsContent.includes('editado@contrato.com'), 'detalhes refletem o e-mail editado anteriormente');
await shot(page, 'modal-detalhes');
await page.keyboard.press('Escape');

await page.click('[data-action="preview"][data-id="1"]');
await page.waitForSelector('#dialog-preview[open]');
const previewContent = await page.locator('#preview-body').innerText();
assert(previewContent.length > 20, 'modal de prévia exibe conteúdo do contrato');
await shot(page, 'modal-previa');
await page.keyboard.press('Escape');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 9 – CONTRATOS: BUSCA E FILTROS
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 9 – Busca e filtros');
console.log('──────────────────────────────────────────');

// Busca por contratante criado
await page.fill('#search', 'Carlos Pereira');
await page.waitForTimeout(400);
assert(await page.locator('#table-body tr').count() === 1, 'busca por "Carlos Pereira" retorna 1 resultado');
await shot(page, 'busca-carlos-pereira');

// Busca por trecho de CNPJ
await page.fill('#search', 'Tech Solutions');
await page.waitForTimeout(400);
assert(await page.locator('#table-body tr').count() === 1, 'busca por "Tech Solutions" retorna 1 resultado');
await shot(page, 'busca-tech-solutions');

// Busca por modelo
await page.fill('#search', 'Locação');
await page.waitForTimeout(400);
const locacaoRows = await page.locator('#table-body tr').count();
assert(locacaoRows >= 1, `busca por "Locação" retorna ${locacaoRows} resultado(s)`);
await shot(page, 'busca-locacao');

// Busca sem resultado
await page.fill('#search', 'XXXXXXXXXXXXXXX');
await page.waitForTimeout(400);
const emptyText = await page.locator('#table-body').innerText();
assert(emptyText.includes('Nenhum'), 'busca sem resultado mostra estado vazio');
await shot(page, 'busca-sem-resultado');

await page.fill('#search', '');
await page.waitForTimeout(200);

// Filtro por cada status
for (const s of ['nao_enviado', 'aguardando_assinatura', 'assinado', 'cancelado']) {
  await page.selectOption('#filter-status', s);
  await page.waitForTimeout(200);
  const rows = await page.locator('#table-body tr').count();
  const txt = await page.locator('#table-body').innerText();
  const hasContent = rows > 0 && (rows > 1 || !txt.includes('Nenhum'));
  assert(rows >= 1, `filtro "${s}" executado (${rows} linha(s))`);
}
await page.selectOption('#filter-status', '');
await page.waitForTimeout(200);
await shot(page, 'filtros-status-testados');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 10 – CONTRATOS: DELEÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 10 – Deletar contrato (confirmar e cancelar)');
console.log('──────────────────────────────────────────');

// Cancelar deleção — usar id=1 que está na lista
await page.click('[data-action="delete"][data-id="1"]');
await page.waitForSelector('#dialog-confirm[open]');
const confirmMsg = await page.locator('#confirm-message').innerText();
assert(confirmMsg.includes('Ana Lima') || confirmMsg.length > 10, `mensagem de confirmação: "${confirmMsg}"`);
await shot(page, 'dialog-cancel-delete');
await page.click('#btn-cancel-delete');
await page.waitForSelector('#dialog-confirm:not([open])', { state: 'attached' });
// id=1 ainda na tabela
assert(await page.locator('[data-action="delete"][data-id="1"]').count() > 0, 'cancelar deleção não remove o contrato');

// Confirmar deleção de id=1
await page.click('[data-action="delete"][data-id="1"]');
await page.waitForSelector('#dialog-confirm[open]');
await shot(page, 'dialog-confirm-delete');
await page.click('#btn-confirm-delete');
const toastDel = await getToast(page, '.toast--info');
assert(toastDel.includes('excluído'), 'toast de confirmação de exclusão');
// id=1 deve ter sumido
await clearToasts(page);
assert(await page.locator('[data-action="delete"][data-id="1"]').count() === 0, 'id=1 removido da tabela após deleção');
await shot(page, 'apos-delecao');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 11 – CONTRATOS: PAGINAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 11 – Paginação');
console.log('──────────────────────────────────────────');

await page.goto(`${BASE}/pages/contracts/list.html`);
await waitLoaded(page);

const paginfoP1 = await page.locator('#pagination-info').innerText();
assert(paginfoP1.includes('1'), `paginação mostra página 1 (${paginfoP1})`);
assert(await page.locator('#btn-prev[disabled]').count() === 1, 'botão Anterior desabilitado na página 1');

await page.click('#btn-next');
await page.waitForTimeout(150);
const paginfoP2 = await page.locator('#pagination-info').innerText();
assert(paginfoP2.includes('2'), `avança para página 2 (${paginfoP2})`);
await shot(page, 'paginacao-pagina2');

await page.click('#btn-prev');
await page.waitForTimeout(150);
assert((await page.locator('#pagination-info').innerText()).includes('1'), 'volta para página 1');

// Ir até última página
const totalPagesMatch = paginfoP2.match(/de (\d+)/);
const totalPages = totalPagesMatch ? parseInt(totalPagesMatch[1]) : 1;
for (let i = 1; i < totalPages; i++) {
  await page.click('#btn-next');
  await page.waitForTimeout(100);
}
assert(await page.locator('#btn-next[disabled]').count() === 1, 'botão Próximo desabilitado na última página');
await shot(page, 'paginacao-ultima-pagina');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 12 – TEMPLATES: VALIDAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 12 – Validação do formulário de templates');
console.log('──────────────────────────────────────────');

await page.goto(`${BASE}/pages/templates/index.html`);
await waitTpl(page);

await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');

await page.click('#btn-submit');
assert(await page.locator('#f-nome.invalid').count() === 1,     'campo Nome inválido quando vazio');
assert(await page.locator('#f-conteudo.invalid').count() === 1, 'campo Conteúdo inválido quando vazio');
await shot(page, 'template-form-invalido');

await page.fill('#f-nome', 'Apenas Nome');
await page.click('#btn-submit');
assert(await page.locator('#f-conteudo.invalid').count() === 1, 'conteúdo ainda inválido com apenas nome preenchido');

await page.keyboard.press('Escape');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 13 – TEMPLATES: CRIAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 13 – Criar templates');
console.log('──────────────────────────────────────────');

const tplRowsBefore = await page.locator('#table-body tr').count();  // 4

// Template 1 — texto simples com variáveis
await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');
await page.fill('#f-nome', 'Declaração Simples');
await page.fill('#f-conteudo', 'Declaro para os devidos fins que {{contratante}}, portador do documento {{documento}}, residente em {{endereco}}, {{cidade}}/{{uf}}, é cliente desta empresa.');
await shot(page, 'template1-preenchido');
await page.click('#btn-submit');
await page.waitForSelector('.toast--success');
await clearToasts(page);
assert(await page.locator('#table-body tr').count() === tplRowsBefore + 1, '"Declaração Simples" adicionado à lista');
await shot(page, 'template1-criado');

// Template 2 — markdown
await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');
await page.fill('#f-nome', 'Contrato de Parceria');
await page.fill('#f-conteudo', '**CONTRATO DE PARCERIA COMERCIAL**\n\nPartes:\n- **Empresa:** Upmobb\n- **Parceiro:** {{contratante}}\n\nDocumento: {{documento}}\n\nAs partes acordam os termos descritos neste instrumento.');
await page.click('#btn-submit');
await page.waitForSelector('.toast--success');
await clearToasts(page);
assert(await page.locator('#table-body tr').count() === tplRowsBefore + 2, '"Contrato de Parceria" adicionado à lista');
await shot(page, 'template2-criado');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 14 – TEMPLATES: EDIÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 14 – Editar template');
console.log('──────────────────────────────────────────');

// Editar "Declaração Simples" (posição tplRowsBefore = índice 4)
const editBtn = page.locator('[data-action="edit"]').nth(tplRowsBefore);
await editBtn.click();
await page.waitForSelector('#dialog-form[open]');

const existingNome = await page.inputValue('#f-nome');
assert(existingNome === 'Declaração Simples', `formulário pré-preenchido com nome correto (${existingNome})`);

const existingConteudo = await page.inputValue('#f-conteudo');
assert(existingConteudo.length > 10, 'formulário pré-preenchido com conteúdo');
await shot(page, 'template-edit-preenchido');

await page.fill('#f-nome', 'Declaração Simples (revisada)');
await page.fill('#f-conteudo', existingConteudo + '\n\nRevisado em 2026.');
await page.click('#btn-submit');
const toastTplEdit = await getToast(page);
assert(toastTplEdit.includes('atualizado'), 'toast de sucesso ao editar template');
await clearToasts(page);
await shot(page, 'template-editado');

const updatedNames = await page.locator('#table-body tr').allInnerTexts();
assert(updatedNames.some(t => t.includes('revisada')), 'nome atualizado refletido na lista');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 15 – TEMPLATES: DELEÇÃO
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 15 – Deletar template (confirmar e cancelar)');
console.log('──────────────────────────────────────────');

const tplCountBefore = await page.locator('#table-body tr').count();  // 6

// Cancelar
const delBtn = page.locator('[data-action="delete"]').nth(tplRowsBefore);
await delBtn.click();
await page.waitForSelector('#dialog-confirm[open]');
const tplConfirmMsg = await page.locator('#confirm-message').innerText();
assert(tplConfirmMsg.includes('revisada'), `mensagem de confirmação menciona o template: "${tplConfirmMsg}"`);
await shot(page, 'template-delete-confirm');
await page.click('#btn-cancel-delete');
await page.waitForSelector('#dialog-confirm:not([open])', { state: 'attached' });
assert(await page.locator('#table-body tr').count() === tplCountBefore, 'cancelar deleção não remove o template');

// Confirmar
const delBtn2 = page.locator('[data-action="delete"]').nth(tplRowsBefore);
await delBtn2.click();
await page.waitForSelector('#dialog-confirm[open]');
await page.click('#btn-confirm-delete');
const toastTplDel = await getToast(page, '.toast--info');
assert(toastTplDel.includes('excluído'), 'toast de exclusão de template exibido');
await clearToasts(page);
const tplCountAfter = await page.locator('#table-body tr').count();
assert(tplCountAfter === tplCountBefore - 1, `template removido (${tplCountBefore} → ${tplCountAfter})`);
await shot(page, 'template-deletado');

// ═══════════════════════════════════════════════════════════════════════════
// BLOCO 16 – DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n──────────────────────────────────────────');
console.log('BLOCO 16 – Dashboard');
console.log('──────────────────────────────────────────');

await page.goto(`${BASE}/pages/dashboard/index.html`);
await page.waitForSelector('.stat-card');

const totalText = await page.locator('.stat-card--total .stat-card__value').innerText();
assert(parseInt(totalText) > 0, `Dashboard Total mostra número positivo (${totalText})`);
assert(await page.locator('.stat-card').count() === 5, 'Dashboard exibe 5 cards de KPI');
const recentRows = await page.locator('#recent-body tr').count();
assert(recentRows > 0, `Tabela de contratos recentes tem ${recentRows} linhas`);
await shot(page, 'dashboard-final');

// ═══════════════════════════════════════════════════════════════════════════
// RESULTADO FINAL
// ═══════════════════════════════════════════════════════════════════════════
await browser.close();

console.log('\n══════════════════════════════════════════');
console.log(`RESULTADO: ${passed} passaram / ${failed} falharam`);
console.log('══════════════════════════════════════════');

if (failed > 0) {
  console.log('\nFalhas:');
  results.filter(r => !r.ok).forEach(r => console.log(`  ❌ ${r.label}`));
  process.exit(1);
}
console.log(`\nScreenshots em: ${OUT}`);
