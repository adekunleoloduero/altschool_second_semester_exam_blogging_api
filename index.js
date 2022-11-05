const app = require('./app');
require('dotenv').config();

require('./src/db'); //Connect to production database



const PORT = process.env.PORT;

//Start the server
app.listen(PORT, ()=> {console.log(`Server is running on port: ${PORT}`)});
