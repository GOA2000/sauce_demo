import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { config } from '../../../utils/config';

// Negative-path: locked_out_user should see an error and remain on login page
test('locked_out_user sees error on login attempt', async ({ page }) => {
  const login = new LoginPage(page);
  const expectedErrorMessage = 'Epic sadface: Sorry, this user has been locked out.';
  let landingPageURL = '';

  await test.step('Navigate to the login page', async () => {
    await login.goto();
  });

  await test.step('Save current URL', async () => {
    landingPageURL = page.url();
  });

  await test.step('Submit credentials for locked_out_user', async () => {
    const { username, password } = config.users.locked_out_user;
    await login.login(username, password);
  });

  await test.step('Verify error message is displayed', async () => {
    const error = await login.getErrorMessage();
    expect(error).toContain(expectedErrorMessage);
  });

  await test.step('Ensure URL has not changed', async () => {
    expect(page.url()).toEqual(landingPageURL);
  });
});
