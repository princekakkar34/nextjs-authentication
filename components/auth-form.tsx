'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { auth } from '@/actions/auth-actions';

export default function AuthForm({ mode }: { mode: string }) {
  const [formState, formAction] = useActionState(auth.bind(null, mode) as any, {});

  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">{mode === 'login' ? 'Login Email' : 'Signup Email'}</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {(formState as any).errors && (
        <ul id="form-errors">
          {Object.keys((formState as any).errors).map((error) => (
            <li key={error}>{(formState as any).errors[error]}</li>
          ))}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' && (
          <Link href="/?mode=signup">Create an account.</Link>
        )}
        {mode === 'signup' && (
          <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}