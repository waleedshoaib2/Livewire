-- Clean all posts
TRUNCATE TABLE posts;

-- Clean all subreddits
TRUNCATE TABLE subreddits;

-- If you get a foreign key error, use CASCADE:
-- TRUNCATE TABLE subreddits CASCADE;
