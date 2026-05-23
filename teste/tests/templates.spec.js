import { test, expect } from 'playwright/test';

test.describe('Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/templates/index.html');
    await page.waitForSelector('#table-body tr');
  });

  test('título da página está correto', async ({ page }) => {
    await expect(page).toHaveTitle('Templates — upmobb');
  });

  test('link Templates na nav está ativo', async ({ page }) => {
    const link = page.locator('[data-page="templates"]');
    await expect(link).toHaveClass(/active/);
  });

  test('renderiza 4 templates iniciais', async ({ page }) => {
    const rows = page.locator('#table-body tr');
    await expect(rows).toHaveCount(4);
  });

  test('criar novo template mostra toast de sucesso', async ({ page }) => {
    await page.click('#btn-new');
    await page.waitForSelector('#dialog-form[open]');
    await page.fill('#f-nome', 'Template de Teste');
    await page.fill('#f-conteudo', 'Conteúdo do template de teste para E2E.');
    await page.click('#btn-submit');
    await expect(page.locator('.toast--success')).toBeVisible();
    const rows = page.locator('#table-body tr');
    await expect(rows).toHaveCount(5);
  });

  test('editar template mostra modal preenchido e toast de sucesso', async ({ page }) => {
    const editBtn = page.locator('[data-action="edit"]').first();
    await editBtn.click();
    await page.waitForSelector('#dialog-form[open]');
    const nomeValue = await page.inputValue('#f-nome');
    expect(nomeValue.length).toBeGreaterThan(0);
    await page.fill('#f-nome', 'Template Editado');
    await page.click('#btn-submit');
    await expect(page.locator('.toast--success')).toContainText('atualizado');
  });

  test('excluir template mostra dialog e toast', async ({ page }) => {
    const deleteBtn = page.locator('[data-action="delete"]').first();
    await deleteBtn.click();
    await page.waitForSelector('#dialog-confirm[open]');
    await page.click('#btn-confirm-delete');
    await expect(page.locator('.toast--info')).toBeVisible();
    const rows = page.locator('#table-body tr');
    await expect(rows).toHaveCount(3);
  });
});
