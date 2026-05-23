import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3333';
const OUT  = path.resolve('screenshots');
fs.mkdirSync(OUT, { recursive: true });

const shot = (page, name) => page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
const waitContracts = page => page.waitForSelector('#search:not([disabled])');

const browser = await chromium.launch({ headless: true });
const ctx     = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page    = await ctx.newPage();

// ── DASHBOARD ─────────────────────────────────────────────────────────────
await page.goto(`${BASE}/pages/dashboard/index.html`);
await page.waitForSelector('.stat-card');
await shot(page, '01-dashboard');

// ── CONTRATOS – lista ─────────────────────────────────────────────────────
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await shot(page, '02-contracts-list');

// ── CONTRATOS – sort ──────────────────────────────────────────────────────
await page.click('th[data-field="modelo"]');
await page.waitForTimeout(100);
await shot(page, '03-contracts-sorted-asc');
await page.click('th[data-field="modelo"]');
await page.waitForTimeout(100);
await shot(page, '04-contracts-sorted-desc');

// ── CONTRATOS – filtro busca ──────────────────────────────────────────────
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await page.fill('#search', 'NDA');
await page.waitForTimeout(400);
await shot(page, '05-contracts-search-nda');

// ── CONTRATOS – filtro status ─────────────────────────────────────────────
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await page.selectOption('#filter-status', 'assinado');
await page.waitForTimeout(200);
await shot(page, '06-contracts-filter-assinado');

// ── CONTRATOS – modal novo (footer fora do body) ──────────────────────────
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');
await shot(page, '07-contracts-modal-new-top');
await page.keyboard.press('End');    // scroll to bottom of modal body
await page.waitForTimeout(150);
await shot(page, '08-contracts-modal-new-bottom');

// ── CONTRATOS – modal edit ────────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.waitForSelector('#dialog-form:not([open])', { state: 'attached' });
await page.click('[data-action="edit"][data-id="1"]');
await page.waitForSelector('#dialog-form[open]');
await shot(page, '09-contracts-modal-edit');

// ── CONTRATOS – modal details ─────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.click('[data-action="details"][data-id="1"]');
await page.waitForSelector('#dialog-details[open]');
await shot(page, '10-contracts-modal-details');

// ── CONTRATOS – modal preview ─────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.click('[data-action="preview"][data-id="1"]');
await page.waitForSelector('#dialog-preview[open]');
await shot(page, '11-contracts-modal-preview');

// ── CONTRATOS – confirm delete ────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.click('[data-action="delete"][data-id="1"]');
await page.waitForSelector('#dialog-confirm[open]');
await shot(page, '12-contracts-modal-delete');

// ── CONTRATOS – paginação ─────────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await page.click('#btn-next');
await page.waitForTimeout(100);
await shot(page, '13-contracts-page2');

// ── TEMPLATES – lista ─────────────────────────────────────────────────────
await page.goto(`${BASE}/pages/templates/index.html`);
await page.waitForSelector('#table-body tr');
await shot(page, '14-templates-list');

// ── TEMPLATES – modal novo ────────────────────────────────────────────────
await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');
await shot(page, '15-templates-modal-new');

// ── TEMPLATES – modal edit ────────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.click('[data-action="edit"][data-id="1"]');
await page.waitForSelector('#dialog-form[open]');
await shot(page, '16-templates-modal-edit');

// ── TEMPLATES – confirm delete ────────────────────────────────────────────
await page.keyboard.press('Escape');
await page.click('[data-action="delete"][data-id="1"]');
await page.waitForSelector('#dialog-confirm[open]');
await shot(page, '17-templates-modal-delete');

// ── TEMPLATES – criar + editar template de usuário ────────────────────────
await page.keyboard.press('Escape');
await page.goto(`${BASE}/pages/templates/index.html`);
await page.waitForSelector('#table-body tr');
await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');
await page.fill('#f-nome', 'Meu Template');
await page.fill('#f-conteudo', 'Conteúdo de exemplo para teste visual.');
await page.click('#btn-submit');
await page.waitForSelector('.toast--success');
await shot(page, '18-templates-after-create');
// agora edita o template recém-criado (ultimo na lista)
const rows = await page.locator('#table-body tr').count();
const lastEditBtn = page.locator('[data-action="edit"]').nth(rows - 1);
await lastEditBtn.click();
await page.waitForSelector('#dialog-form[open]');
await shot(page, '19-templates-edit-user-created');

// ── CONTRATOS – criar novo ────────────────────────────────────────────────
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await page.click('#btn-new');
await page.waitForSelector('#dialog-form[open]');
await page.selectOption('#f-modelo', 'NDA');
await page.fill('#f-contratante', 'João da Silva');
await page.selectOption('#f-tipo-documento', 'CPF');
await page.fill('#f-documento', '987.654.321-00');
await page.fill('#f-email', 'joao@teste.com.br');
await page.fill('#f-cep', '01310-100');
await page.fill('#f-endereco', 'Av. Paulista');
await page.fill('#f-numero', '999');
await page.fill('#f-bairro', 'Bela Vista');
await page.fill('#f-cidade', 'São Paulo');
await page.selectOption('#f-uf', 'SP');
await page.click('#btn-submit');
await page.waitForSelector('.toast--success');
await shot(page, '20-contracts-after-create-toast');

// ── ESTADO VAZIO (busca sem resultado) ────────────────────────────────────
await page.goto(`${BASE}/pages/contracts/list.html`);
await waitContracts(page);
await page.fill('#search', 'xxxxxxxxxxx');
await page.waitForTimeout(300);
await shot(page, '21-contracts-empty-state');

await browser.close();
console.log(`\nScreenshots salvos em: ${OUT}`);
