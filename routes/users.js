const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const usersController = require('../controllers/users');

router.route('/register')
    .get(usersController.renderRegisterForm)
    .post(catchAsync(usersController.registerUser))

router.route('/login')
    .get(usersController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.loginExec)

router.get('/logout', usersController.logoutExec);

module.exports = router;