import { test, expect } from 'playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/dashboard/index.html');
    await page.waitForSelector('.stat-card');
  });

  test('título da página está correto', async ({ page }) => {
    await expect(page).toHaveTitle('Dashboard — upmobb');
  });

  test('link Dashboard na nav está ativo', async ({ page }) => {
    const link = page.locator('[data-page="dashboard"]');
    await expect(link).toHaveClass(/active/);
  });

  test('renderiza 5 KPI cards', async ({ page }) => {
    const cards = page.locator('.stat-card');
    await expect(cards).toHaveCount(5);
  });

  test('tabela de contratos recentes tem 5 linhas', async ({ page }) => {
    const rows = page.locator('#recent-body tr');
    await expect(rows).toHaveCount(5);
  });

  test('card Total mostra número positivo', async ({ page }) => {
    const total = page.locator('.stat-card--total .stat-card__value');
    const text = await total.textContent();
    expect(parseInt(text, 10)).toBeGreaterThan(0);
  });
});
