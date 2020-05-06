const Review = require('./../models/reviewModel');
const factory = require('./handleFactory');

//Middleware to set tourId and userId for reviewing
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId; //set tour id b4 creating review
  if (!req.body.user) req.body.user = req.user.id; //set user id b4 creating review
  next();
};

//all reviews
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
