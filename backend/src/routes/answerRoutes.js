const express = require('express');
const { authenticateJWT } = require('../utils');
const {
  createAnswer,
  getAnswers,
  upvoteOrDownvoteAnswer,
  approveAnswer,
  createAnswerComment,
  getAnswerComments,
} = require('../controllers/answerController');

const router = express.Router();

router.use(authenticateJWT);

router.route('/').post(createAnswer).get(getAnswers);

router.route('/upvote/:id').post(upvoteOrDownvoteAnswer);

router.route('/approve/:id').post(approveAnswer);

router.route('/comment/:id').post(createAnswerComment).get(getAnswerComments);

module.exports = router;
