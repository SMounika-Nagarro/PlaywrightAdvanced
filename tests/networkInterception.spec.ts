import { test, expect } from '../fixtures/customFixtures';

test.describe('Network API Tests', () => {

    test(
        'Validate Employee List API request',
        {
            tag: ['@integration', '@network'],
        },
        async ({ authPimPage }) => {

            const page = authPimPage.page;

            // Wait for Employee List API response
            const employeeApiResponse = page.waitForResponse(
                response =>
                    response.request().method() === 'GET' &&
                    response.url().includes('/api/v2/pim/employees'),
                { timeout: 30000 }
            );

            // Directly navigate to Employee List
            await page.goto(new URL('/web/index.php/pim/viewEmployeeList', 'https://opensource-demo.orangehrmlive.com').toString(), {
                waitUntil: 'domcontentloaded'
            });

            // Get API response
            const response = await employeeApiResponse;

            console.log('Employee List API URL:', response.url());
            console.log('Employee List API Status:', response.status());

            // Validate API response
            expect(response.status()).toBe(200);

            // Validate response contains employee data
            const responseBody = await response.json();

            expect(responseBody).toHaveProperty('data');

            console.log('Employee List API validated successfully');
        }
    );

});

test('Mock Employee List API response', async ({ authPimPage }) => {
    const page = authPimPage.page;

    await page.route('**/api/v2/pim/employees**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [
                    {
                        empNumber: 99999,
                        employeeId: 'MOCK001',
                        firstName: 'Mock',
                        middleName: 'Test',
                        lastName: 'Employee'
                    }
                ],
                meta: {
                    total: 1
                }
            })
        });
    });

    await page.goto('/web/index.php/pim/viewEmployeeList');

    await page.waitForLoadState('domcontentloaded');

    await expect(
        page.getByText('MOCK001', { exact: true })
    ).toBeVisible({
        timeout: 15000
    });
});