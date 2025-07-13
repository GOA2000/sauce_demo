import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../utils/config';

function getCredentials(userKey: keyof typeof config.users) {
  return config.users[userKey];
}

async function signIn(page: Page, username: string, password: string): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}

export async function loginAs(page: Page, userKey: keyof typeof config.users) {
  const { username, password } = getCredentials(userKey);
  await signIn(page, username, password);
}

export const loginAsStandardUser = (page: Page) => loginAs(page, 'standard_user');
