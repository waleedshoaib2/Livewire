#praw play around

import praw

reddit = praw.Reddit(
    client_id="09rAAtAYLnZljbBkGh0Vbg",
    client_secret="Bu751qAtfdkLZCn_uw49urWLFsyVjQ",
    user_agent="Livewire by u/your_username"
)

subreddits = ["python", "learnprogramming", "programming", "coding", "datascience"]

for sub_name in subreddits:
    print(f"\n--- Posts from r/{sub_name} ---")
    subreddit = reddit.subreddit(sub_name)
    for post in subreddit.top(limit=10):
        print({
            "id": post.id,
            "title": post.title,
            "score": post.score,
            "author": str(post.author),
            "created_utc": post.created_utc,
            "num_comments": post.num_comments,
            "url": post.url
        })
