const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');
const UserModel = require('../models/user.model');
require('dotenv').config();



//Retrieve and validate JWT token
passport.use(
    new jwtStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },

        async(token, done) => {
            try {
                const user = await token.user;
                return done(null, user);
            } catch(error) {
                done(error);
            }
        }
    )
);


//Passport local strategy signup
passport.use('signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async(req, email, password, done) => {
            try {
                //First, check whether user with the email provided already exists.
                const oldUser = await UserModel.findOne({ email });
                if (oldUser) {
                    return done(null, false, { message: "A user with this email already exists."});
                } else {
                    //If the email does not exist, signup user.
                    const body = req.body;
                    let user = await UserModel.create({ firstName: body.firstName, lastName: body.lastName, email, password });
                    user = user.toObject();
                    delete user.password;
                    return done(null, user, { message: "Signup was successful."});
                }
            } catch(error) {
                done(error);
            }
        }
    )
);


//Passport local strategy signin
passport.use('signin', 
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "User not found." });
                }
                
                const isValidPassword = await user.validatePassword(password);
                if (!isValidPassword) {
                    return done(null, false, {message: "Password is incorrect." });
                }
                return done(null, user, { message: `Welcome back ${user.firstName}.`});             
            } catch(error) {
                done(error);
            }
        }
    )
);