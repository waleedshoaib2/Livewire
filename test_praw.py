import praw
import os
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT", "test_script")
)

def test_sub(name):
    try:
        print(f"Testing '{name}'...")
        sub = reddit.subreddit(name)
        # Accessing title forces a network call
        print(f"Success! Title: {sub.title[:20]}")
    except Exception as e:
        print(f"Failed: {e}")

test_sub("python")
test_sub("r/python")
test_sub("forhire")
test_sub("r/forhire")
