const db = require('../connection');
const format = require('pg-format');

const insertTopics = async (topicData) => {
  const topicsQueryStr = format(
    'INSERT INTO topics (slug, description) VALUES %L RETURNING *;',
    topicData.map(({ slug, description }) => [slug, description])
  );

  await db.query(topicsQueryStr);
};

const insertUsers = async (userData) => {
  const usersQueryStr = format(
    'INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;',
    userData.map(({
      username,
      name,
      avatar_url
    }) => [
      username,
      name,
      avatar_url,
    ])
  );

  await db.query(usersQueryStr);
};

const insertArticles = async (articleData) => {
  const articlesQueryStr = format(
    'INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L RETURNING *;',
    articleData.map(
      ({
        title,
        body,
        votes = 0,
        topic,
        author,
        created_at,
      }) => [
        title,
        body,
        votes,
        topic,
        author,
        created_at,
      ]
    )
  );

  return db.query(articlesQueryStr)
    .then((result) => result.rows);
};

const insertComments = (formattedCommentData) => {
  const commentsQueryStr = format(
    'INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;',
    formattedCommentData.map(
      ({ author, article_id,  votes = 0, created_at, body }) => [
        author,
        article_id,
        votes,
        created_at,
        body,
      ]
    )
  );
  return db.query(commentsQueryStr);
}

module.exports = {
  insertArticles,
  insertUsers,
  insertTopics,
  insertComments
}
