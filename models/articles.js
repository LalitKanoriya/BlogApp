const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const slugify = require('slugify');
const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDompurify(new JSDOM().window)

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
    slug : {
        type : String,
        required : true,
        unique : true
    }
    // sanitizedHtml : {
    //     type : String,
    //     required : true
    // }
})

articleSchema.pre('validate', function(next) {
    if (this.title){
        this.slug = slugify(this.title, { lower: true, strict: true})
    }
    // if (this.markdown){
    //     console.log(marked);
    //     this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    // }
    next();
})

let Article = mongoose.model('Article', articleSchema);
module.exports = Article;