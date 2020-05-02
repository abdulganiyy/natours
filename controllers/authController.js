const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const AppError = require('../utils/appError');

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('please provide email and password', 400));
    }

    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('incorrect email or password', 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //Get Token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('No authorization please login', 401));

    //Verify Token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    //Check If User Exists

    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
      next(new AppError('The user of this token no longer exists', 401));
    }

    //Check If password has changed

    if (freshUser.changedPassword(decoded.iat)) {
      next(new AppError('user recently changed password, login again', 401));
    }

    req.user = freshUser;

    next();
  } catch (err) {
    next(err);
  }
};
