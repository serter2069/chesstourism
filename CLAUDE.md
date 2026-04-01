# ChesTourism

## Local Development

Secrets: **Doppler** (workspace: Sergei MSP, project: `chesstourism`, config: `dev`)

```bash
doppler login      # once per machine
doppler setup --project chesstourism --config dev --no-interactive
cd api && doppler run -- npm run dev
# frontend:
npx expo start --web
```

Manage secrets:
```bash
doppler secrets --project chesstourism --config dev
doppler secrets set KEY=value --project chesstourism --config dev
```

TODO: server-side Doppler injection via GitHub Actions (requires DOPPLER_TOKEN secret).
Currently: manual `.env` at `/var/www/chesstourism/.env` on server.

International Chess Tourism Association platform.

## Stack
- Frontend: Expo (React Native web-first) with expo-router
- Backend: Express.js API in /api/
- ORM: Prisma
- DB: PostgreSQL (REMOTE ONLY on 91.98.205.156)

## URLs
- Staging: https://chesstourism.smartlaunchhub.com
- API: https://chesstourism.smartlaunchhub.com/api
- Local frontend: http://localhost:8081
- Local API: http://localhost:3811

## Development
```bash
# Frontend
npx expo start --web

# API
cd api && npm run dev
```

## Database
**No local DB.** Connect to remote PostgreSQL on 91.98.205.156.

Option 1 - Direct:
```
DATABASE_URL=postgresql://chesstourism_user:PASSWORD@91.98.205.156:5432/chesstourism_db
```
Option 2 - SSH tunnel (recommended):
```bash
ssh -L 5433:localhost:5432 root@91.98.205.156 -N &
DATABASE_URL=postgresql://chesstourism_user:PASSWORD@localhost:5433/chesstourism_db
```

## Deploy
Push to `main` -> GitHub Actions auto-deploys to server.
Push to `development` -> deploys to staging path.

## Test Credentials
Managed via Trinity: `trinity creds get chesstourism`
