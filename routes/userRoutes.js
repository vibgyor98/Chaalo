const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

//setting route for CRUD
router.route('/') // for users
      .get(userController.getAllUsers)
      .post(userController.createUser);
router.route('/:id') // for user by id
      .get(userController.getUserById)
      .patch(userController.updateUser)
      .delete(userController.deleteUser);

module.exports = router;