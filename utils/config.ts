import * as dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['BASE_URL', 'USER_PASSWORD'];
for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(`Missing required env var ${v} in .env`);
  }
}

type UserKey =
  | 'standard_user'
  | 'locked_out_user'
  | 'problem_user'
  | 'performance_glitch_user'
  | 'error_user'
  | 'visual_user';

export interface UserCreds {
  username: string;
  password: string;
}

const users: Record<UserKey, UserCreds> = {
  standard_user: {
    username: 'standard_user',
    password: process.env.USER_PASSWORD!,
  },
  locked_out_user: {
    username: 'locked_out_user',
    password: process.env.USER_PASSWORD!,
  },
  problem_user: {
    username: 'problem_user',
    password: process.env.USER_PASSWORD!,
  },
  performance_glitch_user: {
    username: 'performance_glitch_user',
    password: process.env.USER_PASSWORD!,
  },
  error_user: {
    username: 'error_user',
    password: process.env.USER_PASSWORD!,
  },
  visual_user: {
    username: 'visual_user',
    password: process.env.USER_PASSWORD!,
  },
};

export const config = {
  baseUrl: process.env.BASE_URL as string,
  users,
};