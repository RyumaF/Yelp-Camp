const express=require('express');
const router = express.Router({mergeParams: true});
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const Review=require('../models/review');
const{validateReview, isLoggedin,isReviewAuthor} = require('../middleware');
const {createReview, deleteReview} = require('../controllers/reviews');

router.post('/',isLoggedin,validateReview,catchAsync(createReview));

router.delete('/:reviewId',isLoggedin,isReviewAuthor,catchAsync(deleteReview));


module.exports = router;