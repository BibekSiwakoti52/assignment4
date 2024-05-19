// Importing required modules and constants
const { SALT_ROUNDS } = require('../constants');
const User = require('../models/User');
const { AppError, catchAsync, generateToken } = require('../utils');
const bcrypt = require('bcrypt');

// Function to register a new user
const register = catchAsync(async (req, res, next) => {
  // Validate user's password length
  if (req.body.password?.length < 6 || req.body.password?.length > 30) {
    const error = new AppError(
      'Password must be between 6 and 30 characters long'
    );
    return next(error);
  }

  // Hashing the user's password
  const hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  req.body.password = hashed;

  // Creating a new user
  let user = await User.create(req.body);

  // Removing password field from user object
  user = user.toObject();
  delete user.password;

  // Sending response
  return res.status(200).json({
    message: 'User registered successfully',
    data: user,
  });
});

// Function to log in a user
const login = catchAsync(async (req, res, next) => {
  // Extracting username and password from request body
  const username = req.body.username;
  const password = req.body.password;

  // Checking if username and password are provided
  if (!username || !password) {
    const error = new AppError('Username and password are required', 400);
    return next(error);
  }

  // Finding user by username
  const user = await User.findOne({ username });

  // If user not found, return error
  if (!user) {
    const error = new AppError('The username and password does not match', 404);
    return next(error);
  }

  // Comparing provided password with hashed password in database
  const isMatch = await bcrypt.compare(password, user.password);

  // If passwords don't match, return error
  if (!isMatch) {
    const error = new AppError('The username and password does not match', 400);
    return next(error);
  }

  // Generating JWT token for user
  const token = await generateToken({
    id: user._id,
    role: user.role,
    username: user.username,
  });

  // Sending response with token and user data
  res.status(200).json({
    code: 200,
    message: 'Successfully logged in',
    data: { token, user_data: user },
  });
});

// Exporting login and register functions
module.exports = { login, register };
