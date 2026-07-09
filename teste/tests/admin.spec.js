import { test, expect } from 'playwright/test';

test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('simplect:session', JSON.stringify({
        id: '1', nome: 'Admin Geral', email: 'admin@simplect.com', papel: 'admin',
      }));
    });
    await page.goto('/pages/admin/index.html');
    await page.waitForSelector('#users-body tr');
  });

  test('título da página está correto', async ({ page }) => {
    await expect(page).toHaveTitle('Admin — simplect');
  });

  test('link Admin na nav está ativo', async ({ page }) => {
    const link = page.locator('[data-page="admin"]');
    await expect(link).toHaveClass(/active/);
  });

  test('renderiza 3 usuários mockados', async ({ page }) => {
    const rows = page.locator('#users-body tr');
    await expect(rows).toHaveCount(3);
  });

  test('troca de aba mostra o painel de Atividades', async ({ page }) => {
    await page.click('[data-tab="atividades"]');
    await expect(page.locator('.admin-panel[data-panel="atividades"]')).toHaveClass(/active/);
    await page.waitForSelector('#activities-body tr');
    const rows = page.locator('#activities-body tr');
    await expect(rows).toHaveCount(6);
  });

  test('troca de aba mostra o painel de Configurações', async ({ page }) => {
    await page.click('[data-tab="configuracoes"]');
    await expect(page.locator('.admin-panel[data-panel="configuracoes"]')).toHaveClass(/active/);
    await expect(page.locator('#settings-form')).toBeVisible();
  });

  test('criar novo usuário mostra toast de sucesso', async ({ page }) => {
    await page.click('#btn-new-user');
    await page.waitForSelector('#dialog-form[open]');
    await page.fill('#f-nome', 'Teste E2E');
    await page.fill('#f-email', 'teste-e2e@simplect.com');
    await page.selectOption('#f-papel', 'user');
    await page.click('#btn-submit');
    await expect(page.locator('.toast--success')).toBeVisible();
  });

  test('excluir usuário mostra dialog e toast', async ({ page }) => {
    const deleteBtn = page.locator('[data-action="delete"]').first();
    await deleteBtn.click();
    await page.waitForSelector('#dialog-confirm[open]');
    await page.click('#btn-confirm-delete');
    await expect(page.locator('.toast--info')).toBeVisible();
  });
});
