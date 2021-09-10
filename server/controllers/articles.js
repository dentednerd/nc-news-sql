const {
  fetchAllArticles,
  fetchArticlesByUser,
  fetchArticleById,
  updateArticleVotesById,
  fetchCommentsByArticleId,
  insertArticle,
  removeArticleById
} = require('../models/articles');

const getAllArticles = (req, res, next) => {
  const { sort_by, order, limit, p, topic } = req.query;

  fetchAllArticles(sort_by, order, limit, p, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticlesByUser = (req, res, next) => {
  const { username } = req.params;

  fetchArticlesByUser(username)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  fetchCommentsByArticleId(article_id, limit, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
const postArticle = (req, res, next) => {
  const { body } = req;

  insertArticle(body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = {
  getAllArticles,
  getArticlesByUser,
  getArticleById,
  patchArticleVotesById,
  getCommentsByArticleId,
  postArticle,
  deleteArticleById
};
