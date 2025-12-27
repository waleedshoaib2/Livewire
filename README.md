# Livewire ⚡
**Reddit Lead Monitor & Alert System**

Livewire is a real-time monitoring system designed to spot freelance leads, job postings, and help requests on Reddit. It filters posts using advanced Regex patterns and sends instant alerts to Discord, ensuring you never miss an opportunity.

## 🚀 Features
- **Real-time Monitoring**: Checks selected subreddits every few minutes.
- **Smart Filtering**:
    - **Time Window**: Ignores posts older than 10 minutes.
    - **Advanced Regex**: Detects "Intent" (Hiring, Looking for, Budget) + "Target" (Developer, API, Bot) to reduce noise.
- **Discord Integration**:
    - Instant notifications with rich embeds.
    - Slash commands (`/addsub`, `/removesub`, `/listsubs`) to manage sources directly from Discord.
- **Web Dashboard**:
    - Next.js + Tailwind CSS UI to view and manage leads.
    - "Mark as Responded" tracking.
- **Cloud Database**: Powered by Supabase (PostgreSQL).

## 🛠️ Tech Stack
- **Backend / Worker**: Python, PRAW (Reddit API)
- **Database**: Supabase
- **Bot**: Discord.py (Slash Commands)
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Deployment**: GitHub Actions (Cron), Vercel (Frontend)

## 📦 Setup & Installation

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Supabase Project
- Reddit App (Script type)
- Discord Bot Token

### 2. Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/livewire.git
cd livewire

# Install Python deps
pip install -r requirements.txt

# Install Frontend deps
cd frontend
npm install
```

### 3. Configuration
Rename `.env.example` to `.env` and fill in your keys.
Rename `frontend/env_example.txt` to `frontend/.env.local` and fill in Supabase keys.

### 4. Running Locally
**Terminal 1 (Discord Bot):**
```bash
python bot/discord_bot.py
```

**Terminal 2 (Reddit Ingestion):**
```bash
python worker/ingest.py
```

**Terminal 3 (Dashboard):**
```bash
cd frontend
npm run dev
```

## ☁️ Deployment
This project is configured for **GitHub Actions** to handle the ingestion worker automatically.

See [DEPLOYMENT_GUIDE.md](deployment_guide.md) for detailed instructions on how to push to GitHub and configure secrets.

## 📄 License
MIT
