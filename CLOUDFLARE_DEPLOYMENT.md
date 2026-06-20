# SecureTrace Cloudflare Pages deployment

## Architecture

SecureTrace is a TanStack Start SSR application. Keep `@tanstack/react-start`, `@tanstack/react-router`, `src/router.tsx`, `src/start.ts`, and `src/server.ts` in place.

## Cloudflare Pages settings

- Build command: `npm run build`
- Build output directory: `dist/client`
- Node.js version: `22`
- Compatibility flag: `nodejs_compat`

The build also emits the SSR worker bundle under `dist/server` through Nitro's Cloudflare module preset.

## Required environment variables

Set these in Cloudflare Pages before deploying:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

If server-side privileged code is added later, configure its non-public secrets as Cloudflare runtime variables and read them only inside server handlers/functions.

## Verification checklist

1. Run `npm install`.
2. Run `npm run build`.
3. Confirm `dist/client` contains hashed assets and no production HTML references `/src/main.tsx`.
4. Confirm `dist/server` exists for SSR.
5. Deploy with the Cloudflare Pages settings above.