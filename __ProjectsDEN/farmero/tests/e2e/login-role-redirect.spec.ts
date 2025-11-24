import { test, expect } from '@playwright/test';

/**
 * E2E Test: Login + Role Redirect
 * 
 * Verifică că utilizatorii sunt redirecționați corect după login
 * în funcție de rolul lor (client, producer, investor).
 */

test.describe('Login and Role Redirect', () => {
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  const clientEmail = process.env.E2E_CLIENT_EMAIL;
  const clientPassword = process.env.E2E_CLIENT_PASSWORD;
  const producerEmail = process.env.E2E_PRODUCER_EMAIL;
  const producerPassword = process.env.E2E_PRODUCER_PASSWORD;
  const investorEmail = process.env.E2E_INVESTOR_EMAIL;
  const investorPassword = process.env.E2E_INVESTOR_PASSWORD;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
  });

  test('should redirect client to /account after login', async ({ page }) => {
    // Skip test if credentials are not set
    test.skip(!clientEmail || !clientPassword, 'E2E_CLIENT_EMAIL and E2E_CLIENT_PASSWORD must be set');

    // Fill login form
    await page.fill('input[type="email"]', clientEmail);
    await page.fill('input[type="password"]', clientPassword);
    
    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL(/\/account|\/select-account/, { timeout: 10000 });

    // Verify redirect
    const url = page.url();
    expect(url).toMatch(/\/account|\/select-account/);
  });

  test('should redirect producer to /producer-portal/dashboard after login', async ({ page }) => {
    // Skip test if credentials are not set
    test.skip(!producerEmail || !producerPassword, 'E2E_PRODUCER_EMAIL and E2E_PRODUCER_PASSWORD must be set');

    // Fill login form
    await page.fill('input[type="email"]', producerEmail);
    await page.fill('input[type="password"]', producerPassword);
    
    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL(/\/producer-portal\/dashboard|\/select-account/, { timeout: 10000 });

    // Verify redirect
    const url = page.url();
    expect(url).toMatch(/\/producer-portal\/dashboard|\/select-account/);
  });

  test('should redirect investor to /investor-portal/dashboard after login', async ({ page }) => {
    // Skip test if credentials are not set
    test.skip(!investorEmail || !investorPassword, 'E2E_INVESTOR_EMAIL and E2E_INVESTOR_PASSWORD must be set');

    // Fill login form
    await page.fill('input[type="email"]', investorEmail);
    await page.fill('input[type="password"]', investorPassword);
    
    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL(/\/investor-portal\/dashboard|\/select-account/, { timeout: 10000 });

    // Verify redirect
    const url = page.url();
    expect(url).toMatch(/\/investor-portal\/dashboard|\/select-account/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill login form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrong-password');
    
    // Click login button
    await page.click('button[type="submit"]');

    // Wait for error message (adjust selector based on your UI)
    await page.waitForSelector('text=/error|invalid|incorrect/i', { timeout: 5000 }).catch(() => {
      // If no error message appears, that's also a failure
      throw new Error('Expected error message for invalid credentials');
    });
  });

  test('should redirect to /select-account if user has multiple roles', async ({ page }) => {
    // This test requires a user with multiple roles
    // Skip if no multi-role test account is available
    const multiRoleEmail = process.env.E2E_MULTIROLE_EMAIL;
    const multiRolePassword = process.env.E2E_MULTIROLE_PASSWORD;
    
    test.skip(!multiRoleEmail || !multiRolePassword, 'E2E_MULTIROLE_EMAIL and E2E_MULTIROLE_PASSWORD must be set for this test');

    // Fill login form
    await page.fill('input[type="email"]', multiRoleEmail);
    await page.fill('input[type="password"]', multiRolePassword);
    
    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation to role selection
    await page.waitForURL(/\/select-account/, { timeout: 10000 });

    // Verify we're on the role selection page
    expect(page.url()).toContain('/select-account');
    
    // Verify role cards are displayed
    await expect(page.locator('text=/client|producer|business|logistics|investor/i').first()).toBeVisible();
  });
});

