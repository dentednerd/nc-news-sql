const {
  fetchAllUsers,
  fetchUserByUsername
} = require('../models/users');

const getAllUsers= (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUserByUsername(username)
    .then(([user]) => {
      res.send({ user });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserByUsername
}
