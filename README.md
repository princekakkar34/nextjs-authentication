# Next.js Authentication

A modern, full-stack authentication system built with Next.js 16.2.9 demonstrating secure user registration, login, and session management. This project showcases essential Next.js concepts and best practices for building authentication systems.

## 📋 Project Overview

This application provides a complete authentication flow with:
- **User Registration & Login**: Secure signup and login with email/password validation
- **Session Management**: Server-side session handling using Lucia Auth
- **Password Security**: Industry-standard password hashing with crypto module
- **Protected Routes**: Route protection based on authentication state
- **Training Features**: Display training sessions to authenticated users

## 🛠 Tech Stack

### Core Framework
- **Next.js 16.2.9** - React framework for production applications
- **React 19.2.4** - JavaScript library for building user interfaces
- **TypeScript 7.0.2** - Typed JavaScript for safer code
- **React DOM 19.2.4** - React package for working with the DOM

### Authentication & Database
- **Lucia Auth 3.2.2** - Lightweight authentication library
- **@lucia-auth/adapter-sqlite 3.0.2** - SQLite adapter for Lucia
- **better-sqlite3 12.11.1** - Fast and easy SQLite3 database wrapper
- **@types/better-sqlite3 7.6.13** - TypeScript types for better-sqlite3

### Development
- **@types/node 26.1.1** - TypeScript definitions for Node.js
- **@types/react 19.2.17** - TypeScript definitions for React
- **@types/react-dom 19.2.3** - TypeScript definitions for React DOM

## 📁 Project Structure

```
nextjs-authentication/
├── app/
│   ├── layout.js                 # Root layout component
│   ├── page.tsx                  # Home page (authentication page)
│   ├── globals.css               # Global styling
│   ├── favicon.ico               # Browser tab icon
│   └── (auth)/
│       ├── layout.tsx            # Auth layout with logout button
│       └── training/
│           └── page.tsx          # Protected training page
├── components/
│   └── auth-form.tsx             # Reusable authentication form component
├── lib/
│   ├── auth.ts                   # Authentication session management
│   ├── db.ts                     # Database initialization and setup
│   ├── hash.ts                   # Password hashing and verification
│   ├── user.ts                   # User database operations
│   └── training.ts               # Training data retrieval
├── actions/
│   └── auth-actions.ts           # Server actions for auth operations
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
└── next.config.mjs               # Next.js configuration
```

## 🚀 Next.js Concepts Used

### 1. **App Router (Server Components)**
The project uses Next.js 13+ App Router with the `app/` directory structure:
- **Server Components by Default**: All components are server-rendered by default for better performance
- **Example**: `app/(auth)/training/page.tsx` - Protected training page that verifies authentication server-side

```typescript
export default async function TrainingPage() {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect('/');
  }
  // Render training sessions
}
```

### 2. **Route Groups**
The `(auth)/` folder is a Route Group - a naming convention in parentheses that doesn't add to the URL path:
- Allows grouping related routes without affecting URL structure
- Routes like `/(auth)/training` are accessible at `/training`
- Enables shared layouts for grouped routes

```
app/(auth)/layout.tsx   -> Shared header with logout for all auth routes
app/(auth)/training/page.tsx -> Accessible at /training
```

### 3. **Server Actions**
Used in `actions/auth-actions.ts` with the `'use server'` directive:
- Secure server-side functions that can be called from client components
- Handle form submissions without exposing backend logic to the client
- Examples: `signup()`, `login()`, `logout()`, `auth()`

```typescript
'use server';
export async function signup(prevState: any, formData: any) {
  // Server-side validation and user creation
}
```

### 4. **Client Components**
The `auth-form.tsx` component uses `'use client'` directive:
- Enables interactivity and browser APIs
- Uses `useActionState` hook from React 19 for form handling
- Manages form state and displays validation errors

```typescript
'use client';
import { useActionState } from 'react';

export default function AuthForm({ mode }: { mode: string }) {
  const [formState, formAction] = useActionState(auth.bind(null, mode), {});
  // Form UI and state management
}
```

### 5. **Metadata API**
Static metadata definition in layout files:
- `app/layout.js`: Root metadata
- `app/(auth)/layout.tsx`: Metadata for auth routes

```typescript
export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};
```

### 6. **Dynamic Routes with Search Parameters**
The home page uses search parameters to switch between login and signup modes:
- `/?mode=login` - Login mode
- `/?mode=signup` - Signup mode
- Handled via `searchParams` prop

```typescript
export default async function Home({ searchParams }: { searchParams: { mode: string } }) {
  const { mode } = await searchParams;
  const formMode = mode || 'login';
  return <AuthForm mode={formMode} />;
}
```

### 7. **Navigation & Redirects**
Uses `next/navigation` for client-side and server-side navigation:
- `<Link>` component for client-side navigation
- `redirect()` function for server-side redirects after actions

```typescript
import { redirect } from 'next/navigation';
redirect('/training'); // After successful login/signup

import Link from 'next/link';
<Link href="/?mode=signup">Create an account.</Link>
```

### 8. **Server-Side Data Fetching**
Async server components can directly fetch data:
- `getTrainings()` in `training/page.tsx` fetches training data
- No need for separate API routes for server-side rendering
- Better performance and security

### 9. **Next.js Cookies API**
Secure cookie management through `next/headers`:
- Server-side session cookie handling
- Used in `lib/auth.ts` for session management

```typescript
import { cookies } from 'next/headers';
const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
(await cookies()).set(cookieName, cookieValue, attributes);
```

### 10. **Path Aliases**
TypeScript path aliases configured in `tsconfig.json`:
- `@/*` maps to root directory
- Used throughout for cleaner imports

```typescript
import AuthForm from '@/components/auth-form';
import { auth } from '@/lib/auth';
import { logout } from '@/actions/auth-actions';
```

## 📄 File-by-File Breakdown

### **Root Files**

#### `package.json`
Defines project metadata, scripts, and dependencies:
- Development scripts: `dev`, `build`, `start`, `lint`
- Core dependencies for Next.js, React, authentication, and database

#### `tsconfig.json`
TypeScript configuration with:
- ES2017 target for modern JavaScript support
- Strict mode enabled for type safety
- Path aliases (`@/*`) for cleaner imports
- JSX set to `react-jsx` (new JSX transform)

#### `next.config.mjs`
Minimal Next.js configuration (uses default settings)

---

### **App Directory**

#### `app/layout.js`
**Root Layout Component**
- Wraps entire application
- Sets global metadata (title, description)
- Imports global CSS (`globals.css`)
- Provides HTML structure

```javascript
export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Next.js Concepts**: Server component, metadata, nested layouts

---

#### `app/page.tsx`
**Home Page - Authentication Gateway**
- Server component that handles login/signup mode
- Reads `mode` search parameter from URL
- Renders `AuthForm` component with appropriate mode
- Default mode is "login"

```typescript
export default async function Home({ searchParams }: { searchParams: { mode: string } }) {
  const { mode } = await searchParams;
  const formMode = mode || 'login';
  return <AuthForm mode={formMode} />;
}
```

**Next.js Concepts**: Dynamic routes, search parameters, async components

---

#### `app/(auth)/layout.tsx`
**Authentication Layout - Protected Routes Container**
- Route group layout that wraps authenticated routes
- Provides shared header with welcome message and logout button
- Logout form action directly calls server action

```typescript
export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  );
}
```

**Next.js Concepts**: Route groups, nested layouts, server actions in forms

---

#### `app/(auth)/training/page.tsx`
**Protected Training Sessions Page**
- Server component that requires authentication
- Verifies user session using `verifyAuth()`
- Redirects unauthenticated users to home
- Fetches and displays training sessions in a grid

```typescript
export default async function TrainingPage() {
  const result = await verifyAuth();
  
  if (!result.user) {
    return redirect('/');
  }
  
  const trainingSessions = getTrainings();
  
  return (
    <main>
      <h1>Find your favorite activity</h1>
      <ul id="training-sessions">
        {trainingSessions.map((training: any) => (
          <li key={training.id}>
            <img src={`/trainings/${training.image}`} alt={training.title} />
            <div>
              <h2>{training.title}</h2>
              <p>{training.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**Next.js Concepts**: Protected routes, authentication verification, server-side rendering, static rendering

---

#### `app/globals.css`
**Global Styling**
- Dark gradient background (linear-gradient from #121214 to #272629)
- Professional color scheme with purples, grays, and contrasts
- Responsive grid layout for training sessions
- Styled components for:
  - Authentication form (`#auth-form`)
  - Form errors (`#form-errors`)
  - Authentication header (`#auth-header`)
  - Training sessions list (`#training-sessions`)

---

### **Components Directory**

#### `components/auth-form.tsx`
**Reusable Authentication Form Component**
- Client component (`'use client'`) for interactivity
- Handles both login and signup modes
- Uses `useActionState` hook for form state management
- Displays validation errors from server actions
- Toggles between login/signup view with `Link` navigation

```typescript
'use client';
import { useActionState } from 'react';

export default function AuthForm({ mode }: { mode: string }) {
  const [formState, formAction] = useActionState(auth.bind(null, mode) as any, {});
  
  return (
    <form id="auth-form" action={formAction}>
      <input type="email" name="email" id="email" />
      <input type="password" name="password" id="password" />
      {(formState as any).errors && (
        <ul id="form-errors">
          {Object.keys((formState as any).errors).map((error) => (
            <li key={error}>{(formState as any).errors[error]}</li>
          ))}
        </ul>
      )}
      <button type="submit">
        {mode === 'login' ? 'Login' : 'Create Account'}
      </button>
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
```

**Next.js Concepts**: Client component, useActionState hook, server actions, form handling, dynamic content

---

### **Actions Directory**

#### `actions/auth-actions.ts`
**Server Actions for Authentication**
- File marked with `'use server'` directive
- Contains all authentication logic: signup, login, logout
- Called from client components securely
- Returns form state with validation errors

```typescript
'use server';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: any) {
  const email = formData.get('email');
  const password = formData.get('password');
  
  let errors: any = {};
  
  // Validation
  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }
  
  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  
  // Create user and session
  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id as any);
    redirect('/training');
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'It seems like an account for the chosen email already exists.',
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
```

**Functionalities**:
- **signup()**: Validates email format and password length, hashes password, creates user, establishes session
- **login()**: Verifies user exists, validates password, creates session
- **auth()**: Router function that calls signup or login based on mode
- **logout()**: Destroys session and redirects to home

**Next.js Concepts**: Server actions, form handling, error state management, redirects

---

### **Library Directory**

#### `lib/auth.ts`
**Session & Authentication Management**
- Uses Lucia Auth library for session management
- Manages authentication cookies
- Core functions:
  - `createAuthSession()`: Creates and sets session cookie
  - `verifyAuth()`: Validates session from cookie
  - `destroySession()`: Clears session on logout

```typescript
import { cookies } from 'next/headers';
import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import db from './db';

const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions',
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export async function createAuthSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function verifyAuth() {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
  
  if (!sessionCookie) {
    return { user: null, session: null };
  }
  
  const sessionId = sessionCookie.value;
  if (!sessionId) {
    return { user: null, session: null };
  }
  
  const result = await lucia.validateSession(sessionId);
  
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch { }
  
  return result;
}

export async function destroySession() {
  const { session } = await verifyAuth();
  if (!session) {
    return { error: 'Unauthorized!' };
  }
  
  await lucia.invalidateSession(session.id);
  
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
```

**Key Features**:
- Uses Lucia Auth for secure session management
- BetterSqlite3 adapter stores sessions in database
- Session cookies are HTTP-only and secure in production
- `verifyAuth()` is used to protect routes

---

#### `lib/db.ts`
**Database Initialization & Schema**
- Creates SQLite database with schema on startup
- Initializes three main tables:
  - **users**: Stores user email and hashed password
  - **sessions**: Stores session tokens and expiry
  - **trainings**: Pre-populated with training activity data

```typescript
import sql from 'better-sqlite3';

const db = sql('training.db');

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT
  );
`);

// Sessions table (Lucia Auth)
db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

// Training activities table
db.exec(`
  CREATE TABLE IF NOT EXISTS trainings (
    id INTEGER PRIMARY KEY,
    title TEXT,
    image TEXT,
    description TEXT
  );
`);

// Seed training data if empty
const hasTrainings = (db as any).prepare('SELECT COUNT(*) as count FROM trainings').get().count > 0;

if (!hasTrainings) {
  db.exec(`
    INSERT INTO trainings (title, image, description)
    VALUES
    ('Yoga', '/yoga.jpg', 'A gentle way to improve flexibility and balance.'),
    ('Boxing', '/boxing.jpg', 'A high-energy workout that improves strength and speed.'),
    ('Running', '/running.jpg', 'A great way to improve cardiovascular health and endurance.'),
    ('Weightlifting', '/weightlifting.jpg', 'A strength-building workout that helps tone muscles.'),
    ('Cycling', '/cycling.jpg', 'A low-impact workout that improves cardiovascular health and endurance.'),
    ('Gaming', '/gaming.jpg', 'A fun way to improve hand-eye coordination and reflexes.'),
    ('Sailing', '/sailing.jpg', 'A relaxing way to enjoy the outdoors and improve balance.');
  `);
}

export default db;
```

**Database Design**:
- SQLite for lightweight, serverless database
- Foreign key relationship: sessions → users
- Auto-seeds 7 training activities on first run
- Used across lib functions for data operations

---

#### `lib/hash.ts`
**Password Hashing & Verification**
- Uses Node.js `crypto` module for secure password handling
- `hashUserPassword()`: Hashes password with random salt using scrypt
- `verifyPassword()`: Compares stored hash with supplied password using timing-safe comparison

```typescript
import crypto from 'node:crypto';

export function hashUserPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return hashedPassword.toString('hex') + ':' + salt;
}

export function verifyPassword(storedPassword: string, suppliedPassword: string) {
  const [hashedPassword, salt] = storedPassword.split(':');
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
```

**Security Features**:
- **scrypt**: Industry-standard key derivation function
- **Random Salt**: 16 bytes per password for uniqueness
- **Timing-Safe Comparison**: Prevents timing attacks on password verification
- Hash format: `hash:salt` for storage

---

#### `lib/user.ts`
**User Database Operations**
- `createUser()`: Inserts new user into database
- `getUserByEmail()`: Retrieves user by email for authentication

```typescript
import db from './db';

export function createUser(email: string, password: string) {
  const result = db
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, password);
  return result.lastInsertRowid;
}

export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}
```

**Database Interactions**:
- Prepared statements for SQL injection protection
- `lastInsertRowid` returns user ID after creation
- Used by auth actions for registration and login

---

#### `lib/training.ts`
**Training Sessions Data Retrieval**
- `getTrainings()`: Fetches all training activities from database

```typescript
import db from './db';

export function getTrainings() {
  const stmt = db.prepare('SELECT * FROM trainings');
  return stmt.all();
}
```

---

## 🔐 Authentication Flow

### **1. Home Page (Public)**
- User visits `/` (home page)
- Choose login or signup via `/?mode=login` or `/?mode=signup`

### **2. Authentication Form (Client)**
- `AuthForm` component renders based on mode
- Form collects email and password
- On submit, calls server action `auth(mode)` with form data

### **3. Server Action Processing**
- `signup()`: Validates input → hashes password → creates user → creates session
- `login()`: Looks up user → verifies password → creates session
- On success: Redirects to `/training`
- On error: Returns form state with error messages

### **4. Session Management**
- Session created using Lucia Auth
- Session ID stored in HTTP-only cookie
- Cookie set with secure flag in production

### **5. Protected Route**
- `/training` page verifies session
- If no valid session: Redirects to home
- If valid session: Displays training activities and logout option

### **6. Logout**
- User clicks logout button in auth header
- Calls `logout()` server action
- Session invalidated, cookie cleared
- Redirects to home page

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/princekakkar34/nextjs-authentication.git
cd nextjs-authentication

# Install dependencies
npm install
# or
yarn install
```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

### Building for Production
```bash
npm run build
npm run start
```

## 📚 Key Next.js Concepts Demonstrated

| Concept | Location | Purpose |
|---------|----------|---------|
| **App Router** | `app/` directory | Modern routing system |
| **Route Groups** | `app/(auth)/` | Group routes without affecting URL |
| **Server Components** | All components by default | Better performance, security |
| **Client Components** | `components/auth-form.tsx` | Interactive UI and hooks |
| **Server Actions** | `actions/auth-actions.ts` | Secure backend operations |
| **Dynamic Routes** | Home page `searchParams` | Switch modes via URL |
| **Protected Routes** | `training/page.tsx` | Authentication verification |
| **Cookies API** | `lib/auth.ts` | Session management |
| **Path Aliases** | `tsconfig.json` | Clean imports with `@/` |
| **Metadata API** | Layout files | SEO and page metadata |
| **Layouts** | Root & Route Group layouts | Shared UI and structure |
| **Navigation** | `next/navigation` | Client and server redirects |

## 🔒 Security Considerations

1. **Password Hashing**: Uses scrypt algorithm with random salt
2. **Session Management**: Lucia Auth provides secure session handling
3. **Server Actions**: Keep authentication logic server-side, never expose to client
4. **Protected Routes**: Verify authentication before rendering protected pages
5. **HTTP-Only Cookies**: Sessions stored in secure HTTP-only cookies
6. **HTTPS in Production**: Secure flag enabled for cookies in production
7. **SQL Injection Prevention**: Uses prepared statements for all database queries
8. **Timing-Safe Comparison**: Prevents timing attacks on password verification

## 📝 Summary

This Next.js authentication project is a comprehensive example of building secure, modern web applications using the latest Next.js features. It demonstrates best practices for:

- User authentication and authorization
- Secure session management
- Form handling and validation
- Route protection
- Database operations
- Component composition (server and client)
- Server actions for secure operations
- File-based routing and layouts

The clean architecture makes it easy to extend with additional features like password reset, multi-factor authentication, OAuth integration, or role-based access control.
