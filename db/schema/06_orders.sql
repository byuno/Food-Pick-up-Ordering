DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  total_price INTEGER,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  number_of_items INTEGER,
  completed BOOLEAN DEFAULT FALSE
);
