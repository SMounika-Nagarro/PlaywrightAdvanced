import { test, expect } from "../fixtures/customFixtures";
import { readJsonFile } from '../utils/readJsonFile';

test.beforeEach(async ({ authPimPage }) => {
    await authPimPage.navigateToPIM();
});

const employeeData = readJsonFile('testData/employeeData.json');

employeeData.forEach((employee:any) => {
    test(`Create new employee with ${employee.firstName} ${employee.lastName}`, { tag: ["@regression", "@pim"] },
        async ({ authPimPage }) => {
            const employeePage = authPimPage;            
            await employeePage.navigateToEmployeeList();
            await employeePage.clickAddEmployee();
            await employeePage.enterEmployeeDetails(employee.firstName,employee.middleName,employee.lastName,employee.employeeId);
            await employeePage.saveEmployee();
            await employeePage.navigateToEmployeeList();
            await employeePage.searchEmployee(employee.employeeId);
            await employeePage.verifyEmployeeInList(employee.employeeId);
            await employeePage.verifyEmployeeInList(employee.employeeId);
        
    }
)})

employeeData.forEach((employee:any) => {
    test(`Delete employee created ${employee.employeeId}`,
        { tag: ["@regression", "@pim"] },
        async ({ authPimPage, page }) =>{
    const employeePage = authPimPage; 
    await employeePage.searchEmployee(employee.employeeId);
    await page.waitForLoadState('load');
    await employeePage.clickDeleteButton();
    await employeePage.confirmDelete();
    await employeePage.searchEmployee(employee.employeeId);
    await page.waitForLoadState('load');
    expect(await employeePage.getNoRecordMsg()).toContain("No Records Found");
})
  })