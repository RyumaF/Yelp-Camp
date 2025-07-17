const express=require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync');
const {isLoggedin,isAuthor,validateCampground} = require('../middleware');
const {index, renderNewForm, showCampground, createCampground, renderEditForm, updateCampground, deleteCampground} = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(index))
    .post(isLoggedin, upload.array('image'),validateCampground,catchAsync(createCampground));

router.get('/:id/edit', isLoggedin,isAuthor,catchAsync(renderEditForm));

router.get('/new', isLoggedin,catchAsync(renderNewForm));


router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedin,isAuthor, upload.array('image'),validateCampground,catchAsync(updateCampground))
    .delete(isLoggedin,isAuthor,catchAsync(deleteCampground));

module.exports = router;