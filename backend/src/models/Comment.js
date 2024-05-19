const mongoose = require('mongoose');

const AnswerCommentSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide a comment'],
    minLength: [1, 'Comment must be at least 1 character long'],
    maxLength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id'],
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    required: [true, 'Please provide an answer id'],
  },
});

const AnswerComment = mongoose.model('AnswerComment', AnswerCommentSchema);
module.exports = AnswerComment;
