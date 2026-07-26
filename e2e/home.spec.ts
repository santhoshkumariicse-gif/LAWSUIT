import { test, expect } from '@playwright/test';

test('Homepage loads and displays main components', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');

  // Check the document title
  await expect(page).toHaveTitle(/LawGuide AI/);

  // Check for the main hero heading
  const heading = page.locator('h1').filter({ hasText: 'LawGuide AI India' });
  await expect(heading).toBeVisible();

  // Check for the "Start Legal Analysis" button in the Navbar
  const startButton = page.locator('button', { hasText: 'Start Legal Analysis' });
  await expect(startButton).toBeVisible();
});

test('Navigation menu works', async ({ page }) => {
  await page.goto('/');
  
  // Click on "Legal Assistant" link
  const assistantLink = page.locator('a', { hasText: 'Legal Assistant' });
  await expect(assistantLink).toBeVisible();
});
