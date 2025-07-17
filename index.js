if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path = require('path');
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const mongoose=require('mongoose');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const UserRoutes = require('./routes/users');
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const MongoStore = require('connect-mongo');
const secret = process.env.SECRET || 'mysecret';
const port = process.env.PORT || 3000;

mongoose.connect(DB_URL,{
    useNewUrlParser:true
    ,useUnifiedTopology:true
    ,useCreateIndex:true
    ,useFindAndModify : false
})
.then(()=>{
    console.log('コネクション接続したよ～ん');
})
.catch(err=>{
    console.log('コネクションエラー');
    console.log(err);
});

app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const connectSrcUrls = [
    'https://api.mapbox.com',
    'https://*.tiles.mapbox.com',
    'https://events.mapbox.com'
];
const fontSrcUrls = [];
const imgSrcUrls = [
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
    'https://images.unsplash.com'
];

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
}));

const store = MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret
    },
    touchAfter:24*3600
});

store.on('error', e => {
    console.log(e);
})

const sessionConfig = {
    secret
    ,store
    ,resave:false
    ,saveUninitialized:true
    ,cookie:{
        httpOnly:true,
        // secure:true,
        maxAge: 1000*60*60*24*7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/',(req,res)=>{
    res.render('home');
});

app.use('/', UserRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/makecampground',catchAsync(async (req,res)=>{
    const camp = new Campground({title:'私の庭',description:'気軽に安くキャンプ！！'});
    await camp.save();
    res.send(camp);
}));

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message){
        err.message='問題が発生しました。';
    }
    res.status(statusCode).render('error',{err});
});

app.listen(port,()=>{
    console.log(`ポート${port}でリクエスト待ち受け中...`);
});

