const { dropAllTables, createAllTables } = require('./reset-tables');
const {
  insertTopics,
  insertUsers,
  insertArticles,
  insertComments
} = require('./insert-data');
const { createLookupTable, formatComments } = require('../../utils');

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;

  await dropAllTables();
  await createAllTables();

  await insertTopics(topicData);
  await insertUsers(userData);
  await insertArticles(articleData)
    .then((articleRows) => {
      const articleLookupTable = createLookupTable(articleRows, 'title', 'article_id');

      const formattedCommentData = formatComments(commentData, articleLookupTable);

      return insertComments(formattedCommentData);
    });
};

module.exports = seed;
