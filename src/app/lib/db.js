import Database from "better-sqlite3";

const db = new Database("database.db", { verbose: console.log });

// Create users table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

// Drop and recreate posts table (for development only)
// Ensure the posts table includes likes and comments
// db.prepare(`DROP TABLE IF EXISTS posts`).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    country TEXT NOT NULL,
    visit_date TEXT NOT NULL,
    flag TEXT,
    currency TEXT,
    capital TEXT,
    likes INTEGER DEFAULT 0,  -- Add likes column
    comments INTEGER DEFAULT 0,  -- Add comments column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`
).run();

export default db;
