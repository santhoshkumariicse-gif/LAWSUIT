# LawGuide AI

LawGuide AI is a next-generation AI legal assistant tailored for Indian Law.

## Configuration & Environment Security (Phase 1)

This application uses strictly validated environment variables to ensure it boots securely. If any required variables are missing or malformed, the application will **fail to start** immediately to prevent insecure defaults.

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and populate the required secrets:
   - `NODE_ENV`: Should be `development`, `testing`, `staging`, or `production`.
   - `NEXTAUTH_SECRET`: Generate a secure random string (e.g., `openssl rand -base64 32`). **Never use defaults in production.**
   - `NEXTAUTH_URL`: The canonical URL of your deployment (e.g., `http://localhost:3000`).
   - `DATABASE_URL`: The connection string for your database.
   - `GEMINI_API_KEY`: Procured from Google AI Studio.
   - `SENTRY_DSN`: Your Sentry error tracking URL.

3. Run the development server:
   ```bash
   npm run dev
   ```

### Security Notes

- **Log Scrubbing**: The structured logger (`src/lib/logger.ts`) automatically scrubs sensitive keys (passwords, tokens, secrets) from console outputs and telemetry to prevent data leaks.
- **Fail-Fast Validation**: Environment parsing happens via Zod in `src/lib/env.ts`.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
