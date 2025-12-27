-- Remove the typo if it exists
DELETE FROM subreddits WHERE name = 'forehire';

-- Ensure the correct one is there (Upsert-ish)
INSERT INTO subreddits (name, active, added_via)
VALUES ('forhire', true, 'seed')
ON CONFLICT (name) DO NOTHING;
