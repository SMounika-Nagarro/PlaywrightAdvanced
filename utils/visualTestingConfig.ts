import { Page, Locator } from '@playwright/test';

/**
 * Common Visual Testing Patterns and Configurations
 * Provides ready-to-use visual testing templates
 */

export const VIEWPORT_SIZES = {
  DESKTOP: { width: 1920, height: 1080, name: 'desktop' },
  DESKTOP_HD: { width: 1366, height: 768, name: 'desktop-hd' },
  LAPTOP: { width: 1280, height: 720, name: 'laptop' },
  TABLET: { width: 1024, height: 768, name: 'tablet' },
  TABLET_PORTRAIT: { width: 768, height: 1024, name: 'tablet-portrait' },
  MOBILE: { width: 375, height: 667, name: 'mobile' },
  MOBILE_LARGE: { width: 414, height: 896, name: 'mobile-large' },
  MOBILE_XL: { width: 480, height: 853, name: 'mobile-xl' },
};

export const VISUAL_TEST_TAGS = {
  VISUAL: '@visual',
  REGRESSION: '@regression',
  ACCESSIBILITY: '@accessibility',
  A11Y: '@a11y',
  CROSS_BROWSER: '@cross-browser',
  RESPONSIVE: '@responsive',
  MOBILE: '@mobile',
  TABLET: '@tablet',
  INTERACTIVE: '@interactive',
  STATES: '@states',
  ELEMENTS: '@elements',
  FORM: '@form',
  ERROR: '@error',
  CRITICAL: '@critical',
  SMOKE: '@smoke',
};

export const SNAPSHOT_OPTIONS = {
  STRICT: {
    maxDiffPixels: 0,
    threshold: 0,
  },
  LENIENT: {
    maxDiffPixels: 100,
    threshold: 0.2,
  },
  MODERATE: {
    maxDiffPixels: 50,
    threshold: 0.1,
  },
  VERY_LENIENT: {
    maxDiffPixels: 200,
    threshold: 0.3,
  },
};

/**
 * Common UI States for Visual Testing
 */
export const UI_STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  FOCUS: 'focus',
  DISABLED: 'disabled',
  ACTIVE: 'active',
  ERROR: 'error',
  SUCCESS: 'success',
  LOADING: 'loading',
} as const;

/**
 * Visual Testing Delay Helpers
 * Use appropriate delays to ensure UI has settled
 */
export const VISUAL_DELAYS = {
  ANIMATION_SETTLE: 300, // Wait for animations to complete
  RENDER_SETTLE: 500, // Wait for rendering to complete
  NETWORK_SETTLE: 1000, // Wait for network requests
  FULL_LOAD: 2000, // Full page load
};

/**
 * Helpers for Common Visual Test Scenarios
 */

/**
 * Wait for page to be visually stable before capturing
 */
export async function waitForVisualStability(
  page: Page,
  timeout: number = VISUAL_DELAYS.RENDER_SETTLE
): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(timeout);
}

/**
 * Capture element with consistent visual state
 */
export async function captureElementWithDelay(
  element: Locator,
  delay: number = VISUAL_DELAYS.ANIMATION_SETTLE
): Promise<void> {
  await element.waitFor({ state: 'visible' });
  await element.evaluate(async () => {
    const animations = document.getAnimations();
    await Promise.all(
      animations.map((animation) => animation.finished)
    );
  });
  await element.page().waitForTimeout(delay);
}

/**
 * Generate snapshot name with browser and variant
 */
export function generateSnapshotName(
  testName: string,
  browser: string = 'chromium',
  variant?: string
): string {
  const parts = [testName, browser];
  if (variant) parts.push(variant);
  return parts.join('-').toLowerCase().replace(/\s+/g, '-');
}

/**
 * Common masked elements for various pages
 */
export const COMMON_MASKED_ELEMENTS = {
  // Dynamic timestamps
  timestamps: '.timestamp, [class*="time"], .date',
  // Auto-updating counters
  counters: '[class*="count"], .badge-count',
  // User-specific content
  userContent: '.username, .user-name, [class*="user"]',
  // Dates
  dates: '[class*="date"], .calendar',
};

/**
 * Collection of common accessibility selectors for ARIA testing
 */
export const ACCESSIBILITY_SELECTORS = {
  MAIN: 'main',
  NAV: 'nav, [role="navigation"]',
  FORM: 'form, [role="form"]',
  BUTTON: 'button, [role="button"]',
  INPUT: 'input, [role="textbox"]',
  LINK: 'a, [role="link"]',
  HEADING: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  ALERT: '[role="alert"]',
  STATUS: '[role="status"]',
  BANNER: '[role="banner"]',
  FOOTER: 'footer, [role="contentinfo"]',
};

/**
 * Visual Testing Configuration Factory
 */
export class VisualTestingConfig {
  static getStrictConfig() {
    return SNAPSHOT_OPTIONS.STRICT;
  }

  static getLenientConfig() {
    return SNAPSHOT_OPTIONS.LENIENT;
  }

  static getResponsiveViewports() {
    return [
      VIEWPORT_SIZES.DESKTOP,
      VIEWPORT_SIZES.TABLET,
      VIEWPORT_SIZES.MOBILE,
    ];
  }

  static getAllViewports() {
    return Object.values(VIEWPORT_SIZES);
  }

  static getCrossBrowserViewports() {
    return [
      VIEWPORT_SIZES.DESKTOP,
      VIEWPORT_SIZES.LAPTOP,
      VIEWPORT_SIZES.TABLET,
    ];
  }

  static getMobileViewports() {
    return [
      VIEWPORT_SIZES.MOBILE,
      VIEWPORT_SIZES.MOBILE_LARGE,
      VIEWPORT_SIZES.MOBILE_XL,
    ];
  }

  static getTabletViewports() {
    return [
      VIEWPORT_SIZES.TABLET,
      VIEWPORT_SIZES.TABLET_PORTRAIT,
    ];
  }
}

/**
 * Preset Tags for Visual Tests
 */
export class VisualTestTags {
  static getRegressionTags() {
    return [
      VISUAL_TEST_TAGS.VISUAL,
      VISUAL_TEST_TAGS.REGRESSION,
    ];
  }

  static getAccessibilityTags() {
    return [
      VISUAL_TEST_TAGS.VISUAL,
      VISUAL_TEST_TAGS.ACCESSIBILITY,
      VISUAL_TEST_TAGS.A11Y,
    ];
  }

  static getResponsiveTags() {
    return [
      VISUAL_TEST_TAGS.VISUAL,
      VISUAL_TEST_TAGS.RESPONSIVE,
    ];
  }

  static getCrossBrowserTags() {
    return [
      VISUAL_TEST_TAGS.VISUAL,
      VISUAL_TEST_TAGS.CROSS_BROWSER,
    ];
  }

  static getStateTags() {
    return [
      VISUAL_TEST_TAGS.VISUAL,
      VISUAL_TEST_TAGS.INTERACTIVE,
      VISUAL_TEST_TAGS.STATES,
    ];
  }

  static getCriticalTags() {
    return [
      VISUAL_TEST_TAGS.VISUAL,
      VISUAL_TEST_TAGS.CRITICAL,
    ];
  }
}

/**
 * Example Usage Patterns
 */
export const EXAMPLE_PATTERNS = {
  /**
   * Pattern 1: Basic Full Page Visual Test
   * ```typescript
   * test('Verify page visual consistency', async ({ loginPage }) => {
   *   await loginPage.captureLoginPageSnapshot();
   * });
   * ```
   */

  /**
   * Pattern 2: Multi-State Visual Test
   * ```typescript
   * test('Verify button states', async ({ loginPage }) => {
   *   await loginPage.captureLoginButtonStates(); // Captures default, hover, focus
   * });
   * ```
   */

  /**
   * Pattern 3: Responsive Visual Test
   * ```typescript
   * test('Verify responsive design', async ({ loginPage }) => {
   *   const viewports = [
   *     { width: 1920, height: 1080, name: 'desktop' },
   *     { width: 768, height: 1024, name: 'tablet' },
   *     { width: 375, height: 667, name: 'mobile' },
   *   ];
   *   await loginPage.visualTesting.responsiveSnapshot('login-page', viewports);
   * });
   * ```
   */

  /**
   * Pattern 4: Element-Specific Test
   * ```typescript
   * test('Verify form elements', async ({ loginPage }) => {
   *   const elements = new Map([
   *     ['username', loginPage.usernameLocator],
   *     ['password', loginPage.passwordLocator],
   *   ]);
   *   await loginPage.visualTesting.multiElementSnapshot(elements, 'form-fields');
   * });
   * ```
   */

  /**
   * Pattern 5: Accessibility Visual Test
   * ```typescript
   * test('Verify accessibility', async ({ loginPage }) => {
   *   await loginPage.captureLoginFormAriaSnapshot();
   * });
   * ```
   */
};
