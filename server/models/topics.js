const db = require('../../db/connection');

const fetchAllTopics = async () => {
  const queryStr = `
    SELECT *
    FROM topics;
  `;

  const topics = await db
    .query(queryStr)
    .then(({ rows }) => rows);

  if (!topics || !topics.length) {
    return Promise.reject({
      status: 404,
      msg: 'Topics not found',
    });
  }

  return topics;
};

const insertTopic = async ({ slug, description }) => {
  const queryStr = `
    INSERT INTO topics
    (slug, description)
    VALUES ($1, $2)
    RETURNING *
  `;

  const topic = await db
    .query(queryStr, [slug, description])
    .then(({ rows }) => rows);

  if (!topic || !topic.length) {
    return Promise.reject({
      status: 404,
      msg: 'Unable to post topic'
    });
  }

  return topic;
}

module.exports = {
  fetchAllTopics,
  insertTopic
};
