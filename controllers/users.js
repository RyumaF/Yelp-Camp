const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
};

module.exports.register = async(req,res,next)=>{
    try{
        const {email, username,password} = req.body;
        const user = new User({email, username});
        const result = await User.register(user,password);
        req.login(result, function(err){
            if(err)return next(err);
            req.flash('success', 'registration is completed. Thank you.');
            res.redirect('/campgrounds');
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
};

module.exports.login = (req, res)=>{
    req.flash('success', 'welcome!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = async(req,res)=>{
    await req.logout(function(err){
        if(err){
            req.flash('error', err.message);
            res.redirect('/login');
        }
        req.flash('success', 'user logged out.');
        res.redirect('/campgrounds');
    });
};