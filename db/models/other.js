const mongoose = require('mongoose');
const { Db } = require('../connection');
const timeline = new mongoose.Schema({
    timeline:{ type: String,  required: [true, 'Please enter a valid time'], trim:true,default:'NS' },
    status:{ type: Boolean,  required: [true, 'Please enter a value'], default:false },
}, { timestamps: true })
module.exports = Db.model('timeline', timeline);
