const mongoose = require('mongoose');
const { Db } = require('../connection');
const reveiw = new mongoose.Schema({
    stars:{ type: String,  required: [true, 'Please enter a valid type'], trim:true},
    description: { type: String, required: [true, 'Please enter a valid Heading'] ,trim:true },
    reveiwId: { type: String, required: [true, 'Please enter a id'], default:'NA', trim:true},
    source:{ type: mongoose.Schema.Types.ObjectId, ref: 'bookings',required:true,trim:true},
    authorAdmin:{type:String,required:true, default:'NA',trim:true}

}, { timestamps: true })

module.exports = Db.model('reveiw', reveiw);
