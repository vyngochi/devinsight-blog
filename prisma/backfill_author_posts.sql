-- Link legacy database posts to a user only when the stored author name/email
-- identifies exactly one account. Ambiguous records remain untouched.
WITH unambiguous_matches AS (
  SELECT p.id, MIN(u.id::text)::uuid AS user_id
  FROM posts AS p
  JOIN users AS u
    ON lower(trim(coalesce(p.author_name, ''))) = lower(trim(coalesce(u.name, '')))
    OR lower(trim(coalesce(p.author_name, ''))) = lower(trim(u.email))
  WHERE p.author_id IS NULL
  GROUP BY p.id
  HAVING COUNT(*) = 1
)
UPDATE posts AS p
SET author_id = unambiguous_matches.user_id
FROM unambiguous_matches
WHERE p.id = unambiguous_matches.id;
