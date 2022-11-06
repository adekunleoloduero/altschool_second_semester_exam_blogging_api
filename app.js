const express = require('express');
const authRoute = require('./src/routes/auth.route');
const articlesRoute = require('./src/routes/articles.route');
require('./src/middlewares/auth.middleware');



//Create server
const app = express();

app.use(express.json()); //Parse payload


//Register routes middlewares to the app
app.use('/api', authRoute);
app.use('/api/articles', articlesRoute); //Home route redirects here




//The home route: redirects to the general endpoint
app.use('/', (req, res) => {
    return res.status(200).send("Hello, welcome to my Blogging API. This API allow users to create or read articles created by others. Please Go to /api/articles to get a list of published articles or checkout the README.md file in the GitHub Repository to learn more about how it works and how to run or test it. Thank you!")
})


//Error Middleware
app.use((error, req, res, next) => {
    if (error) {
        return res.status(500).json({ message: "Internal Server Error." });
    } 
    next(); 
});

//Catch-all route
app.get('*', (req, res) => {
    return res.status(404).json({ message: "Not Found"});
});



module.exports = app;