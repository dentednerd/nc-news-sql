const db = require('../db/connection');

exports.formatComments = (comments, lookupTable) => {
  if (!comments || !lookupTable) {
    return Promise.reject({
      status: 400,
      msg: 'Unable to format comments'
    });
  };

  return comments.map(
    ({ created_by, belongs_to: key, ...restOfComment }) => {
      const newComment = {
        author: created_by,
        article_id: lookupTable[key],
        ...restOfComment,
      };
      return newComment;
    }
  );
};

exports.createLookupTable = (arr, finalKey, finalValue) => {
  if (!arr || !finalKey || !finalValue) {
    return Promise.reject({
      status: 400,
      msg: 'Unable to create lookup table'
    });
  };

  return arr.reduce((finalObj, current) => {
    finalObj[current[finalKey]] = current[finalValue];
    return finalObj;
  }, {});
};

exports.validateSortBy = (sort_by, columns) => {
  const isValidSortByColumn = columns.includes(sort_by);
  return isValidSortByColumn
    ? sort_by
    : Promise.reject({
        status: 400,
        msg: 'Invalid sort by query'
      });
};

exports.validateOrder = (order) => {
  const lowerCaseOrder = order.toLowerCase();
  const isValidOrder = ['asc', 'desc'].includes(lowerCaseOrder);
  return isValidOrder
    ? lowerCaseOrder
    : Promise.reject({
        status: 400,
        msg: 'Invalid order query'
      });
};

exports.validateTopic = async (topic) => {
  const topics = await db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
      return rows.map((cat) => {
        return cat.slug;
      });
    });

  return topics.includes(topic)
    ? topic
    : Promise.reject({
      status: 404,
      msg: 'Topic not found'
    });
}

exports.validateUser = async (username) => {
  const users = await db
    .query(`SELECT * FROM users;`)
    .then(({ rows }) => {
      return rows.map((user) => {
        return user.username;
      });
    });

  return users.includes(username)
    ? username
    : Promise.reject({
      status: 404,
      msg: 'User not found'
    });
}
