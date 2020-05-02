const express = require('express');

const router = express.Router();
// const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');

const { signup, login } = authController;

router.route('/signup').post(signup);

router.route('/login').post(login);

// router
//   .route('/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

module.exports = router;
