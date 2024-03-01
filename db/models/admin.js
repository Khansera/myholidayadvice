const mongoose = require('mongoose');
const { Db } = require('../connection');
const passportLocalMongoose = require('passport-local-mongoose'); 

const admin = new mongoose.Schema({
    username:{ type: String,  required: [true, 'Please enter a valid Image Path'], trim:true, unique:true },
    email:{ type: String,  required: [true, 'Please enter a valid Image Path'], trim:true, unique:true },
    secret:{type: String,  required: [true, 'Please enter a valid Image Path'], trim:true, unique:true}
}, { timestamps: true });

admin.plugin(passportLocalMongoose); 

module.exports = Db.model('admin', admin);