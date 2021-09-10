const usersRouter = require('express').Router();
const {
  getAllUsers,
  getUserByUsername
} = require('../controllers/users');
const { handle405s } = require('../errors');

usersRouter
  .route('/')
  .get(getAllUsers)
  .all(handle405s);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(handle405s);

module.exports = usersRouter;
