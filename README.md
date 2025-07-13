# SauceDemo Test Automation Framework

This repository contains a Playwright‑based test automation framework for the Sauce Demo e‑commerce site (https://www.saucedemo.com).

## Folder Structure

```
.
├── e2e
│   └── specs
│       ├── authentication
│       ├── cart
│       ├── checkout
│       ├── header-nav
│       └── products
├── documentation
├── fixtures
├── helpers
├── pages
│   └── logged-in
│       └── shared
├── playwright-report
│   ├── data
│   └── trace
│       └── assets
├── test-results
├── tests-examples
└── utils
```

## 1. Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v22.17.0 (or latest LTS)  
- npm  
- Git  

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to lock your Node version:
> ```bash
> nvm install 22.17.0 && nvm use 22.17.0
> ```

### Clone & Install

```bash
git clone https://github.com/GOA2000/sauce_demo
cd sauce_demo

# Install dependencies
npm ci

# Ensure Playwright browsers are installed
npx playwright install --with-deps
```

### Dotenv

We load environment variables via `dotenv`. Install it if it’s not already in your `package.json`:

```bash
npm install dotenv
```

### Environment Variables

Copy the example and fill in credentials:

```bash
cp .env.example .env
```

```dotenv
BASE_URL=https://www.saucedemo.com

STANDARD_USER_USERNAME=standard_user
STANDARD_USER_PASSWORD=xxxxxxxxxx

LOCKED_OUT_USER_USERNAME=locked_out_user
LOCKED_OUT_USER_PASSWORD=xxxxxxxxx
```

> **Note:** We commit `.env.example` but never `.env` to keep secrets out of source control.

### NPM Scripts

Add these to your `package.json`:

```json
"scripts": {
  "test": "playwright test",
  "format": "prettier --write "**/*.{ts,js,css,md}"",
  "format:check": "prettier --check "**/*.{ts,js,css,md}""
}
```

- `npm run format` will auto‑format code.  
- `npm run format:check` will verify formatting.  

---

## 2. Folder Purpose

- **`e2e/specs/…`**: Test suites by feature.  
- **`fixtures/`**: Static test data (e.g. checkout user payloads).  
- **`helpers/`**: High‑level flows combining POM calls.  
- **`pages/`**: POM classes — selectors + atomic actions.  
- **`utils/`**: Generic utilities (e.g. `config.ts`).  
- **`playwright-report/` & `test-results/`**: Generated HTML & JUnit reports. 
- **`documentation/`**: Test-cases mostly covered by this automation framework 

---

## 3. Configuration

**`playwright.config.ts`** 
Project is currently enabled only for Chrome but unlocking other browsers should
be done via the configs which are currently disabled

 defines:

```ts
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['github'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: true,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});

```

---

## 4. Test Architecture & Patterns

1. **Page‑Object Model**: `pages/*` wrap selectors and low‑level actions.  
2. **Helpers**: `helpers/*` orchestrate POM calls into business flows.  
3. **Custom Fixtures**: Extend Playwright’s `test` with credentials injection.  
4. **Data‑Driven**: `fixtures/*` supplies payloads for positive/negative tests.

---

## 5. Test Data Management

- Credentials via `.env` → `utils/config.ts`.  
- Scenario data in `fixtures/`.

---

## 6. Reporting

- **Console**: `list`  
- **HTML**: `playwright-report/`  
- **JUnit XML**: `test-results/results.xml`  
- **GitHub Annotations**: `github`

---

## 7. CI/CD Pipeline

**`.github/workflows/playwright.yml`** installs Node, Playwright, runs tests, and uploads artifacts:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: ${{ always() }}
        with:
          name: playwright-html-report
          path: playwright-report/
      - uses: actions/upload-artifact@v4
        if: ${{ always() }}
        with:
          name: junit-results
          path: test-results/results.xml
```

---

## 8. Assumptions & Limitations

- **Browsers**: Desktop Chrome (`chromium`) only.  
- **Headless**: Off by default for easier debugging.  
- **Isolation**: Fresh session per spec.  
- **Scope**: Authentication, products, cart, checkout, and burger menu.  
- **Linting/Type‑Checking**: Not configured—consider adding ESLint or TypeScript strict flags for unused‑code detection.
