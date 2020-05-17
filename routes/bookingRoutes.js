const express = require('express');
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

const router = express.Router();

//protect all the routes after this Middleware
router.use(authController.protect);

//Booking a Tour by USER
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

//Inorder to modify by Admin and Lead Guide, if necessary
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
