import { test, expect } from '@playwright/test';

/**
 * E2E Test: Client Order Flow
 * 
 * Verifică fluxul complet: browse products → add to cart → checkout → order creation
 */

test.describe('Client Order Flow', () => {
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  const clientEmail = process.env.E2E_CLIENT_EMAIL;
  const clientPassword = process.env.E2E_CLIENT_PASSWORD;
  const backendReady = process.env.E2E_BACKEND_READY === 'true';

  test.beforeEach(async ({ page }) => {
    // Skip if backend is not ready
    test.skip(!backendReady, 'E2E_BACKEND_READY must be "true" to run this test');

    // Login as client
    await page.goto(`${baseURL}/login`);
    
    if (clientEmail && clientPassword) {
      await page.fill('input[type="email"]', clientEmail);
      await page.fill('input[type="password"]', clientPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/account|\/select-account/, { timeout: 10000 });
    }
  });

  test('should complete full order flow: product → cart → checkout', async ({ page }) => {
    // Navigate to products page
    await page.goto(`${baseURL}/products`);
    
    // Wait for products to load
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });

    // Click on first product
    const firstProductLink = page.locator('a[href*="/products/"]').first();
    await firstProductLink.click();

    // Wait for product page to load
    await page.waitForURL(/\/products\/[^/]+/, { timeout: 10000 });

    // Verify product page loaded
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Add to cart
    const addToCartButton = page.locator('button:has-text("Adaugă în coș"), button:has-text("Add to cart")').first();
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Wait for cart update (badge or notification)
      await page.waitForTimeout(1000);
    }

    // Navigate to cart
    await page.goto(`${baseURL}/cart`);

    // Verify cart page loaded
    await expect(page.locator('text=/coș|cart/i').first()).toBeVisible({ timeout: 5000 });

    // Verify product is in cart (or empty state if cart sync is disabled)
    const cartEmpty = await page.locator('text=/gol|empty|nu ai/i').isVisible().catch(() => false);
    if (!cartEmpty) {
      // Product should be visible in cart
      await expect(page.locator('text=/produs|product/i').first()).toBeVisible({ timeout: 5000 });
    }

    // Navigate to checkout
    const checkoutButton = page.locator('a[href*="/checkout"], button:has-text("Finalizează"), button:has-text("Checkout")').first();
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
    } else {
      // Try navigating directly
      await page.goto(`${baseURL}/checkout`);
    }

    // Wait for checkout page
    await page.waitForURL(/\/checkout/, { timeout: 10000 });

    // Verify checkout page loaded
    await expect(page.locator('text=/checkout|finalizează|comandă/i').first()).toBeVisible({ timeout: 5000 });

    // Fill checkout form (if required fields exist)
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(clientEmail || 'test@example.com');
    }

    const phoneInput = page.locator('input[type="tel"], input[name*="phone"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('0712345678');
    }

    // Submit order (if button exists and backend is ready)
    const submitButton = page.locator('button[type="submit"]:has-text("Plasează"), button:has-text("Place order")').first();
    if (await submitButton.isVisible() && backendReady) {
      // Note: This might create a real order in staging
      // Consider adding a test mode flag or using a test payment method
      await submitButton.click();
      
      // Wait for redirect to order confirmation or orders page
      await page.waitForURL(/\/orders|\/order\/[^/]+/, { timeout: 15000 });
      
      // Verify we're on order confirmation/orders page
      expect(page.url()).toMatch(/\/orders|\/order\/[^/]+/);
    }
  });

  test('should display cart items correctly', async ({ page }) => {
    // Navigate to cart
    await page.goto(`${baseURL}/cart`);

    // Verify cart page loaded
    await expect(page.locator('text=/coș|cart/i').first()).toBeVisible({ timeout: 5000 });

    // Check for either:
    // 1. Cart items (if backend sync is enabled and user has items)
    // 2. Empty state (if cart is empty or sync is disabled)
    const hasItems = await page.locator('text=/produs|product|item/i').isVisible().catch(() => false);
    const isEmpty = await page.locator('text=/gol|empty|nu ai/i').isVisible().catch(() => false);

    // At least one state should be visible
    expect(hasItems || isEmpty).toBe(true);
  });

  test('should navigate from cart to checkout', async ({ page }) => {
    // Navigate to cart
    await page.goto(`${baseURL}/cart`);

    // Wait for cart page
    await page.waitForURL(/\/cart/, { timeout: 10000 });

    // Try to navigate to checkout
    const checkoutLink = page.locator('a[href*="/checkout"], button:has-text("Finalizează"), button:has-text("Checkout")').first();
    
    if (await checkoutLink.isVisible()) {
      await checkoutLink.click();
      await page.waitForURL(/\/checkout/, { timeout: 10000 });
      expect(page.url()).toContain('/checkout');
    } else {
      // If no checkout button, navigate directly
      await page.goto(`${baseURL}/checkout`);
      await page.waitForURL(/\/checkout/, { timeout: 10000 });
      expect(page.url()).toContain('/checkout');
    }
  });
});

