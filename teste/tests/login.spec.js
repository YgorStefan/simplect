import { test, expect } from 'playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/login/index.html');
    await page.waitForSelector('#login-form');
  });

  test('título da página está correto', async ({ page }) => {
    await expect(page).toHaveTitle('Entrar — simplect');
  });

  test('mostra dica de credenciais de demonstração', async ({ page }) => {
    await expect(page.locator('.login-card__hint')).toContainText('admin@simplect.com');
  });

  test('login com credenciais inválidas mostra erro', async ({ page }) => {
    await page.fill('#f-email', 'invalido@simplect.com');
    await page.fill('#f-senha', 'senhaerrada');
    await page.click('#btn-submit');
    await expect(page.locator('#error-banner')).toBeVisible();
    await expect(page.locator('#error-message')).toContainText('inválidos');
  });

  test('login com credenciais válidas redireciona pro dashboard', async ({ page }) => {
    await page.fill('#f-email', 'admin@simplect.com');
    await page.fill('#f-senha', 'admin123');
    await page.click('#btn-submit');
    await page.waitForURL('**/pages/dashboard/index.html');
    await expect(page).toHaveURL(/dashboard\/index\.html/);
  });

  test('acessar o dashboard sem sessão redireciona pro login', async ({ page }) => {
    await page.goto('/pages/dashboard/index.html');
    await page.waitForURL('**/pages/login/index.html');
    await expect(page).toHaveURL(/login\/index\.html/);
  });

  test('logout limpa a sessão e redireciona pro login', async ({ page }) => {
    await page.fill('#f-email', 'admin@simplect.com');
    await page.fill('#f-senha', 'admin123');
    await page.click('#btn-submit');
    await page.waitForURL('**/pages/dashboard/index.html');

    await page.click('#btn-logout');
    await page.waitForURL('**/pages/login/index.html');

    const session = await page.evaluate(() => localStorage.getItem('simplect:session'));
    expect(session).toBeNull();
  });
});
