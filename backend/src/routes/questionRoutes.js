const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestion,
} = require('../controllers/questionController');
const { authenticateJWT } = require('../utils');

const router = express.Router();

router.use(authenticateJWT);

router.route('/').post(createQuestion).get(getQuestions);

router.route('/:id').get(getQuestion);

module.exports = router;
