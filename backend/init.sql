CREATE TABLE IF NOT EXISTS base_catan_boards (
  ID SERIAL PRIMARY KEY,
  board_name TEXT NOT NULL,
  board JSONB,
  rating INTEGER DEFAULT 0
);
