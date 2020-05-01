const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');

//setting route for CRUD

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/') // for users
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id') // for user by id
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
