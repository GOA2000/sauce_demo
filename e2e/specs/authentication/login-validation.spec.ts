import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { config } from '../../../utils/config';

test.describe('Login validation errors', () => {
    const missingUsernameErrorMsg = 'Epic sadface: Username is required'
    const noPasswordErrorMsg = 'Epic sadface: Password is required'
    const invalidCredentialsErrorMsg = 'Epic sadface: Username and password do not match any user in this service'

    test('both username and password empty', async ({ page }) => {
        const login = new LoginPage(page);
        let preRedirectUrl = ''

        await test.step('Navigate to the login page', async () => {
            await login.goto();
        });

        await test.step('Save current URL', async () => {
            preRedirectUrl = page.url();
        });

        await test.step('Submit empty credentials', async () => {
            await login.login('', '');
        });

        await test.step('Verify username required error', async () => {
            const error = await login.getErrorMessage();
            expect(error).toContain(missingUsernameErrorMsg);
        });

        await test.step('Ensure still on login page', async () => {
            expect(page.url()).toEqual(preRedirectUrl);
        });
    });


    test('username empty only', async ({ page }) => {
        const login = new LoginPage(page);
        let preRedirectUrl = ''

        await test.step('Navigate to the login page', async () => {
            await login.goto();
        });

        await test.step('Save current URL', async () => {
            preRedirectUrl = page.url();
        });

        await test.step('Submit empty username', async () => {
            const { password } = config.users.standard_user;
            await login.login('', password);
        });

        await test.step('Verify username required error', async () => {
            const error = await login.getErrorMessage();
            expect(error).toContain(missingUsernameErrorMsg);
        });

        await test.step('Ensure still on login page', async () => {
            expect(page.url()).toEqual(preRedirectUrl);
        });
    });


    test('password empty only', async ({ page }) => {
        const login = new LoginPage(page);

        let preRedirectUrl = ''

        await test.step('Navigate to the login page', async () => {
            await login.goto();
        });

        await test.step('Save current URL', async () => {
            preRedirectUrl = page.url();
        });

        await test.step('Submit empty password', async () => {
            const { username } = config.users.standard_user;
            await login.login(username, '');
        });

        await test.step('Verify password required error', async () => {
            const error = await login.getErrorMessage();
            expect(error).toContain(noPasswordErrorMsg);
        });

        await test.step('Ensure still on login page', async () => {
            expect(page.url()).toEqual(preRedirectUrl);
        });
    });


    test('non existing credentials', async ({ page }) => {
        const login = new LoginPage(page);
        let preRedirectUrl = '';

        await test.step('Navigate to the login page', async () => {
            await login.goto();
        });

        await test.step('Save current URL', async () => {
            preRedirectUrl = page.url();
        });

        await test.step('Submit invalid credentials', async () => {
            await login.login('invalid_user', 'wrong_password');
        });

        await test.step('Verify credential mismatch error', async () => {
            const error = await login.getErrorMessage();
            expect(error).toContain(invalidCredentialsErrorMsg);
        });

        await test.step('Ensure still on login page', async () => {
            expect(page.url()).toEqual(preRedirectUrl);
        });
    });


    test('username and password with whitespace', async ({ page }) => {
        const login = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await login.goto();
        });

        await test.step('Submit whitespace credentials', async () => {
            const { username, password } = config.users.standard_user;
            await login.login(` ${username} `, ` ${password} `);
        });

        await test.step('Verify whitespace credentials are handled', async () => {
            expect(page.url()).toMatch(/\/inventory\.html$/);
        });
    });

    test('case sensitivity for username', async ({ page }) => {
        const login = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await login.goto();
        });

        await test.step('Submit uppercase username', async () => {
            const { username, password } = config.users.standard_user;
            await login.login(username.toUpperCase(), password);
        });

        await test.step('Verify case-sensitivity error', async () => {
            const error = await login.getErrorMessage();
            expect(error).toContain(invalidCredentialsErrorMsg);
        });
    });

    test('reject XSS in username field', async ({ page }) => {
        const login = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await login.goto();
        });

        await test.step('Submit XSS payload', async () => {
            const xssPayload = "<script>alert('xss')</script>";
            await login.login(xssPayload, config.users.standard_user.password);
        });

        await test.step('Verify XSS is rejected', async () => {
            const error = await login.getErrorMessage();
            expect(error).toContain(invalidCredentialsErrorMsg);
        });
    });

});
