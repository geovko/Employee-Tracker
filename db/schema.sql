DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;

\c staff_db;

CREATE TABLE favorite_books (
  id SERIAL PRIMARY KEY,
  section INTEGER NOT NULL,
  book_name VARCHAR(30) NOT NULL,
  in_stock BOOLEAN,
  quantity INTEGER NOT NULL
);
