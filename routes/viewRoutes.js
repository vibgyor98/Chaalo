const express = require('express');
const viewsController = require('./../controller/viewsController');
const authController = require('./../controller/authController');

const router = express.Router();

//pug routes
//Overview
router.get('/', authController.isLoggedIn, viewsController.getOverview);
//tour
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
//login
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
//User Details
router.get('/me', authController.protect, viewsController.getAccount);

//Update user Data without API
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
