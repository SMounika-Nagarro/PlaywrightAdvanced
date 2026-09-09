import { test as base, expect } from '@playwright/test';
import { pimPage } from '../pages/pimPage';
import { loginPage } from '../pages/loginPage';
import { VisualTestingUtils } from '../utils/visualTestingUtils';
import {testData} from '../TestData/urlAndCredentials';

type Fixtures = {
    loginPage: loginPage;
    pimPage: pimPage;
    authPimPage: pimPage;
    visualTesting: VisualTestingUtils;
};

export const test = base.extend<Fixtures>({

    // Login Page fixture
    loginPage: async ({ page }, use) => {
        const login = new loginPage(page);
        await use(login);
    },

    // PIM Page fixture
    pimPage: async ({ page }, use) => {
        const pim = new pimPage(page);
        await use(pim);
    },

    // Authenticated PIM Page fixture
    authPimPage: async ({ loginPage, pimPage }, use) => {

        // Login as Admin
        await loginPage.navigateToLoginPage();
        await loginPage.login(testData.ValidUsername, testData.ValidPassword);

        // Verify login
        await loginPage.verifySuccessfulLogin();

        // Make PIM Page available to the test
        await use(pimPage);
    },

    // Visual Testing utility fixture
    visualTesting: async ({ page }, use) => {
        const visualTesting = new VisualTestingUtils(page);
        await use(visualTesting);
    },
});

export { expect };