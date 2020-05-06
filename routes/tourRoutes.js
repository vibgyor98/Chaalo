const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

//Tour reviews
router.use('/:tourId/reviews', reviewRouter);

//Aggregator route
router
  //top  cheap tours
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats); //Tour status
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

//search within range
/*
Eg:
/tours-within?distance=233&center=-40,45&unit=mi
/tours-within/233/centre/-40,45/unit/mi
*/
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

//calc distances
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

//setting route for CRUD
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.cretaeTour
  );
router
  .route('/:id') //for tour by id
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
