const db = require('../connection');

const dropAllTables = async () => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
};

const createAllTables = async () => {
  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      topic VARCHAR NOT NULL REFERENCES topics(slug),
      author VARCHAR NOT NULL REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR REFERENCES users(username) NOT NULL,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      body TEXT NOT NULL
    );
  `);
};

module.exports = { dropAllTables, createAllTables };
