const mongoose = require('mongoose');
const moment = require('moment');
const timestampsPlugin = require('./plugins/timestamps');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;


const userSchema = new Schema({
        //Mandatory fields
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        }
    }
);


//Add timestamps for time created and time updated.
userSchema.plugin(timestampsPlugin);


//Hash password before saving to database.
userSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});


//Validate that user password stored in the DB matches that which is provided during signin process.
// userSchema.methods.validatePassword = async function(password) {
//     const result = await bcrypt.compare(password, this.password);
//     return result;
// }

userSchema.methods.isValidPassword = async function(password) {
    const compareResult = await bcrypt.compare(password, this.password);
    return compareResult;
}



module.exports = mongoose.model("users", userSchema);