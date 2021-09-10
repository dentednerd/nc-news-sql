const db = require('../../db/connection');
const {
  validateSortBy,
  validateOrder,
  validateTopic,
  validateUser
} = require('../../utils');

const fetchAllArticles = async (
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1,
  topic
) => {
  let queryStr = `
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  if (topic) {
    const validTopic = await validateTopic(topic);

    if (validTopic) {
      queryStr += `WHERE articles.topic = '${validTopic.replace("'", "''")}'`;
    };
  };

  const validSortBy = await validateSortBy(
    sort_by,
    [
      'title', 'author', 'body', 'topic', 'created_at', 'votes', 'comment_count'
    ]
  );
  const validOrder = await validateOrder(order);

  const offset = (p - 1) * limit;

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${validSortBy} ${validOrder}
    LIMIT ${limit} OFFSET ${offset};
  `;

  const articles = await db
    .query(queryStr)
    .then(({ rows }) => rows);

  return articles;
}

const fetchArticlesByUser = async (username) => {
  const validUsername = await validateUser(username);

  const queryStr = `
    SELECT *
    FROM articles
    WHERE author = $1;
  `;

  const articles = await db
    .query(queryStr, [validUsername])
    .then(({ rows }) => rows);

    if (!articles || !articles.length) {
      console.log('HELP');
      return Promise.reject({
        status: 404,
        msg: `Articles not found`,
      });
    }

  return articles;
}

const fetchArticleById = async (article_id) => {
  const queryStr = `
    SELECT *
    FROM articles
    WHERE article_id = $1;
  `;

  const article = await db
    .query(queryStr, [article_id])
    .then(({ rows }) => rows);

  if (!article.length) {
    return Promise.reject({
      status: 404,
      msg: 'Article not found',
    });
  }

  return article[0];
}

const updateArticleVotesById = async (article_id, votes = 0) => {
  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  const article = await db
    .query(queryStr, [votes, article_id])
    .then(({ rows }) => rows);

  if (!article || !article.length) {
    return Promise.reject({
      status: 404,
      msg: `Article not found`,
    });
  }

  return article[0];
};

const fetchCommentsByArticleId = async(article_id, limit = 10, p = 1) => {
  const validatedArticle = await fetchArticleById(article_id);

  if (!validatedArticle) {
    return Promise.reject({
      status: 404,
      msg: `Article not found`,
    });
  }

  const queryStr = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    LIMIT $2 OFFSET $3;
  `;

  const offset = (p - 1) * limit;

  const comments = await db
    .query(queryStr, [article_id, limit, offset])
    .then(({ rows }) => rows);

  return comments;
}

const postCommentToArticle = async (article_id, { body, username }) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: 'Missing required fields'
    });
  };

  const queryStr = `
    INSERT INTO comments
    (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const comment = await db
    .query(queryStr, [article_id, username, body])
    .then(({ rows }) => rows);

  if (!comment || !comment.length) {
    return Promise.reject({
      status: 405,
      msg: `Unable to post comment`,
    });
  }

  return comment;
}

const insertArticle = async ({
  title,
  body,
  topic,
  author
}) => {

  const queryStr = `
    INSERT INTO articles
    (title, body, topic, author)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const article = await db
    .query(queryStr, [title, body, topic, author])
    .then(({ rows }) => rows);

  if (!article || !article.length) {
    return Promise.reject({
      status: 405,
      msg: `Unable to post article`,
    });
  }

  return article;
}

const removeArticleById = async (article_id) => {
  const queryStr = `
    DELETE FROM articles
    WHERE article_id = $1;
  `;

  const { rowCount: numberOfDeletions } = await db
    .query(queryStr, [article_id]);

  if (!numberOfDeletions) {
    return Promise.reject({
      status: 404,
      msg: 'Article not found'
    });
  }
}

module.exports = {
  fetchAllArticles,
  fetchArticlesByUser,
  fetchArticleById,
  updateArticleVotesById,
  fetchCommentsByArticleId,
  postCommentToArticle,
  insertArticle,
  removeArticleById
};
