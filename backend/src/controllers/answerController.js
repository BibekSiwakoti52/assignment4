// Function to create a new answer to a question
const createAnswer = catchAsync(async (req, res, next) => {
  // Extracting user ID and question ID from request
  const userId = req.user.id;
  const { questionId } = req.query;

  // Check if the user is an expert
  if (req.user.role !== ROLES.Expert) {
    throw new AppError('Only experts can answer questions', 401);
  }

  // Creating a new answer document
  const answer = await Answer.create({
    ...req.body,
    user: userId,
    question: questionId,
  });

  // Marking the question as answered
  await Question.findByIdAndUpdate(questionId, {
    isAnswered: true,
  });

  // Sending response
  return res.status(200).json({
    message: 'Answer created successfully',
    data: answer,
  });
});

// Function to retrieve answers for a specific question
const getAnswers = catchAsync(async (req, res, next) => {
  // Extracting question ID from request
  const questionId = req.query.questionId;

  // Checking if question ID is provided
  if (!questionId) {
    throw new AppError('questionId is required', 400);
  }

  // Querying answers for the specified question, sorting by upvotes
  const answers = await Answer.find({ question: questionId })
    .populate({
      path: 'user',
      select: 'username',
    })
    .sort({ upvotes: -1 });

  // Sending response
  return res.status(200).json({
    data: answers,
  });
});

// Function to upvote or downvote an answer
const upvoteOrDownvoteAnswer = catchAsync(async (req, res) => {
  // Extracting answer ID and user ID from request
  const answerId = req.params.id;
  const userId = req.user.id;

  // Extracting action from request body
  const action = req.body.action;
  
  // Validating action
  if (action !== 'upvote' && action !== 'downvote') {
    const error = new AppError(
      'Invalid action. Please specify upvote or downvote',
      400
    );
    throw error;
  }

  // Checking if the user has already upvoted/downvoted the answer
  const upvote = await AnswerUpvote.findOne({
    user: userId,
    answer: answerId,
  });

  // Performing upvote or downvote based on action
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

    // Creating or deleting upvote document
    if (action === 'upvote') {
      await AnswerUpvote.create(
        [{ user: userId, answer: answerId }],
        { session }
      );
    } else if (action === 'downvote') {
      const answerUpvote = await AnswerUpvote.findOneAndDelete(
        { user: userId, answer: answerId },
        { session }
      );
      if (!answerUpvote) {
        throw new AppError('Answer not found', 404);
      }
    }
  });

  session.endSession();

  // Sending response
  return res.status(200).json({
    message: `Answer ${action}d successfully`,
  });
});

// Function to approve an answer
const approveAnswer = catchAsync(async (req, res, next) => {
  // Extracting answer ID and user ID from request
  const { id } = req.params;
  const userId = req.user.id;

  // Checking if the user is authorized to approve the answer
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

  // Checking if the answer is already approved
  if (answer.isApproved) {
    throw new AppError('Answer is already approved', 400);
  }

  const question = answer.question;

  if (userId !== question.user._id.toString()) {
    throw new AppError('You are not authorized to approve this answer', 401);
  }

  // Approving the answer
  answer.isApproved = true;
  await answer.save();

  // Sending response
  return res.status(200).json({ message: 'Answer successfully approved' });
});

// Function to create a comment on an answer
const createAnswerComment = catchAsync(async (req, res, next) => {
  // Extracting user ID and answer ID from request
  const userId = req.user.id;
  const { id } = req.params;

  // Creating a new comment document
  const comment = await AnswerComment.create({
    ...req.body,
    user: userId,
    answer: id,
  });

  // Sending response
  return res.status(200).json({
    message: 'Comment created successfully',
    data: comment,
  });
});

// Function to retrieve comments for a specific answer
const getAnswerComments = catchAsync(async (req, res, next) => {
  // Extracting answer ID from request
  const { id } = req.params;

  // Querying comments for the specified answer
  const comments = await AnswerComment.find({ answer: id }).populate({
    path: 'user',
    select: 'username',
  });

  // Sending response
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
