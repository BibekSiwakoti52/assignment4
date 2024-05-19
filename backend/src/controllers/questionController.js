const { options } = require('../app');
const Question = require('../models/Question');
const { catchAsync } = require('../utils');

const createQuestion = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  const question = await Question.create({ ...body, user: userId });

  return res.status(200).json({
    message: 'Question created successfully',
    data: question,
  });
});

const getQuestions = catchAsync(async (req, res, next) => {
  const searchQuery = req.query.q || '';
  const isAnswered = req.query.isAnswered;

  const questions = await Question.find({
    ...(searchQuery && { title: { $regex: searchQuery, $options: 'i' } }),
    ...(isAnswered && { isAnswered }),
  })
    .populate({
      path: 'user',
      select: 'username',
    })
    .sort('-createdAt');

  return res.status(200).json({
    data: questions,
  });
});

const getQuestion = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const question = await Question.findById(id).populate({
    path: 'user',
    select: 'username',
  });

  if (!question) {
    return res.status(404).json({
      message: 'Question not found',
    });
  }

  return res.status(200).json({
    data: question,
  });
});

module.exports = { createQuestion, getQuestions, getQuestion };
