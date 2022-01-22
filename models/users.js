const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

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
    },
    slug : {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.pre('validate', function(next) {
    if (this.name){
        this.slug = slugify(this.name, { lower: true, strict: true})
    }
    next();
})

// email: {
//     type: String,
//     unique:true,
//     required: 'Please enter your email',
//     trim: true,
//     lowercase:true,
//     validate: [{ validator: value => isEmail(value), msg: 'Invalid email.' }]
// },

let User = mongoose.model('User', userSchema);
module.exports = User;