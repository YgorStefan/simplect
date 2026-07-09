import { test, expect } from 'playwright/test';

test.describe('Contratos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('simplect:session', JSON.stringify({
        id: '1', nome: 'Admin Geral', email: 'admin@simplect.com', papel: 'admin',
      }));
    });
    await page.goto('/pages/contracts/list.html');
    await page.waitForSelector('#table-body tr');
  });

  test('título da página está correto', async ({ page }) => {
    await expect(page).toHaveTitle('Contratos — simplect');
  });

  test('link Contratos na nav está ativo', async ({ page }) => {
    const link = page.locator('[data-page="contratos"]');
    await expect(link).toHaveClass(/active/);
  });

  test('renderiza 10 contratos (perPage padrão)', async ({ page }) => {
    const rows = page.locator('#table-body tr');
    await expect(rows).toHaveCount(10);
  });

  test('filtro de busca filtra por contratante', async ({ page }) => {
    await page.fill('#search', 'Ana Lima');
    await page.waitForTimeout(400);
    const rows = page.locator('#table-body tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Ana Lima');
  });

  test('filtro de status filtra por assinado', async ({ page }) => {
    await page.selectOption('#filter-status', 'assinado');
    await page.waitForTimeout(200);
    const badges = page.locator('#table-body .badge--assinado');
    const rowCount = await page.locator('#table-body tr').count();
    const badgeCount = await badges.count();
    expect(badgeCount).toBe(rowCount);
  });

  test('ordenação por coluna adiciona classe active e indicador', async ({ page }) => {
    const th = page.locator('th[data-field="modelo"]');
    await expect(th).not.toHaveClass(/active/);
    await th.click();
    await expect(th).toHaveClass(/active/);
    await expect(th.locator('.sort-indicator')).toContainText('↑');
  });

  test('criar novo contrato mostra toast de sucesso', async ({ page }) => {
    await page.click('#btn-new');
    await page.waitForSelector('#dialog-form[open]');
    await page.selectOption('#f-modelo', 'Prestação de Serviços');
    await page.fill('#f-contratante', 'Teste E2E');
    await page.selectOption('#f-tipo-documento', 'CPF');
    await page.fill('#f-documento', '123.456.789-00');
    await page.fill('#f-email', 'teste@e2e.com');
    await page.fill('#f-cep', '01310100');
    await page.fill('#f-endereco', 'Rua Teste');
    await page.fill('#f-numero', '1');
    await page.fill('#f-bairro', 'Centro');
    await page.fill('#f-cidade', 'São Paulo');
    await page.selectOption('#f-uf', 'SP');
    await page.click('#btn-submit');
    await expect(page.locator('.toast--success')).toBeVisible();
  });

  test('excluir contrato mostra dialog e toast', async ({ page }) => {
    const deleteBtn = page.locator('[data-action="delete"]').first();
    await deleteBtn.click();
    await page.waitForSelector('#dialog-confirm[open]');
    await page.click('#btn-confirm-delete');
    await expect(page.locator('.toast--info')).toBeVisible();
  });
});
