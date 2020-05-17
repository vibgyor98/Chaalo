const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Overview page
exports.getOverview = catchAsync(async (req, res, next) => {
  //1. Get tours data from collection
  const tours = await Tour.find();

  //2. Build template
  //3. Render that template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

//Particular tour page
exports.getTour = catchAsync(async (req, res, next) => {
  //1. Get the tour data inc reviews && guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  //2. Build Template
  //3. Render template using step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

//Login Form
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

//Account Details
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

//User Booked Tour
exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2)find tours with returned IDs
  const tourIDs = bookings.map((ele) => ele.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

//Update user Data - Without API
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});
