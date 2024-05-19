const mongoose = require('mongoose');

const AnswerUpvoteSchema = mongoose.Schema({
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

const AnswerUpvote = mongoose.model('AnswerUpvote', AnswerUpvoteSchema);

module.exports = AnswerUpvote;
