# Deployment Guide

## 1. Safety Check
The `.gitignore` file hides your `.env` files. **This is critical** so your API keys don't get pushed to the public internet.

## 2. Push to GitHub
If you haven't already pushed your code:
```bash
git init
git add .
git commit -m "Initial commit of Livewire"
git branch -M main
# Create a new repository on GitHub.com and copy the URL
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 3. Configure Secrets (For GitHub Actions)
The automation workflow (`.github/workflows/ingest.yml`) runs every 10 minutes. It needs your API keys to work.

1.  Go to your Repository on GitHub.
2.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Add each of these (copy values from your local `.env`):
    *   `SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `REDDIT_CLIENT_ID`
    *   `REDDIT_CLIENT_SECRET`
    *   `REDDIT_USER_AGENT`

*Once these are added, the "Reddit Ingestion Worker" action will turn green on the next run.*

## 4. Hosting the Frontend (Vercel)
The easiest way to host the dashboard is Vercel.

1.  Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2.  Click **"Add New Project"**.
3.  Import your `Livewire` repository.
4.  In the **"Environment Variables"** section, add the frontend keys:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  Click **Deploy**.

Your dashboard will be live at `https://livewire-yourname.vercel.app`!
