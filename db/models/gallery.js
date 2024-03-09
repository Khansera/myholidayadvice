const mongoose = require('mongoose');
const { Db } = require('../connection');
const gallery = new mongoose.Schema({
    ImageUrl:{ type: String,  required: [true, 'Please enter a valid Image Path'], trim:true, },
    ImageHeading: { type: String,trim:true},
}, { timestamps: true })
module.exports = Db.model('gallery', gallery);
