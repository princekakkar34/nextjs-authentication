'use server';
import { redirect } from 'next/navigation';

import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';
import { createAuthSession, destroySession } from '@/lib/auth';

export async function signup(prevState: any, formData: any) {
  const email = formData.get('email');
  const password = formData.get('password');

  let errors: any = {};

  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id as any);
    redirect('/training');
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email:
            'It seems like an account for the chosen email already exists.',
        },
      };
    }
    throw error;
  }
}

export async function login(prevState: any, formData: any) {
  const email = formData.get('email');
  const password = formData.get('password');

  const existingUser: any = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect('/training');
}

export async function auth(mode: string, prevState: any, formData: any) {
  if (mode === 'login') {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect('/');
}