const express = require('express');
const router = express.Router();
const tourController = require('../controller/tourController');

//Validating TourId

//setting route for CRUD
router.route('/') //for tours
      .get(tourController.getAllTours)
      .post(tourController.cretaeTour);
router.route('/:id') //for tour by id
      .get(tourController.getTourById)
      .patch(tourController.updateTour)
      .delete(tourController.deleteTour);

module.exports = router;