const mongoose = require('mongoose');
const { Db } = require('../connection');
const blog = new mongoose.Schema({
    ImageUrl:{ type: String,  required: [true, 'Please enter a valid Image Path'], trim:true, unique:true },
    blogHeading: { type: String, required: [true, 'Please enter a valid Heading'],trim:true },
    blogDescription: { type: String, required: [true, 'Please enter a valid Description'], trim:true},
    author:{ type: String, required: [true, 'Please enter a author Name'],trim:true },
    authorInfo:{ type: String,trim:true},
    category:{ type: String, required: [true, 'Please enter a category Name'] }
}, { timestamps: true })
module.exports = Db.model('blog', blog);
