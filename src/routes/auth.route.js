const authRoute = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();


//Signup route
authRoute.post('/signup', async(req, res) => {
    passport.authenticate('signup', {session: false}, async(err, user, info) => {
        if (!user) {
            return res.status(400).json(info)
        } else return res.status(201).json({info, user });
    })(req, res)
});


//Signin route
authRoute.post('/signin', async(req, res, next) => {
    passport.authenticate('signin', async(err, user, info) => {
        try {
            if (!user) {
                return res.status(400).json(info);
            }
            req.login(
                user,
                {session: false},
                async(error) => {
                    if (error) {
                        next(error);
                    }
                    const body = { _id: user._id, email: user.email };
                    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1hr'});
                    return res.json({ info, token });
                }
            )
        } catch(error) {
            next(error);
        }
    })(req, res, next);
})



module.exports = authRoute;