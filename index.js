const express = require('express');
const authRoute = require('./src/routes/auth.route');
require('./src/middlewares/auth.middleware');



//Create server
const app = express();

app.use(express.json()); //Parse payload


//Register routes middlewares to the app
app.use('/api', authRoute);


//The home route: redirects to the general endpoint
app.use('/', (req, res) => {
    res.redirect('/api');
})


//General endpoint
app.get('/api', (req, res) => {
    return res.json({ message: "This is the general endpoint." });
});


//Error Middleware
app.use((error, req, res, next) => {
    if (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
    next();
});


//Catch-all route
app.get('*', (req, res) => {
    res.status(404).json({ message: "Not Found"});
});


module.exports = app;