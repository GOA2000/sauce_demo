import { test, expect } from '@playwright/test';
import { config } from '../../../utils/config';
import { LoginPage } from '../../../pages/LoginPage';

test('standard_user can log in', async ({ page }) => {
  const login = new LoginPage(page);

  await test.step('Navigate to the login page', async () => {
    await login.goto();
  });

  await test.step('Submit credentials for standard_user', async () => {
    const { username, password } = config.users.standard_user;
    await login.login(username, password);
  });

  await test.step('Verify redirection to the inventory page', async () => {
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});
