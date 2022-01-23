const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        default : Date.now
    },
    articles : {
        type : Array
    }
})

let User = mongoose.model('User', userSchema);
module.exports = User;