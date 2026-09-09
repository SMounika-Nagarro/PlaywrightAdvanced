import { Page, Locator, expect } from '@playwright/test';

export class pimPage {

    readonly page: Page;

    readonly pimLink: Locator;
    readonly addEmployeeLink: Locator;

    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;

    readonly saveButton: Locator;
    readonly savePersonalDetailsButton: Locator;

    readonly employeeNameSearch: Locator;
    readonly employeeIdSearch: Locator;
    readonly searchButton: Locator;
    readonly employeeListLink: Locator;

    readonly personalDetailsFirstNameInput: Locator;

    readonly deleteIcon:Locator;
    readonly yesDelete:Locator;
    readonly noRecordMsg:Locator;


    constructor(page: Page) {

        this.page = page;

        // PIM
        this.pimLink = page.getByRole('link', { name: 'PIM' });

        // Add Employee
        this.addEmployeeLink = page.getByRole('link', { name: 'Add Employee' });

        // Add Employee form
        this.firstNameInput = page.getByPlaceholder('First Name').first();
        this.personalDetailsFirstNameInput = page
            .locator('input[name="firstName"]:visible')
            .last();
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');

        this.employeeIdInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Employee Id' })
            .locator('input');

        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.savePersonalDetailsButton = page.getByRole('button', { name: 'Save' });
        this.employeeNameSearch = page.getByRole('textbox', { name: 'Employee Name' });
        this.employeeIdSearch = page.locator('.oxd-input-group')
            .filter({ hasText: 'Employee Id' })
            .locator('input');

        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.employeeListLink = page.getByRole('link', { name: 'Employee List' });
        this.deleteIcon = page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
        this.yesDelete = page.getByRole('button', { name: ' Yes, Delete' });
        this.noRecordMsg = page.locator('span').getByText('No Records Found');
    }

    async clickDeleteButton(){
        await this.deleteIcon.click()
    }

    async confirmDelete(){
        await this.yesDelete.click();
    }

    async getNoRecordMsg(){
        return await this.noRecordMsg.innerText();
    }

    async navigateToPIM() {

        await this.pimLink.click();

        await expect(
            this.page.getByText('Employee Information', { exact: true })
        ).toBeVisible({ timeout: 10000 });
    }

    async clickAddEmployee() {
        await this.addEmployeeLink.click();

        await this.page.waitForURL(
            /\/pim\/addEmployee/,
            { timeout: 30000 }
        );

        const firstNameField = this.page.locator(
            'input[name="firstName"][placeholder="First Name"]'
        ).first();

        await firstNameField.waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async enterEmployeeDetails(
        firstName: string,
        middleName: string,
        lastName: string,
        employeeId: string
    ) {

        await this.firstNameInput.fill(firstName);
        await this.middleNameInput.fill(middleName);
        await this.lastNameInput.fill(lastName);
        await this.employeeIdInput.fill(employeeId);
    }

    async saveEmployee() {
        const createResponsePromise = this.page.waitForResponse(
            response =>
                response.request().method() === 'POST' &&
                response.url().includes('/api/v2/pim/employees'),
            { timeout: 30000 }
        );

        await this.saveButton.click();

        const createResponse = await createResponsePromise;
        const createBody = await createResponse.json();

        await expect(createResponse.status()).toBe(200);
        await expect(this.personalDetailsFirstNameInput).toBeVisible({ timeout: 30000 });

        console.log('Employee created successfully', createBody);
    }

    async navigateToEmployeeList() {
        await expect(this.employeeListLink).toBeVisible({ timeout: 30000 });
        await this.employeeListLink.click();
        await this.page.waitForURL(/\/pim\/viewEmployeeList/, { timeout: 30000 });
        await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/, { timeout: 15000 });
    }

    async searchEmployee(employeeId: string) {
        await this.employeeIdSearch.waitFor({ state: 'visible', timeout: 15000 });
        await this.employeeIdSearch.fill(employeeId);
        await expect(this.employeeIdSearch).toHaveValue(employeeId);

        const loader = this.page.locator('.oxd-form-loader');

        for (let attempt = 1; attempt <= 5; attempt++) {
            const searchResponsePromise = this.page.waitForResponse(
                response =>
                    response.request().method() === 'GET' &&
                    response.url().includes('/api/v2/pim/employees') &&
                    response.url().includes(`employeeId=${employeeId}`),
                { timeout: 30000 }
            );

            await this.searchButton.click();

            const searchResponse = await searchResponsePromise;
            const responseBody = await searchResponse.json();

            await expect(searchResponse.status()).toBe(200);
            await loader.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => { });

            if (responseBody.data && responseBody.data.length > 0) {
                break;
            }

            await this.page.waitForTimeout(2000);
        }
    }

    async verifyEmployeeInList(employeeId: string) {
        const employeeIdCell = this.page.getByText(employeeId, { exact: true });
        await expect(employeeIdCell).toBeVisible({ timeout: 30000 });
    }
}