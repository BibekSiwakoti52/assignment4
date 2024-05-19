const { ROLES } = require('../constants');
const mongoose = require('mongoose');
const Answer = require('../models/Answer');
const AnswerUpvote = require('../models/AnswerUpvote');
const { catchAsync, AppError } = require('../utils');
const AnswerComment = require('../models/Comment');
const Question = require('../models/Question');

// Function to create an answer to a question
const createAnswer = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { questionId } = req.query;

  // Check if the user is an expert
  if (req.user.role !== ROLES.Expert) {
    throw new AppError('Only experts can answer questions', 401);
  }

  // Create an answer and mark the question as answered
  const answer = await Answer.create({
    ...req.body,
    user: userId,
    question: questionId,
  });

  await Question.findByIdAndUpdate(questionId, {
    isAnswered: true,
  });

  return res.status(200).json({
    message: 'Answer created successfully',
    data: answer,
  });
});

// Function to get answers for a specific question
const getAnswers = catchAsync(async (req, res, next) => {
  const questionId = req.query.questionId;

  // Validate if questionId is provided
  if (!questionId) {
    throw new AppError('questionId is required', 400);
  }

  // Retrieve answers for the given question, sorted by upvotes
  const answersQuery = Answer.find({ question: questionId })
    .populate({
      path: 'user',
      select: 'username',
    })
    .sort({ upvotes: -1 });

  const answers = await answersQuery;

  return res.status(200).json({
    data: answers,
  });
});

// Function to upvote or downvote an answer
const upvoteOrDownvoteAnswer = catchAsync(async (req, res) => {
  const answerId = req.params.id;
  const userId = req.user.id;

  const action = req.body.action;
  // Validate action
  if (action !== 'upvote' && action !== 'downvote') {
    const error = new AppError(
      'Invalid action. Please specify upvote or downvote',
      400
    );
    throw error;
  }

  // Check if the user has already upvoted/downvoted the answer
  const upvote = await AnswerUpvote.findOne({
    user: userId,
    answer: answerId,
  });

  // Perform upvote or downvote based on action
  // Also, handle transactions to maintain data consistency
  // Ensure the user hasn't already liked/unliked the post
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    // Update answer upvotes count
    const answer = await Answer.findByIdAndUpdate(
      answerId,
      {
        $inc: { upvotes: action === 'upvote' ? 1 : -1 },
      },
      { session }
    );
    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    // Create or delete upvote based on action
    if (action === 'upvote') {
      await AnswerUpvote.create(
        [
          {
            user: userId,
            answer: answerId,
          },
        ],
        { session }
      );
    } else if (action === 'downvote') {
      const answerUpvote = await AnswerUpvote.findOneAndDelete(
        {
          user: userId,
          answer: answerId,
        },
        { session }
      );
      if (!answerUpvote) {
        throw new AppError('Answer not found', 404);
      }
    }
  });

  session.endSession();

  return res.status(200).json({
    message: `Answer ${action}d successfully`,
  });
});

// Function to approve an answer by the question owner
const approveAnswer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Find the answer and its associated question
  const answer = await Answer.findById(id).populate({
    path: 'question',
    populate: {
      path: 'user',
      select: 'username',
    },
  });

  if (!answer) {
    throw new AppError('Answer not found', 404);
  }

  // Check if the answer is already approved
  if (answer.isApproved) {
    throw new AppError('Answer is already approved', 400);
  }

  const question = answer.question;

  // Check if the current user is the owner of the question
  if (userId !== question.user._id.toString()) {
    throw new AppError('You are not authorized to approve this answer', 401);
  }

  // Approve the answer
  answer.isApproved = true;
  await answer.save();

  return res.status(200).json({ message: 'Answer successfully approved' });
});

// Function to create a comment on an answer
const createAnswerComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  // Create a comment on the answer
  const comment = await AnswerComment.create({
    ...req.body,
    user: userId,
    answer: id,
  });

  return res.status(200).json({
    message: 'Comment created successfully',
    data: comment,
  });
});

// Function to get comments for an answer
const getAnswerComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Retrieve comments for the given answer
  const comments = await AnswerComment.find({ answer: id }).populate({
    path: 'user',
    select: 'username',
  });

  return res.status(200).json({
    data: comments,
  });
});

module.exports = {
  createAnswer,
  getAnswers,
  upvoteOrDownvoteAnswer,
  approveAnswer,
  createAnswerComment,
  getAnswerComments,
};

