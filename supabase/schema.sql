-- Create subreddits table
create table subreddits (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  active boolean default true,
  added_via text check (added_via in ('discord', 'frontend', 'seed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  reddit_id text unique not null,
  subreddit text not null,
  title text not null,
  body text,
  author text,
  url text,
  score int,
  num_comments int,
  created_utc float,
  matched_keywords text[],
  match_score float,
  notified boolean default false,
  notified_at timestamp with time zone,
  responded boolean default false,
  responded_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes (optional but recommended for performance)
create index idx_posts_subreddit on posts(subreddit);
create index idx_posts_responded on posts(responded);
create index idx_posts_notified on posts(notified);
create index idx_subreddits_active on subreddits(active);
