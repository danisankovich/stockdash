var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../models/user');


module.exports = function(app) {
  passport.use(new GoogleStrategy({
    clientID: '625527691989-3oom12a9q1j0k3ffjrki0re16t2tnf72.apps.googleusercontent.com',
    clientSecret: 'cZmOwMikQD6ob-ruhoy5S3Nb',
// callbackURL: 'http://localhost:3000/oauth2/callback',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      User.findOne({ email: profile.emails[0].value }, function(err, user){
        if (!user) {
          User.create({
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
          }, function(err, newUser){
            done(null, newUser);
          });
        } else {
          done(null, user);
          console.log(user);
        }
      });
    }
  ));
};
