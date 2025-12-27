import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials missing.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed():
    subreddit = "python"
    print(f"Adding r/{subreddit} to database...")
    try:
        data = {"name": subreddit, "active": True, "added_via": "seed"}
        # Check if exists first (or rely on unique constraint fail)
        supabase.table("subreddits").upsert(data, on_conflict="name").execute()
        print(f"Success! Added r/{subreddit}.")
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed()
