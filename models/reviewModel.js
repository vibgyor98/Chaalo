const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Ecah user can review each unique tour only once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//QUERRY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  //populate tour and user name and email
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//Aggregater func for calculating avg
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//Middleware
//to save each new Review is created and help in calc avg
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

//to find & update/delete Review Avg
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.updatedReview = await this.findOne();
  next();
});

//to save after update/delete Review Avg
reviewSchema.post(/^findOneAnd/, async function () {
  await this.updatedReview.constructor.calcAverageRatings(
    this.updatedReview.tour
  );
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
