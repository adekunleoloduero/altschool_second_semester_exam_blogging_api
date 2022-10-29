const moment = require('moment');


const timestamps = (schema) => {
    //Extend user schema to include timestamps for create and update.
    schema.add({
        createdAt: Date,
        updatedAt: Date
    });

    //Automatically determine the exact time a record is created or updated.
    schema.pre('save', function(next) {
        this.updatedAt = moment().toDate();

        //Runs only the first time a record is created but not when it gets updated.
        if (!this.createdAt) {
            this.createdAt = moment().toDate();
        }
        next();
    })
};

module.exports = timestamps;





