const apiRouter = require('express').Router();

const { handle405s } = require('../errors');

const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');
const getApi = require('./api');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter
  .route('/')
  .get(getApi)
  .all(handle405s);

module.exports = apiRouter;
