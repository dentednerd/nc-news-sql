const {
  getAllArticles,
  getArticlesByUser,
  getArticleById,
  patchArticleVotesById,
  getCommentsByArticleId,
  postArticle,
  deleteArticleById
} = require('../controllers/articles');

const {
  addCommentToArticle
} = require('../controllers/comments');

const { handle405s } = require('../errors');

const articlesRouter = require('express').Router();

articlesRouter
  .route('/')
  .get(getAllArticles)
  .post(postArticle)
  .all(handle405s);

articlesRouter
  .route('/by/:username')
  .get(getArticlesByUser)
  .all(handle405s);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleVotesById)
  .delete(deleteArticleById)
  .all(handle405s);

articlesRouter
  .route('/:article_id/comments')
  .post(addCommentToArticle)
  .get(getCommentsByArticleId)
  .all(handle405s);

module.exports = articlesRouter;
