const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, checkUser, validateCampground } = require('../middleware');
const campgroundsController = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundsController.showCampground));

router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundsController.createCampground))
    .put(isLoggedIn, checkUser, upload.array('image'), validateCampground, catchAsync(campgroundsController.updateCampground))
    .delete(isLoggedIn, catchAsync(campgroundsController.deleteCampground));

router.get('/:id/edit', isLoggedIn, checkUser, catchAsync(campgroundsController.renderEditForm));

module.exports = router;