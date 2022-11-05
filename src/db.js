const mongoose = require('mongoose');
require('dotenv').config();



class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=> {
            console.log('Connected to database successfully.');
        })
        .catch(() => {
            console.log('Database connection failure.');
        })
    }
}



module.exports = new Database();