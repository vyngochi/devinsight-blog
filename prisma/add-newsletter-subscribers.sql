CREATE TYPE "newsletter_subscriber_status" AS ENUM ('ACTIVE', 'UNSUBSCRIBED');

CREATE TABLE "newsletter_subscribers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL,
  "status" "newsletter_subscriber_status" NOT NULL DEFAULT 'ACTIVE',
  "source" VARCHAR(40) NOT NULL DEFAULT 'home',
  "subscribed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");
CREATE INDEX "idx_newsletter_subscribers_status_subscribed" ON "newsletter_subscribers"("status", "subscribed_at" DESC);
