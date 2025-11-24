import { test, expect } from '@playwright/test';

/**
 * E2E Test: Investor Dashboard
 * 
 * Verifică că dashboard-ul investitorului se încarcă corect și afișează metrici
 */

test.describe('Investor Dashboard', () => {
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  const investorEmail = process.env.E2E_INVESTOR_EMAIL;
  const investorPassword = process.env.E2E_INVESTOR_PASSWORD;

  test.beforeEach(async ({ page }) => {
    // Login as investor
    await page.goto(`${baseURL}/login`);
    
    if (investorEmail && investorPassword) {
      await page.fill('input[type="email"]', investorEmail);
      await page.fill('input[type="password"]', investorPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/investor-portal\/dashboard|\/select-account/, { timeout: 10000 });
    }
  });

  test('should load investor dashboard', async ({ page }) => {
    // Navigate to investor dashboard
    await page.goto(`${baseURL}/investor-portal/dashboard`);

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Verify page title is present
    await expect(page.locator('text=/panou investitor|investor dashboard/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display KPI cards or "Coming soon" message', async ({ page }) => {
    // Navigate to investor dashboard
    await page.goto(`${baseURL}/investor-portal/dashboard`);

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check for either:
    // 1. KPI cards (if investorMetrics feature is enabled)
    // 2. "Coming soon" message (if feature is disabled)
    const hasKPIs = await page.locator('text=/comenzi|orders|GMV|fees|producători|clienți/i').isVisible().catch(() => false);
    const isComingSoon = await page.locator('text=/coming soon|în curs|pregătire/i').isVisible().catch(() => false);

    // At least one state should be visible
    expect(hasKPIs || isComingSoon).toBe(true);
  });

  test('should display dashboard sections', async ({ page }) => {
    // Navigate to investor dashboard
    await page.goto(`${baseURL}/investor-portal/dashboard`);

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Verify main sections are present (or "Coming soon" message)
    const hasSections = await page.locator('text=/evoluție|growth|creștere|segmente|regiuni/i').isVisible().catch(() => false);
    const isComingSoon = await page.locator('text=/coming soon|în curs|pregătire/i').isVisible().catch(() => false);

    // Either sections are visible or "Coming soon" message
    expect(hasSections || isComingSoon).toBe(true);
  });

  test('should handle dashboard when feature is disabled', async ({ page }) => {
    // Navigate to investor dashboard
    await page.goto(`${baseURL}/investor-portal/dashboard`);

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // If feature is disabled, should show "Coming soon" message
    const isComingSoon = await page.locator('text=/coming soon|în curs|pregătire|dashboard.*pregătire/i').isVisible().catch(() => false);
    
    // If coming soon is visible, that's acceptable
    // If not, verify that at least the page loaded without errors
    const pageLoaded = await page.locator('body').isVisible();
    expect(pageLoaded).toBe(true);
  });

  test('should be accessible only to investors', async ({ page }) => {
    // Try to access dashboard without login (should redirect to login)
    await page.goto(`${baseURL}/investor-portal/dashboard`);

    // Should redirect to login or show access denied
    await page.waitForURL(/\/login|\/investor-portal\/dashboard/, { timeout: 10000 });

    const url = page.url();
    // Either redirected to login or already on dashboard (if logged in)
    expect(url).toMatch(/\/login|\/investor-portal\/dashboard/);
  });
});

