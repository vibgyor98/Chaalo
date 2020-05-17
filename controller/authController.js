const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const jwt = require('jsonwebtoken');

//Signed token
const signedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//cretaeAndSendToken after everything is fine
const createSendToken = (user, statusCode, res) => {
  const token = signedToken(user._id);
  //send the token thtough cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  //remove password from output
  user.password = undefined;
  //send the response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//Signup new User
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  //send welcome email
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  //Everything fine
  createSendToken(newUser, 201, res);
});

//Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exist
  if (!email || !password) {
    next(new AppError('please provide email and password!!!', 400));
  }

  //Check if User exist && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Incorrect email or password!!!', 401));
  }

  //Everything is fine
  createSendToken(user, 200, res);
});

//Logout User
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

//protect and handle Async middleware
exports.protect = catchAsync(async (req, res, next) => {
  //Get the token and check if it is exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //if no token available
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access', 401)
    );
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //if user exist
  const existUser = await User.findById(decoded.id);
  if (!existUser) {
    return next(new AppError('The user not exist', 401));
  }
  //if user changed password after log in
  if (existUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User changed password, please login again', 401));
  }
  //grant access to the protected route
  req.user = existUser;
  res.locals.user = existUser;
  next();
});

//For Rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //if user exist
      const existUser = await User.findById(decoded.id);
      if (!existUser) {
        return next();
      }
      //if user changed password after log in
      if (existUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //there is a logged in user
      res.locals.user = existUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

//Restrict
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

//Handle forget password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  //Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.createPasswordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an Error sending the email. Try again later')
    );
  }
});

//Handle reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if token is not expired, and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //update changePasswordAt property for the user
  //log the user in, send JWT
  //Everything is fine
  createSendToken(user, 200, res);
});

//Handle update/change password after successfull login user
exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  //If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //User.findByIdAndUpdate will NOT work as intended!
  //Log user in, send JWT
  createSendToken(user, 200, res);
});
