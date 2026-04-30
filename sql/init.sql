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

CREATE TABLE IF NOT EXISTS recipe_cache (
  cache_key  VARCHAR(32)  PRIMARY KEY,
  result     JSONB        NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
