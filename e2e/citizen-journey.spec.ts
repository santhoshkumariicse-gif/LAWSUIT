import { test, expect } from '@playwright/test';

test.describe('Citizen Journey - Legal AI Analysis', () => {
  test('should allow a citizen to analyze a consumer issue', async ({ page }) => {
    // 1. Navigate to landing page
    await page.goto('/');

    // 2. Accept Cookie Banner (if present)
    const acceptCookiesBtn = page.getByRole('button', { name: 'Accept & Continue' });
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
    }

    // 3. Navigate to Legal Assistant section
    await page.goto('/#legal-assistant');
    
    // 4. Wait for form to be visible
    await expect(page.getByRole('heading', { name: /AI Legal Assistant/i })).toBeVisible();

    // 5. Fill out the form
    await page.selectOption('select[name="matterType"]', 'consumer');
    await page.fill('input[name="state"]', 'Maharashtra');
    await page.fill('textarea[name="issue"]', 'I bought a defective laptop and the retailer refuses to provide a refund despite it being under warranty.');

    // 6. Submit the form
    const submitButton = page.getByRole('button', { name: /Analyze Legal Situation/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 7. Verify loading state appears
    await expect(page.getByText(/AI Scanning/i)).toBeVisible();

    // 8. Wait for analysis to complete and results to render
    // We expect the backend/fallback to return Consumer Protection Act
    await expect(page.getByRole('heading', { name: /Relevant Laws/i })).toBeVisible({ timeout: 10000 });
    
    // Verify specific keywords from the deterministic engine are present
    const pageText = await page.locator('body').innerText();
    expect(pageText).toContain('Consumer Protection Act');
    expect(pageText).toContain('Consumer Disputes Redressal Commission');
    expect(pageText).toContain('formal legal notice');
  });
});
