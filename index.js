const express = require('express');
const passport = require('passport');
const authRoute = require('./src/routes/auth.route');
const generalArticlesRoute = require('./src/routes/articles.general.route');
const protectedArticlesRoute = require('./src/routes/articles.protected.route');
require('./src/middlewares/auth.middleware');



//Create server
const app = express();

app.use(express.json()); //Parse payload


//Register routes middlewares to the app
app.use('/api', authRoute);
app.use('/api/articles', generalArticlesRoute); //Home route redirects here
app.use('/api/articles', passport.authenticate('jwt', {session: false}), protectedArticlesRoute);


//The home route: redirects to the general endpoint
app.use('/', (req, res) => {
    //Convert query object to query string
    const query = req.query;
    let queryString = '';
    if (query) {
        const params = [];
        for (const key in query) {
            const param = `${key}=${query[key]}`
            params.push(param);
        }
        queryString = params.join('&');
    }
    res.redirect('/api/articles?'+ queryString); //Append query string to the general route
})



// //Error Middleware
// app.use((error, req, res, next) => {
//     if (error) {
//         return res.status(500).json({ message: "Internal Server Error." });
//     } else {
//         next();
//     }
// });


//Catch-all route
app.get('*', (req, res) => {
    return res.status(404).json({ message: "Not Found"});
});


module.exports = app;