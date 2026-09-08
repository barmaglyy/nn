# buildly — Web Development Studio

Arabic/English landing page for buildly, an independent web development studio.

## Included

- RTL/LTR language toggle
- Dark glassmorphism visual system
- CSS-only geometric hero motion
- Mouse-tracked 3D card tilt with mobile/reduced-motion safeguards
- Scroll reveal animations and animated studio statistics
- Portfolio links for mall, ghawyy, elmaktab, and omar
- Responsive contact form with validation and Supabase/local persistence
- Password-protected `/admin` inbox for viewing, reading, replying to, and deleting requests
- WhatsApp, Telegram, email, LinkedIn, and GitHub actions

## Run locally

From the workspace root:

```bash
pnpm install
pnpm --filter @workspace/buildly run dev
```

## Admin inbox setup

The public form posts to `contact_messages`. The separate `/admin` page uses Supabase Auth email/password and only allows users listed in `admin_users` to read or modify requests.

1. Copy `.env.example` to `.env` and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. In Supabase, create an Auth user for the admin.
3. Run `supabase/contact_messages.sql` in the Supabase SQL Editor.
4. Uncomment the final `insert` in that SQL file, replace the admin email, and run it once.
5. Open `/admin` and log in with the Supabase Auth credentials.

If Supabase variables are not configured, the site falls back to browser-local storage so the UI can be previewed. The local demo password is `buildly-admin`; this mode is not suitable for a public deployment.