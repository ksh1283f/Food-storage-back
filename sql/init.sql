CREATE TABLE IF NOT EXISTS recipes (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(255) NOT NULL,
  name        VARCHAR(500) NOT NULL,
  description TEXT,
  ingredients JSONB        NOT NULL DEFAULT '[]',
  steps       JSONB        NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes (user_id);
