const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articleSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    markdown : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        default : Date.now
    },
    createdBy : {
        type : Object,
        required : true
    }
})

let Article = mongoose.model('Article', articleSchema);
module.exports = Article;