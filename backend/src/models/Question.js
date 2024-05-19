const mongoose = require('mongoose');
const { ROLES } = require('../constants');

const QuestionSchema = mongoose.Schema(
  {
    title: { type: String, required: [true, 'title is required'] },
    body: {
      type: String,
      required: [true, 'body is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
