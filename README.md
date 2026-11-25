# Siya Ram Colour Works

Astro website for Siya Ram Colour Works.

## Local development

```sh
npm ci
npm run dev
```

## Deployment

The project is deployed from the `main` branch to Vercel. Push to `main` to trigger a production deployment.

## Client requests database

1. Create a Supabase project named `SiyaRamColourWorks` in the existing organization.
2. Run [`supabase/migrations/20261125153000_create_client_requests.sql`](./supabase/migrations/20261125153000_create_client_requests.sql) in the Supabase SQL Editor.
3. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` to the local environment and Vercel project settings. Use the public anon/publishable key only; never use the service-role key in the site.
4. Redeploy Vercel. New enquiry submissions are stored in `public.client_requests`.

Row-level security permits anonymous inserts only; public visitors and regular signed-in users cannot read or change stored requests. Manage and assign requests through the Supabase Dashboard, which has administrative access. The `public.assigned_client_requests` view contains assigned requests and can be exported as CSV from Supabase's Table Editor, which opens in Excel.
