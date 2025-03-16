CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL,
  graduating BOOLEAN NOT NULL,
  gender TEXT NOT NULL,
  portuguese_speaker BOOLEAN NOT NULL
)

CREATE TABLE trials (
  id SERIAL PRIMARY KEY,
  response_time INT NOT NULL,
  stimulus TEXT NOT NULL,
  time_elapsed INT NOT NULL,
  trial_index INT NOT NULL,
  phrase_position INT NOT NULL,
  phrase TEXT NOT NULL,
  user_id INT REFERENCES users (id)
)

CREATE TABLE questions_responses (
  id SERIAL PRIMARY KEY,
  phrase TEXT NOT NULL,
  time_elapsed INT NOT NULL,
  correct BOOLEAN NOT NULL,
  user_id INT REFERENCES users (id)
)