const {
  fetchAllTopics,
  insertTopic
} = require('../models/topics');

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  const { body } = req;

  insertTopic(body)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

module.exports = {
  getAllTopics,
  postTopic
};
