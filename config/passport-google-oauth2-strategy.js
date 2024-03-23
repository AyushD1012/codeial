const passport= require('passport');
const googleStrategy= require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto');
const User = require('../models/user');


passport.use(new googleStrategy({
    clientID:"238031493280-1rn9tiss6e8ge4ehnfo11ieuc3vfqvlb.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:9356/users/auth/google/callback"

},
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google strategy-passport', err);
                return;
            }
            console.log(profile);

            if(user){
                return done(null, user);
            }
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },
                 function(err, user){
                    if(err){
                        console.log('error in creating user google strategy-passport', err);
                        return done(null, user);

                    }
                 });
            }
        })
    }
));



module.exports = passport;