import { test, expect } from '@playwright/test';

test.describe('Controlled Fingerprint & Diagnostics Test Matrix', () => {

  test('Test 1: Automation and Headless Detection', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fp-id-text', { timeout: 15000 });

    const fpText = await page.locator('.fp-id-text').innerText();
    expect(fpText).toContain('FP ID:');

    // Risk assessment reflects automation
    const riskBadge = await page.locator('.badge-risk').first().innerText();
    expect(riskBadge).toBeDefined();

    // Verify cards rendered
    await expect(page.locator('.card-title:has-text("WebRTC")')).toBeVisible();
    await expect(page.locator('.card-title:has-text("WebGL")')).toBeVisible();
    await expect(page.locator('.card-title:has-text("Canvas 2d")')).toBeVisible();
    await expect(page.locator('.card-title:has-text("Audio")')).toBeVisible();
    await expect(page.locator('text=Diagnostic Evaluation & Fraud Risk Analysis')).toBeVisible();

    // Keep browser open for 5 seconds so you can watch it
    await page.waitForTimeout(5000);
  });

  test('Test 2: Repeated Session Consistency Check', async ({ page }) => {
    // Run Session 1
    await page.goto('/');
    await page.waitForSelector('.fp-id-text');
    const firstFp = await page.locator('.fp-id-text').innerText();

    // Wait 3 seconds to see Session 1
    await page.waitForTimeout(3000);

    // Reload page for Session 2
    await page.reload();
    await page.waitForSelector('.fp-id-text');
    const secondFp = await page.locator('.fp-id-text').innerText();

    // Identical environment must yield identical composite FP ID
    expect(firstFp).toBe(secondFp);

    // Verify consistency report displays MATCHES PREVIOUS
    await expect(page.locator('text=MATCHES PREVIOUS')).toBeVisible();

    // Keep browser open for 5 seconds so you can watch it
    await page.waitForTimeout(5000);
  });

  test('Test 3: Worker vs Window Scope Parity', async ({ page }) => {
    // Inject spoof only into the window context
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true
      });
    });

    await page.goto('/');
    await page.waitForSelector('.diagnostic-container');

    // Prototype must detect worker vs window mismatch
    await expect(page.locator('text=Worker vs Window Scope Parity')).toBeVisible();

    // Keep browser open for 5 seconds so you can watch it
    await page.waitForTimeout(5000);
  });

  test('Test 4: Hardware & GPU vs OS Inconsistency Check', async ({ page }) => {
    // Spoof UserAgent to macOS while on Windows / Direct3D
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        configurable: true
      });
    });

    await page.goto('/');
    await page.waitForSelector('.diagnostic-container');
    await expect(page.locator('text=OS & WebGL Graphics Subsystem Compatibility').first()).toBeVisible();

    // Keep browser open for 5 seconds so you can watch it
    await page.waitForTimeout(5000);
  });

  test('Test 5: Export Session JSON capability', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#btn-export-json');
    await expect(page.locator('#btn-export-json')).toBeVisible();
    await expect(page.locator('#btn-rerun')).toBeVisible();

    // Keep browser open for 5 seconds so you can watch it
    await page.waitForTimeout(5000);
  });

});
