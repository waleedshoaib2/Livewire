import os
import praw
from supabase import create_client, Client
from dotenv import load_dotenv
import re
import time
import requests

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "Livewire by u/your_username")
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_CHANNEL_ID = os.getenv("DISCORD_CHANNEL_ID")

def init_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not found in environment variables.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def init_reddit():
    if not REDDIT_CLIENT_ID or not REDDIT_CLIENT_SECRET:
        raise ValueError("Reddit credentials not found in environment variables.")
    return praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT
    )

def fetch_active_subreddits(supabase: Client):
    response = supabase.table("subreddits").select("name").eq("active", True).execute()
    # Sanitize names just in case 'r/' is in the DB
    return [row["name"].replace("r/", "").strip() for row in response.data]

def send_discord_notification(post_data):
    if not DISCORD_TOKEN or not DISCORD_CHANNEL_ID:
        print("❌ Discord credentials missing. Skipping notification.")
        return False

    url = f"https://discord.com/api/v10/channels/{DISCORD_CHANNEL_ID}/messages"
    headers = {
        "Authorization": f"Bot {DISCORD_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Create Embed
    embed = {
        "title": post_data["title"],
        "url": post_data["url"],
        "description": post_data["body"][:200] + "...",
        "color": 0xFF5733, # Orange
        "author": {
            "name": f"r/{post_data['subreddit']} • u/{post_data['author']}"
        },
        "fields": [
            {"name": "Keywords", "value": ", ".join(post_data["matched_keywords"]), "inline": True},
            {"name": "Score", "value": str(post_data["score"]), "inline": True}
        ]
    }

    payload = {
        "embeds": [embed]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"📢 Notification sent for {post_data['reddit_id']}")
        return True
    except Exception as e:
        print(f"❌ Error sending Discord notification: {e}")
        return False

def process_posts(reddit, supabase: Client):
    subreddits = fetch_active_subreddits(supabase)
    if not subreddits:
        print("No active subreddits found.")
        return

    # Join subreddits with a plus sign for a multi-reddit query
    subreddit_query = "+".join(subreddits)
    print(f"Monitoring subreddits: {subreddit_query}")
    
    subreddit = reddit.subreddit(subreddit_query)
    
    # Strong Regex from previous step
    JOB_PATTERN = re.compile(r'(?i)\b('
                             r'hiring|looking\s+for|seeking|need\s+(?:a|an)?|'
                             r'who\s+can|want\s+to\s+(?:make|build|create)|'
                             r'budget|paid\s+(?:work|project|gig)|'
                             r'anyone\s+(?:know|help)|developers?\s+needed'
                             r')\b'
                             r'.{0,100}\b('
                             r'developer|programmer|coder|engineer|expert|'
                             r'bot|scraper|automation|script|api|'
                             r'backend|frontend|full\s*stack|'
                             r'website|web\s*app|application|software|'
                             r'clone|copy|fix|connect|integrate'
                             r')\b')

    current_time = time.time()
    TEN_MINUTES = 600

    # Fetch new posts
    for post in subreddit.new(limit=100):
        # Time Filter
        age = current_time - post.created_utc
        if age > TEN_MINUTES:
            print(f"Skipping old post: {post.title} ({int(age/60)} mins ago)")
            continue
        
        # Regex Filter
        text_to_search = (post.title + " " + post.selftext).lower()
        matches = JOB_PATTERN.findall(text_to_search)
        
        if not matches:
             print(f"Skipping (No Match): {post.title}")
             continue
             
        matched_keywords = list(set([m[0] + " " + m[1] for m in matches if isinstance(m, tuple)]))
        if not matched_keywords: matched_keywords = ["matched pattern"]

        print(f"✅ MATCH: {post.title} ({post.subreddit.display_name})")
        match_score = len(matches) * 1.0 

        post_data = {
            "reddit_id": post.id,
            "subreddit": post.subreddit.display_name,
            "title": post.title,
            "body": post.selftext[:1000] if post.selftext else "",
            "author": str(post.author),
            "url": post.url,
            "score": post.score,
            "num_comments": post.num_comments,
            "created_utc": post.created_utc,
            "matched_keywords": matched_keywords,
            "match_score": match_score,
            "notified": False, 
        }
        
        try:
            # Check if exists first to avoid double notification on re-run
            existing = supabase.table("posts").select("id").eq("reddit_id", post.id).execute()
            if not existing.data:
                # Send Notification DIRECTLY
                sent = send_discord_notification(post_data)
                post_data["notified"] = sent
                if sent:
                     post_data["notified_at"] = "now()"

                # Insert into DB
                supabase.table("posts").insert(post_data).execute()
                print(f"Saved: {post.id}")
            else:
                print(f"Exists: {post.id}")

        except Exception as e:
            print(f"Error processing post {post.id}: {e}")

if __name__ == "__main__":
    try:
        supabase = init_supabase()
        reddit = init_reddit()
        try:
             process_posts(reddit, supabase)
        except Exception as e:
             if "404" in str(e):
                 print("❌ Error: 404 Not Found. One of your subreddits might be banned or misspelled.")
                 print("   Check your 'subreddits' table. (Note: 'forehire' is a common typo for 'forhire')")
             else:
                 raise e
        print("Ingestion run completed.")
    except Exception as e:
        print(f"Fatal error: {e}")
