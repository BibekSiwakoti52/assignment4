const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { AppError } = require('./utils');
const errorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoutes');
const questionRouter = require('./routes/questionRoutes');
const answerRouter = require('./routes/answerRoutes');

const { BASE_URL } = require('./constants');

const app = express();
app.use(cors()); // cross origin resource sharing
app.use(express.json());
app.use(morgan('dev'));

const baseRoutes = {
  '/auth': authRouter,
  '/question': questionRouter,
  '/answer': answerRouter,
};

Object.keys(baseRoutes).forEach((route) => {
  app.use(`${BASE_URL}${route}`, baseRoutes[route]);
});

app.all('*', (req, _res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
