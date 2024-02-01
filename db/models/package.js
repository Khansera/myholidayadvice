const mongoose=require('mongoose');
const {Db} = require('../connection');
const pkg=new mongoose.Schema({
  ImageUrl:{ type: String, required: true },
  Name:{ type: String, required: true },
  Destinations:{ type: Array, required: true },
  Duration:{ type: String, required: true },
  pkgType:{ type: String, required: true },
  tourInfo:{ type: Array, required: true },
  importantInfo:{ type: Array, required: true },
  advisor:{ type: String, required: true }
},{timestamps:true})
module.exports= Db.model('packages',pkg)
