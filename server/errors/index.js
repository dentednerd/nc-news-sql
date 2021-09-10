exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'This route is invalid.' });
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'This method is not allowed.' });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, 'This is an unhandled error.');
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const psqlCodes = {
    '22P02': { msg: 'Bad request', status: 400 },
    23502: { msg: 'Unprocessable entity', status: 422 },
    23503: { msg: 'Not found', status: 404 },
    42703: { msg: 'Bad request', status: 400 },
    23505: { msg: 'Bad request - that already exists', status: 400 },
  };

  if (err.code) {
    for (let key in psqlCodes) {
      if (err.code === key) {
        const { status, msg } = psqlCodes[key];

        res.status(status).send({ msg });
      }
    }
  } else next(err);
};
