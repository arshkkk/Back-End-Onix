var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
var Schema = mongoose.Schema

var User = new Schema({
    full_name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true
    },
    verified:{
        type:Boolean,
        require:true,
        default:false
    }
},{timestamps:true})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',User)

