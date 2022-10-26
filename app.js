const express = require('express');
require('dotenv').config();



//Create server
const app = express();


//Homepage
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Homepage." });
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

//Start the server
const PORT = process.env.PORT;
app.listen(PORT, ()=> {console.log(`Server is running on port: ${PORT}`)});


module.exports = app;