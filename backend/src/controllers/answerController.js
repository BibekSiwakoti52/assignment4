const { ROLES } = require('../constants');
const mongoose = require('mongoose');
const Answer = require('../models/Answer');
const AnswerUpvote = require('../models/AnswerUpvote');
const { catchAsync, AppError } = require('../utils');
const AnswerComment = require('../models/Comment');
const Question = require('../models/Question');

const createAnswer = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { questionId } = req.query;

  // check the role of the user
  if (req.user.role !== ROLES.Expert) {
    throw new AppError('Only experts can answer questions', 401);
  }

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

const getAnswers = catchAsync(async (req, res, next) => {
  const questionId = req.query.questionId;

  if (!questionId) {
    throw new AppError('questionId is required', 400);
  }

  const answersQuery = Answer.find({ question: questionId })
    .populate({
      path: 'user',
      select: 'username',
    })
    .sort('-createdAt');

  answersQuery.sort('-upvotes');

  const answers = await answersQuery;

  return res.status(200).json({
    data: answers,
  });
});

const upvoteOrDownvoteAnswer = catchAsync(async (req, res) => {
  const answerId = req.params.id;
  const userId = req.user.id;

  const action = req.body.action;
  if (action !== 'upvote' && action !== 'downvote') {
    const error = new AppError(
      'Invalid action. Please specify upvote or downvote',
      400
    );
    throw error;
  }

  // check if the user has already liked this post
  const upvote = await AnswerUpvote.findOne({
    user: userId,
    answer: answerId,
  });

  if (action === 'upvote') {
    // if the like document exists, it means the user has already liked the post
    if (upvote) {
      const error = new AppError('You have already upvoted this post', 400);
      throw error;
    }
  }

  if (action === 'downvote') {
    // if the like document does not exist, it means the user has not liked the post
    if (!upvote) {
      const error = new AppError('You have not upvoted this post', 400);
      throw error;
    }
  }

  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
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
    } else {
      const error = new AppError('Invalid action', 400);
      throw error;
    }
  });

  session.endSession();

  return res.status(200).json({
    message: `Answer ${action}d successfully`,
  });
});

const approveAnswer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  // check if the user asked the question
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

  if (answer.isApproved) {
    throw new AppError('Answer is already approved', 400);
  }

  const question = answer.question;

  if (userId !== question.user._id.toString()) {
    throw new AppError('You are not authorized to approve this answer', 401);
  }

  answer.isApproved = true;
  await answer.save();

  return res.status(200).json({ message: 'Answer successfully approved' });
});

const createAnswerComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

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

const getAnswerComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;

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
