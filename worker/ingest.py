import os
import praw
from supabase import create_client, Client
from dotenv import load_dotenv
import re
import time

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "Livewire by u/your_username")

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
    return [row["name"] for row in response.data]

def process_posts(reddit, supabase: Client):
    subreddits = fetch_active_subreddits(supabase)
    if not subreddits:
        print("No active subreddits found.")
        return

    # Join subreddits with a plus sign for a multi-reddit query
    subreddit_query = "+".join(subreddits)
    print(f"Monitoring subreddits: {subreddit_query}")
    
    subreddit = reddit.subreddit(subreddit_query)
    
    # Strong Regex for "Client Looking for Dev/Service" (Leads)
    # Excludes "For Hire" (Self-promotion) generally by focusing on "hiring/need" verbs.
    # Matches:
    # - "hiring a <role>"
    # - "need a <role>"
    # - "looking for <role>"
    # - "budget: $xxx"
    # - "paid project"
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
    for post in subreddit.new(limit=25):
        # 1. Time Filter: Only allow posts created in the last 10 minutes
        age = current_time - post.created_utc
        if age > TEN_MINUTES:
            print(f"Skipping old post: {post.title} ({int(age/60)} mins ago)")
            continue
        
        # 2. Regex Filter
        text_to_search = (post.title + " " + post.selftext).lower()
        matches = JOB_PATTERN.findall(text_to_search)
        
        # Unique matches only (flatten tuples if regex has groups, but findall with groups returns tuples)
        # Our regex has 2 capturing groups, so findall returns [('hiring', 'developer'), ...]
        # We want to match if ANY match exists.
        
        if not matches:
             print(f"Skipping (No Match): {post.title}")
             continue
             
        # Flatten matches for display
        matched_keywords = list(set([m[0] + " " + m[1] for m in matches if isinstance(m, tuple)]))
        if not matched_keywords: 
            # Fallback if regex structure changes or simple match
            matched_keywords = ["matched pattern"]

        print(f"✅ MATCH: {post.title} ({post.subreddit.display_name})")
        match_score = len(matches) * 1.0 

        post_data = {
            "reddit_id": post.id,
            "subreddit": post.subreddit.display_name,
            "title": post.title,
            "body": post.selftext[:1000] if post.selftext else "", # Truncate body if needed
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
            # Upsert into Supabase (ignore duplicates based on reddit_id unique constraint)
            # We use ignore_duplicates=False to update existing records if needed, 
            # but usually for 'new' posts we just want to insert. 
            # However, onconflict on reddit_id is better.
            supabase.table("posts").upsert(post_data, on_conflict="reddit_id").execute()
            print(f"Saved: {post.id}")
        except Exception as e:
            print(f"Error saving post {post.id}: {e}")

if __name__ == "__main__":
    try:
        supabase = init_supabase()
        reddit = init_reddit()
        process_posts(reddit, supabase)
        print("Ingestion run completed.")
    except Exception as e:
        print(f"Fatal error: {e}")
