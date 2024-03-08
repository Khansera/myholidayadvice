const mongoose = require('mongoose');
const { Db } = require('../connection');
const nav = new mongoose.Schema({
    Name: {
        type: String, required: [true, 'Please enter a valid name'], trim: true, maxlength: 50},
    url: { type: String, required: [true, 'Please enter a url'], trim: true },
}, { timestamps: true })
module.exports = Db.model('navlinks', nav);
