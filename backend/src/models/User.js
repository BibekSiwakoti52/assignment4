const mongoose = require('mongoose');
const { ROLES } = require('../constants');

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.User,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
