# Render Demo Deploy

This setup is aimed at an interview demo, not full production hardening.

## What to deploy

- Deploy the repo as a Render Web Service
- Use the included `Dockerfile`
- Use MongoDB Atlas for `DB_URL`
- The included `render.yaml` tells Render this is a Docker web service and uses `/health` to check if the app is running

## Environment variables

Create environment variables in Render using values based on `.env.example`.

Required:

- `NODE_ENV=production`
- `PORT=8080`
- `DB_URL=...`
- `JWT_SECRET=...`
- `JWT_FILE_SECRET=...`
- `SERVER=https://your-render-service.onrender.com`

Optional for email and payments:

- `SMTP_EMAIL=...`
- `SMTP_PASSWORD=...`
- `RAZORPAY_KEY_ID=...`
- `RAZORPAY_KEY_SECRET=...`
- `RAZORPAY_WEBHOOK_SECRET=...`

## Deploy steps

1. Push this repo to GitHub.
2. Create a new Render Web Service from the repo.
3. Render will detect `render.yaml` and the `Dockerfile`.
4. Add the environment variables.
5. Deploy the service.

What each deployment file does:

- `Dockerfile`: builds the app into a container Render can run
- `.dockerignore`: keeps unnecessary files out of the Docker build context
- `.env.example`: shows which environment variables Render needs
- `render.yaml`: stores Render service settings in the repo
- `/health`: gives Render a simple endpoint to verify the app is alive
- `scripts/prepare-storage.mjs`: recreates bundled demo files before the app starts
- `scripts/seed-demo.mjs`: inserts demo plans, a demo user, and sample file metadata into MongoDB

## Seed demo data

Run this locally once after pointing `.env` to your MongoDB Atlas database:

```bash
npm run seed:demo
```

That creates:

- starter, pro, and corporate plans
- a demo user
- two sample files

The app startup also recreates those two sample files inside `storage/files` on the Render instance so the seeded file records continue to work after deployment.

Demo login:

- `demo@sharekit.app`
- `Demo@12345`

## Before the interview

1. Open the deployed site once and log in with the demo user.
2. Confirm the sample files appear in the files page.
3. Upload one fresh file yourself to verify real-time upload is working.
4. Do not redeploy right before the interview unless necessary.

## Demo note

This app currently stores uploads on the service filesystem. That is acceptable for a short interview demo, but uploaded files may disappear after a redeploy or restart on Render.
