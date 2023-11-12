const passport=require("passport")

var GoogleStrategy = require('passport-google-oauth20').Strategy;




passport.use(new GoogleStrategy({
    clientID: '969397154163-anm9i3bi48ejg202kp9ttcms3a8oege3.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8080/google/callback",
    scope: ["profile","email"],
  },
  function(accessToken, refreshToken, profile, cb) {
    //register user here
    console.log(profile)
    cb(null,profile)
  }
));


passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
})