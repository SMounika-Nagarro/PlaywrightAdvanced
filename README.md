# Playwright Advanced Automation Framework

This project is a Playwright + TypeScript test automation framework for the OrangeHRM demo application. It demonstrates advanced end-to-end testing patterns such as Page Object Model (POM), custom fixtures, API/network validation, and visual regression testing across multiple browsers.

## Overview

The suite covers:

- Login flow validation
- Employee creation and deletion scenarios
- API response validation for employee list endpoints
- Network interception and mocked API responses
- Visual snapshot testing for login page and form states
- Cross-browser execution on Chromium, Firefox, and WebKit

## Tech Stack

- Playwright
- TypeScript
- Node.js
- HTML + JSON reporters
- Page Object Model pattern

## Project Structure

```text
Playwright_Advance/
├── fixtures/
│   └── customFixtures.ts
├── pages/
│   ├── loginPage.ts
│   └── pimPage.ts
├── tests/
│   ├── aria-snapshots/
│   ├── screenshots/
│   ├── visual-snapshots/
│   ├── employeeTest.spec.ts
│   ├── loginTest.spec.ts
│   └── networkInterception.spec.ts
├── TestData/
│   ├── employeeData.json
│   └── urlAndCredentials.ts
├── utils/
│   ├── readJsonFile.ts
│   ├── visualTestingConfig.ts
│   └── visualTestingUtils.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── playwright-report/
├── test-results/
└── README.md
```

## Prerequisites

- Node.js 18+ recommended
- npm
- Playwright browser binaries installed

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

If needed on Linux or CI environments:

```bash
npx playwright install --with-deps
```

## Configuration

The framework configuration is defined in `playwright.config.ts`.

Key settings:

- Base URL: `https://opensource-demo.orangehrmlive.com`
- Default test timeout: 90 seconds
- Parallel execution enabled
- Browser projects: Chromium, Firefox, WebKit
- Reports: HTML + list + JSON
- Screenshots captured only on failure
- Trace captured on first retry

## Running Tests

Run the full suite:

```bash
npm test
```

Run in UI mode:

```bash
npm run test:ui
```

Run in headed mode:

```bash
npm run test:headed
```

Run in debug mode:

```bash
npm run test:debug
```

Run only login tests:

```bash
npm run test:login
```

Run only employee/PIM tests:

```bash
npm run test:pim
```

Run a specific test file:

```bash
npx playwright test tests/loginTest.spec.ts
```

Run a specific browser project:

```bash
npx playwright test --project=chromium
```

Run tests matching a tag or name:

```bash
npx playwright test -g "Verify successful login with valid credentials"
```

## Test Coverage

### Login tests
File: `tests/loginTest.spec.ts`

Covers:

- Valid login flow
- Invalid credentials handling
- Page object interaction with login form

### Employee (PIM) tests
File: `tests/employeeTest.spec.ts`

Covers:

- Navigate to PIM section
- Add employee
- Save employee details
- Search employee by employee ID
- Verify employee appears in the table
- Delete employee and confirm no records found

### Network/API tests
File: `tests/networkInterception.spec.ts`

Covers:

- Validating employee list API responses
- Mocking API responses to test UI behavior with fake data

### Visual testing
Files and utilities under `tests/visual-snapshots/`, `tests/aria-snapshots/`, and `tests/screenshots/` plus `utils/visualTestingUtils.ts`

Covers:

- Full-page snapshots
- Element-level screenshots
- ARIA accessibility snapshots
- Form state snapshots (default, focus, hover)
- Responsive snapshots
- Cross-browser visual checks

## Page Object Model Pattern

The framework uses reusable page objects to keep tests readable and maintainable:

- `pages/loginPage.ts`
- `pages/pimPage.ts`

Custom Playwright fixtures are defined in:

- `fixtures/customFixtures.ts`

This centralizes setup such as authenticated PIM access and reusable page objects.

## Report Generation

Generate and open the HTML report:

```bash
npm run test:report
```

The report is generated in the `playwright-report/` folder.

## Notes

- The project uses the OrangeHRM demo site for E2E validation.
- Test data is stored in `TestData/` and loaded as needed.
- Visual testing artifacts are stored under `tests/visual-snapshots/`, `tests/aria-snapshots/`, and `tests/screenshots/`.

## Useful Commands

```bash
npm test
npm run test:login
npm run test:pim
npm run test:ui
npm run test:debug
npm run test:report
npx playwright test --project=chromium --headed
```

## License

This project is currently licensed as `ISC` in `package.json`.
