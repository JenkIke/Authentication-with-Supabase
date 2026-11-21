# Authentication with Supabase

CPRG 303 Mobile Application Development (Fall 2026), Group 1.

An Expo (React Native) app that uses Supabase Auth for sign-up, sign-in and sign-out, protects screens so only signed-in users can reach them, and reads data from Supabase tables secured with Row Level Security (RLS).

**Group 1:** _Isaac Jenkins_ _Harderick Dhillon_

## Features

- **Sign up / Sign in / Sign out** with Supabase Auth (email + password)
- **Form validation** with React Hook Form and Zod (`src/schemas/auth.ts`)
- **Loading indicators** on every auth request, and **readable error messages** for invalid credentials, weak passwords, existing accounts and network failures (`src/utils/errors.ts`)
- **Auth state shared through Context**: `AuthProvider` + `useAuth()` (`src/context/AuthProvider.tsx`)
- **Session restore on launch**: a loading screen shows while the saved session is checked, then the app routes to the right screen
- **Protected routes** with Expo Router `Stack.Protected`: signed-out users can't open Profile, and signed-in users are redirected away from Sign in / Sign up
- **Signed-in user's name** (or email) shown in the navigation bar
- **Public data** (`instruments`) shown on the Home and Sign-up screens
- **RLS-protected data** (`lessons`) shown as a list on the Profile screen, readable only when signed in

## Running the app

### Prerequisites
- A current Node.js LTS release
- The **Expo Go** app on your phone (iOS or Android), or an Android emulator / iOS simulator

### Steps
1. **Clone and install**
   ```bash
   git clone https://github.com/JenkIke/Authentication-with-Supabase.git
   cd Authentication-with-Supabase
   npm install
   ```
2. **Add your Supabase credentials.** Copy the example file, then fill in the two values (see [Supabase setup](#supabase-setup)):
   ```bash
   cp .env.example .env
   ```
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
   The `.env` file must be in the project root (next to `package.json`), and the variable names must start with `EXPO_PUBLIC_` or Expo won't load them.
3. **Start the dev server**
   ```bash
   npx expo start
   ```
   Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android). If you edit `.env` while the app is open, fully reload the app.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Get the credentials:** in **Project Settings → API Keys**, copy the **publishable** key, and copy the **Project URL** from **Project Settings → Data API**. Put both in `.env`. Never use the `secret` / `service_role` key in the app.
3. **Create the tables and RLS policies:** open **SQL Editor → New query**, paste the contents of [`supabase/setup.sql`](supabase/setup.sql), and click **Run**. The script is safe to run more than once. It creates:

   | Table | Who can read it (RLS) | Where it's shown |
   |---|---|---|
   | `instruments` | Everyone, signed in or not | Home and Sign-up screens |
   | `lessons` | Signed-in users only | Profile screen (list) |
   | `profiles` | Each user can read only their own row | Profile screen (card) |

   It also adds a trigger that creates a `profiles` row on sign-up, using the username from the form.
4. **Email confirmation (optional):** under **Authentication → Sign In / Providers → Email**, you can turn **Confirm email** off for faster testing. The app handles both settings: with it on, sign-up asks the user to confirm their email before signing in.

## Test account

| Email | Password |
|---|---|
| cprg303.tester@example.com | Group1Test!2026 |

Or create your own account on the Sign-up screen.

## Security notes

- The Supabase URL and publishable key are stored in `.env`, which is listed in `.gitignore` and never committed. `.env.example` shows the required keys with placeholder values.
- The publishable key is designed to ship inside client apps. The data is protected by the RLS policies in `supabase/setup.sql`, not by hiding the key.

## Project structure

```
src/
  app/            Screens (Expo Router file-based routes)
    _layout.tsx   AuthProvider, loading screen, protected route guards
    index.tsx     Home: links + public instruments
    sign-in.tsx   Sign-in form
    sign-up.tsx   Sign-up form + public instruments
    profile.tsx   Protected: profile card + RLS-protected lessons + sign out
  components/     FormInput, SubmitButton, FeedbackMessage, HeaderUser, SignOut,
                  PublicInstruments, ProtectedLessons
  context/        AuthProvider (session state, signIn / signUp / signOut)
  hooks/          Data fetching for instruments and lessons
  schemas/        Zod schemas for the auth forms
  utils/          Supabase client, error message mapping
supabase/
  setup.sql       Tables, RLS policies, sample data, sign-up trigger
```
