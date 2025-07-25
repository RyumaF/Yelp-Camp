const Campground=require('./models/campground');
const {campgroundSchema} = require('./schemas');
const ExpressError=require('./utils/ExpressError');
const {reviewSchema} = require('./schemas');
const Review = require('./models/review');

module.exports.isLoggedin = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please access after you logged in.');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(detail=>detail.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} =req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'permission denied');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} =req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'permission denied');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
};

module.exports.validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(detail=>detail.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
};