const express = require('express');
const router = express.Router();
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');

//Validating TourId

//setting route for CRUD
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours); //Aliasing route

//Aggregator route
router.route('/tour-stats').get(tourController.getTourStats); //Tour status
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan); //Tour status

router
  .route('/') //for tours
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.cretaeTour);
router
  .route('/:id') //for tour by id
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
