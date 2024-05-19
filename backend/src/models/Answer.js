const mongoose = require('mongoose');
const { ROLES } = require('../constants');

const AnswerSchema = mongoose.Schema(
  {
    answer: {
      type: String,
      required: [true, 'answer is required'],
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'question id is required'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;
