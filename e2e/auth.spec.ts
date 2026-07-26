import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to login and redirect to dashboard', async ({ page }) => {
    // This assumes the app is running and the DB is seeded.
    // In a real CI, we'd seed the DB first.
    
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should block unauthorized access to admin', async ({ page }) => {
    await page.goto('/admin');
    // Since no user is logged in, should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
