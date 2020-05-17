const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

//setting route for CRUD
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//protect all routes after this PROTECT MIDDLEWARE
router.use(authController.protect);

//update password after login
router.patch('/updateMyPassword', authController.updatePassword);

//get profile after successfull login
router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

//restrict all routes after this RESTRICT MIDDLEWARE to ADMIN
router.use(authController.restrictTo('admin'));

router
  .route('/') // for geting all users
  .get(userController.getAllUsers);
router
  .route('/:id') // for accessing particular user
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
