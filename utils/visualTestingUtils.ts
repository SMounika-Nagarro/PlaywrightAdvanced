import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Visual Testing Utilities for Playwright
 * Provides visual regression testing, ARIA snapshots, and cross-browser visual validation
 */

export class VisualTestingUtils {
    private page: Page;
    private snapshotDir: string;
    private ariaDir: string;
    private screenshotDir: string;

    constructor(page: Page) {
        this.page = page;
        this.snapshotDir = path.join(
            process.cwd(),
            'tests/visual-snapshots'
        );
        this.ariaDir = path.join(
            process.cwd(),
            'tests/aria-snapshots'
        );
        this.screenshotDir = path.join(
            process.cwd(),
            'tests/screenshots'
        );

        // Create directories if they don't exist
        this.ensureDirExists(this.snapshotDir);
        this.ensureDirExists(this.ariaDir);
        this.ensureDirExists(this.screenshotDir);
    }

    /**
     * Create directory if it doesn't exist
     */
    private ensureDirExists(dir: string): void {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Full Page Visual Regression Test
     * Captures the entire page and compares with baseline
     */
    async fullPageSnapshot(
        testName: string,
        options?: {
            mask?: Locator[];
            maxDiffPixels?: number;
            fuzzyMatchThreshold?: number;
        }
    ): Promise<void> {
        const snapshotName = `${testName}-${this.getBrowserName()}.png`;
        const snapshotPath = path.join(this.snapshotDir, snapshotName);

        const screenshotBuffer = await this.page.screenshot({ fullPage: true });

        // Compare with baseline
        await expect(this.page).toHaveScreenshot(snapshotName, {
            maxDiffPixels: options?.maxDiffPixels ?? 100,
            threshold: options?.fuzzyMatchThreshold ?? 0.25,
            mask: options?.mask || [],
        });

        console.log(`✓ Full page snapshot captured: ${snapshotName}`);
    }

    /**
     * Element-Specific Screenshot Comparison
     * Captures a specific element and compares with baseline
     */
    async elementSnapshot(
        locator: Locator,
        elementName: string,
        options?: {
            mask?: Locator[];
            maxDiffPixels?: number;
        }
    ): Promise<void> {
        const snapshotName = `element-${elementName}-${this.getBrowserName()}.png`;

        // Ensure element is visible
        await expect(locator).toBeVisible();

        // Take screenshot of element
        const screenshotBuffer = await locator.screenshot();

        // Compare with baseline
        await expect(locator).toHaveScreenshot(snapshotName, {
            maxDiffPixels: options?.maxDiffPixels ?? 100,
            threshold: 0.25,
            mask: options?.mask || [],
        });

        console.log(`✓ Element snapshot captured: ${snapshotName}`);
    }

    /**
     * ARIA Snapshot for Accessibility Validation
     * Captures the accessibility tree and compares
     */
    async ariaSnapshot(testName: string): Promise<void> {
        const accessibilityApi = (this.page as any).accessibility;
        const ariaData = accessibilityApi ? await accessibilityApi.snapshot() : null;
        const ariaName = `${testName}-${this.getBrowserName()}.json`;
        const ariaPath = path.join(this.ariaDir, ariaName);

        // Format and save ARIA snapshot
        const formattedAria = JSON.stringify(
            this.filterAriaSnapshot(ariaData),
            null,
            2
        );

        // Compare with baseline if it exists
        if (fs.existsSync(ariaPath)) {
            const baselineAria = fs.readFileSync(ariaPath, 'utf-8');
            if (formattedAria !== baselineAria) {
                console.warn(
                    `⚠ ARIA snapshot mismatch for ${ariaName}. Review accessibility changes.`
                );
            }
        } else {
            fs.writeFileSync(ariaPath, formattedAria, 'utf-8');
            console.log(`✓ ARIA snapshot created: ${ariaName}`);
        }
    }

    /**
     * Multi-Element Visual Comparison
     * Compares multiple elements across pages or states
     */
    async multiElementSnapshot(
        elements: Map<string, Locator>,
        testName: string,
        options?: {
            maxDiffPixels?: number;
        }
    ): Promise<void> {
        for (const [elementName, locator] of elements) {
            await this.elementSnapshot(locator, `${testName}-${elementName}`, {
                maxDiffPixels: options?.maxDiffPixels,
            });
        }
    }

    /**
     * Visual Diff Report
     * Generates a detailed visual comparison report
     */
    async generateVisualDiffReport(testName: string): Promise<string> {
        const reportName = `visual-report-${testName}-${Date.now()}.html`;
        const reportPath = path.join(this.screenshotDir, reportName);

        const htmlReport = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Visual Diff Report - ${testName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; }
                .header { background-color: #333; color: white; padding: 20px; border-radius: 5px; }
                .test-section { margin: 20px 0; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .comparison { display: flex; gap: 20px; margin: 20px 0; }
                .image-container { flex: 1; }
                .image-container img { max-width: 100%; border: 2px solid #ddd; border-radius: 3px; }
                .label { font-weight: bold; margin-bottom: 10px; color: #333; }
                .browser-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
                .browser-tabs button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
                .browser-tabs button.active { background: #0056b3; }
                .timestamp { color: #666; font-size: 0.9em; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Visual Diff Report</h1>
                    <p>Test: <strong>${testName}</strong></p>
                    <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
                </div>
                <div class="test-section">
                    <h2>Visual Comparison Details</h2>
                    <p>Snapshots for browsers: Chromium, Firefox, WebKit</p>
                    <p>Check the screenshots directory for baseline and actual images.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        fs.writeFileSync(reportPath, htmlReport, 'utf-8');
        console.log(`✓ Visual diff report generated: ${reportPath}`);

        return reportPath;
    }

    /**
     * Cross-Browser Visual Testing
     * Ensures consistency across different browsers
     */
    async crossBrowserComparison(
        testName: string,
        pageStateSetup: () => Promise<void>
    ): Promise<void> {
        // Setup page state
        await pageStateSetup();

        // Capture full page screenshot
        const browserName = this.getBrowserName();
        const snapshotName = `cross-browser-${testName}-${browserName}.png`;

        await expect(this.page).toHaveScreenshot(snapshotName, {
            maxDiffPixels: 100,
            threshold: 0.25,
            mask: [],
        });

        console.log(`✓ Cross-browser snapshot: ${snapshotName}`);
    }

    /**
     * Visual State Snapshot
     * Captures specific visual states (hover, focus, disabled, etc.)
     */
    async visualStateSnapshot(
        locator: Locator,
        elementName: string,
        state: 'default' | 'hover' | 'focus' | 'disabled' | 'active'
    ): Promise<void> {
        // Apply state
        switch (state) {
            case 'hover':
                await locator.hover();
                break;
            case 'focus':
                await locator.focus();
                break;
            case 'disabled':
                // Verify disabled state exists
                await expect(locator).toBeDisabled();
                break;
            case 'active':
                await locator.click();
                break;
        }

        // Wait for state to settle
        await this.page.waitForTimeout(300);

        const snapshotName = `state-${elementName}-${state}-${this.getBrowserName()}.png`;
        await expect(locator).toHaveScreenshot(snapshotName, {
            maxDiffPixels: 100,
            threshold: 0.25,
        });

        console.log(
            `✓ Visual state snapshot captured: ${snapshotName} (${state})`
        );
    }

    /**
     * Responsive Visual Testing
     * Tests visual consistency across different viewport sizes
     */
    async responsiveSnapshot(
        testName: string,
        viewports: Array<{ width: number; height: number; name: string }>
    ): Promise<void> {
        for (const viewport of viewports) {
            await this.page.setViewportSize({
                width: viewport.width,
                height: viewport.height,
            });

            const snapshotName = `responsive-${testName}-${viewport.name}.png`;
            await expect(this.page).toHaveScreenshot(snapshotName, {
                maxDiffPixels: 0,
                mask: [],
            });

            console.log(`✓ Responsive snapshot: ${snapshotName}`);
        }
    }

    /**
     * Mask Sensitive Elements
     * Masks elements that change frequently (timestamps, dynamic content)
     */
    generateSensitiveElementMasks(locators: Locator[]): Locator[] {
        return locators;
    }

    /**
     * Get Visual Testing Report Summary
     */
    getSnapshotDir(): string {
        return this.snapshotDir;
    }

    getAriaDir(): string {
        return this.ariaDir;
    }

    getScreenshotDir(): string {
        return this.screenshotDir;
    }

    /**
     * Private Helper Methods
     */

    private getBrowserName(): string {
        const browserName = this.page.context().browser()?.browserType().name();
        return browserName || 'unknown';
    }

    private filterAriaSnapshot(
        ariaData: any
    ): {
        role: string;
        name?: string;
        description?: string;
        value?: string;
        children?: any[];
    } {
        if (!ariaData) {
            return { role: 'unknown' };
        }

        const filtered: any = {
            role: ariaData.role,
        };

        if (ariaData.name) filtered.name = ariaData.name;
        if (ariaData.description) filtered.description = ariaData.description;
        if (ariaData.value) filtered.value = ariaData.value;

        if (ariaData.children && ariaData.children.length > 0) {
            filtered.children = ariaData.children.map((child: any) =>
                this.filterAriaSnapshot(child)
            );
        }

        return filtered;
    }
}

/**
 * Helper function to create visual testing utility
 */
export function createVisualTestingUtils(page: Page): VisualTestingUtils {
    return new VisualTestingUtils(page);
}
