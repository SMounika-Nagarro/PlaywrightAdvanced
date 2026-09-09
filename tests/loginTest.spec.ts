import { test, expect } from '../fixtures/customFixtures';
import {testData} from '../TestData/urlAndCredentials';

test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
});

test.describe("Login Tests",() =>{
test('Verify successful login with valid credentials',
    {tag: ['@smoke', '@login', '@regression'],},
    async ({ loginPage }) => {
        await loginPage.login(testData.ValidUsername,testData.ValidPassword);
        await loginPage.verifySuccessfulLogin();
    }
);

test('Verify unsuccessful login with invalid credentials',
    {tag: ['@regression', '@login'],},
    async ({ loginPage }) => {
        await loginPage.login(testData.InvalidUsername,testData.InvalidPassword);
        await expect(loginPage.errorMessage).toBeVisible({timeout: 15000});
    }
);
});