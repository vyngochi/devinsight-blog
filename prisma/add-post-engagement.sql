CREATE TABLE IF NOT EXISTS "post_likes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "post_id" UUID NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "uq_post_likes_post_user" UNIQUE ("post_id", "user_id")
);
CREATE INDEX IF NOT EXISTS "idx_post_likes_user" ON "post_likes"("user_id");

CREATE TABLE IF NOT EXISTS "post_relations" (
  "source_post_id" UUID NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "related_post_id" UUID NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "position" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("source_post_id", "related_post_id"),
  CONSTRAINT "post_relations_no_self" CHECK ("source_post_id" <> "related_post_id")
);
CREATE INDEX IF NOT EXISTS "idx_post_relations_related" ON "post_relations"("related_post_id");
