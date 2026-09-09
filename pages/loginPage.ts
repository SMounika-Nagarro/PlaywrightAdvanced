import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../TestData/urlAndCredentials';
import { VisualTestingUtils } from '../utils/visualTestingUtils';

export class loginPage {

    readonly page: Page;
    readonly usernameLocator: Locator;
    readonly passwordLocator: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly loginForm: Locator;
    readonly visualTesting: VisualTestingUtils;

constructor(page: Page) {
    this.page = page;
    this.usernameLocator = page.getByPlaceholder('Username');
    this.passwordLocator = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('Invalid credentials');
    this.loginForm = page.locator('form');
    this.visualTesting = new VisualTestingUtils(page);
}

async navigateToLoginPage() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
}

 async login(username:string, password:string){
        await this.usernameLocator.fill(username);
        await this.passwordLocator.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessageText(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

    async verifySuccessfulLogin() {
    await this.page.waitForURL(/\/dashboard\/index/);

    await expect(this.page).toHaveURL(/\/dashboard\/index/);
}

    /**
     * Visual Testing Methods
     */

    /**
     * Capture full login page visual snapshot
     */
    async captureLoginPageSnapshot(): Promise<void> {
        await this.visualTesting.fullPageSnapshot('login-page');
    }

    /**
     * Capture ARIA accessibility snapshot of login form
     */
    async captureLoginFormAriaSnapshot(): Promise<void> {
        await this.visualTesting.ariaSnapshot('login-form');
    }

    /**
     * Capture individual form elements
     */
    async captureFormElementsSnapshots(): Promise<void> {
        const formElements = new Map([
            ['username-input', this.usernameLocator],
            ['password-input', this.passwordLocator],
            ['login-button', this.loginButton],
        ]);

        await this.visualTesting.multiElementSnapshot(
            formElements,
            'login-form-elements'
        );
    }

    /**
     * Capture username field in different states
     */
    async captureUsernameFieldStates(): Promise<void> {
        // Default state
        await this.visualTesting.visualStateSnapshot(
            this.usernameLocator,
            'username-field',
            'default'
        );

        // Focus state
        await this.visualTesting.visualStateSnapshot(
            this.usernameLocator,
            'username-field',
            'focus'
        );

        // Hover state
        await this.visualTesting.visualStateSnapshot(
            this.usernameLocator,
            'username-field',
            'hover'
        );
    }

    /**
     * Capture password field in different states
     */
    async capturePasswordFieldStates(): Promise<void> {
        // Default state
        await this.visualTesting.visualStateSnapshot(
            this.passwordLocator,
            'password-field',
            'default'
        );

        // Focus state
        await this.visualTesting.visualStateSnapshot(
            this.passwordLocator,
            'password-field',
            'focus'
        );

        // Hover state
        await this.visualTesting.visualStateSnapshot(
            this.passwordLocator,
            'password-field',
            'hover'
        );
    }

    /**
     * Capture login button in different states
     */
    async captureLoginButtonStates(): Promise<void> {
        // Default state
        await this.visualTesting.visualStateSnapshot(
            this.loginButton,
            'login-button',
            'default'
        );

        // Hover state
        await this.visualTesting.visualStateSnapshot(
            this.loginButton,
            'login-button',
            'hover'
        );

        // Focus state
        await this.visualTesting.visualStateSnapshot(
            this.loginButton,
            'login-button',
            'focus'
        );
    }

    /**
     * Capture error message snapshot
     */
    async captureErrorMessageSnapshot(): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await this.visualTesting.elementSnapshot(
            this.errorMessage,
            'error-message'
        );
    }

    /**
     * Capture entire login form
     */
    async captureFormSnapshot(): Promise<void> {
        await this.visualTesting.elementSnapshot(
            this.loginForm,
            'login-form'
        );
    }

    /**
     * Responsive visual testing across viewports
     */
    async captureResponsiveSnapshots(): Promise<void> {
        const viewports = [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 1024, height: 768, name: 'tablet' },
            { width: 375, height: 667, name: 'mobile' },
        ];

        await this.visualTesting.responsiveSnapshot(
            'login-page-responsive',
            viewports
        );
    }

    /**
     * Cross-browser visual consistency test
     */
    async verifyCrossBrowserVisualConsistency(): Promise<void> {
        const setupPageState = async () => {
            await this.navigateToLoginPage();
        };

        await this.visualTesting.crossBrowserComparison(
            'login-page',
            setupPageState
        );
    }

    /**
     * Generate visual diff report
     */
    async generateVisualReport(): Promise<string> {
        return await this.visualTesting.generateVisualDiffReport('login-page');
    }
}