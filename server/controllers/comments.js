const {
  fetchCommentsByUser,
  postCommentToArticle,
  deleteComment,
  updateComment
} = require('../models/comments');

const getCommentsByUser = (req, res, next) => {
  const { username } = req.params;

  fetchCommentsByUser(username)
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch(next);
};

const addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  postCommentToArticle(article_id, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

const patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateComment(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

module.exports = {
  getCommentsByUser,
  addCommentToArticle,
  removeComment,
  patchComment
};
