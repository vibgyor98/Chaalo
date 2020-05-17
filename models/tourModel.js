const mongoose = require('mongoose');
const slugify = require('slugify');

//mongoose schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name should be within 40 Characters length'],
      minlength: [10, 'A tour name must have more or equal 10 Characters'],
      // validate: [validator.isAlpha, 'A tour name must only contain alphabet']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, middium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be equal to or above 1.0'],
      max: [5, 'Rating must be equal to or below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only point to current doc on new doc creation
          return val < this.price; //100 < 200
        },
        message: 'Discount price ({VALUE}) should be less then original Price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a Cover Image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Indexing Filter
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Virtual popuate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Middleware
//DOCUMENT Middileware
tourSchema.pre('save', function (next) {
  //runs b4 .save() && .create() != rest
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post('save', function (docs, next) {
  //runs a4 .save() && .create()
  this.slug = slugify(this.name, { lower: true });
  next();
});

//QUERY Middileware
tourSchema.pre(/^find/, function (next) {
  //secret tour
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  //populate guides
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
// tourSchema.post(/^find/, function (docs, next) {
//   //checking query time
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

//AGGREGATE Middileware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

//Models
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
