// Importing required modules and models
const { options } = require('../app');
const Question = require('../models/Question');
const { catchAsync } = require('../utils');

// Function to create a new question
const createQuestion = catchAsync(async (req, res, next) => {
  // Extracting request body and user ID
  const body = req.body;
  const userId = req.user.id;

  // Creating a new question document
  const question = await Question.create({ ...body, user: userId });

  // Sending response
  return res.status(200).json({
    message: 'Question created successfully',
    data: question,
  });
});

// Function to retrieve questions based on search query and answered status
const getQuestions = catchAsync(async (req, res, next) => {
  // Extracting search query and answered status from request query
  const searchQuery = req.query.q || '';
  const isAnswered = req.query.isAnswered;

  // Querying questions based on search query and answered status
  const questions = await Question.find({
    ...(searchQuery && { title: { $regex: searchQuery, $options: 'i' } }), // Adding regex search if query is provided
    ...(isAnswered && { isAnswered }), // Filtering based on answered status
  })
    .populate({
      path: 'user',
      select: 'username',
    }) // Populating user details
    .sort('-createdAt'); // Sorting by creation date

  // Sending response
  return res.status(200).json({
    data: questions,
  });
});

// Function to retrieve a single question by ID
const getQuestion = catchAsync(async (req, res, next) => {
  // Extracting question ID from request parameters
  const { id } = req.params;

  // Finding question by ID and populating user details
  const question = await Question.findById(id).populate({
    path: 'user',
    select: 'username',
  });

  // If question not found, return 404 error
  if (!question) {
    return res.status(404).json({
      message: 'Question not found',
    });
  }

  // Sending response with question details
  return res.status(200).json({
    data: question,
  });
});

// Exporting createQuestion, getQuestions, and getQuestion functions
module.exports = { createQuestion, getQuestions, getQuestion };
