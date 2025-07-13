import * as dotenv from 'dotenv';

dotenv.config();

const requiredVars = [
  'BASE_URL',
  'STANDARD_USER_USERNAME',
  'STANDARD_USER_PASSWORD',
  'LOCKED_OUT_USER_USERNAME',
  'LOCKED_OUT_USER_PASSWORD',
];
for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(`Missing required env var ${v} in .env`);
  }
}

export const config = {
  baseUrl: process.env.BASE_URL as string,
  users: {
    standard_user: {
      username: process.env.STANDARD_USER_USERNAME as string,
      password: process.env.STANDARD_USER_PASSWORD as string,
    },
    locked_out_user: {
      username: process.env.LOCKED_OUT_USER_USERNAME as string,
      password: process.env.LOCKED_OUT_USER_PASSWORD as string,
    },
  }
};
