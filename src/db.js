const mongoose = require('mongoose');
require('dotenv').config();



class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${process.env.DATABASE_URI}`)
        .then(()=> {
            console.log('Connected to database successfully.');
        })
        .catch(() => {
            console.log('Database connection failure.');
        })
    }
}



module.exports = new Database();