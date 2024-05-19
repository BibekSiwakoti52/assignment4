const { SALT_ROUNDS } = require('../constants');
const User = require('../models/User');
const { AppError, catchAsync, generateToken } = require('../utils');
const bcrypt = require('bcrypt');

const register = catchAsync(async (req, res, next) => {
  // validate user's password
  if (req.body.password?.length < 6 || req.body.password?.length > 30) {
    const error = new AppError(
      'Password must be between 6 and 30 characters long'
    );
    return next(error);
  }

  const hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  req.body.password = hashed;

  let user = await User.create(req.body);

  user = user.toObject();
  delete user.password;

  return res.status(200).json({
    message: 'User registered successfully',
    data: user,
  });
});

const login = catchAsync(async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    const error = new AppError('Username and password are required', 400);
    return next(error);
  }

  const user = await User.findOne({ username });

  if (!user) {
    const error = new AppError('The username and password does not match', 404);
    return next(error);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new AppError('The username and password does not match', 400);
    return next(error);
  }

  const token = await generateToken({
    id: user._id,
    role: user.role,
    username: user.username,
  });

  res.status(200).json({
    code: 200,
    message: 'Successfully logged in',
    data: { token, user_data: user },
  });
});

module.exports = { login, register };
