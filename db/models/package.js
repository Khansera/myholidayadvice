const mongoose=require('mongoose');
const {Db} = require('../connection');
const pkg=new mongoose.Schema({
  ImageUrl:{ type: String, unique:true, required: [true, 'Please enter a valid Image Path'],unique:true, trim:true },
  Name:{ type: String, required: [true, 'Please enter a valid Name'] ,trim:true},
  Destinations:{ type: Array, required: [true, 'Please enter the valid Destination'] ,trim:true},
  Duration:{ type: String, required: [true, 'Please enter the valid Duration'] ,trim:true},
  location:{ type: String, required: [true, 'Please enter the valid Duration'] ,trim:true,lowercase:true},
  pkgType:{ type: String, required: [true, 'Please enter the valid Package Type'] },
  tourInfo:{ type: Array, required: [true, 'Please enter the valid Tour Info'] ,trim:true},
  importantInfo:{ type: Array, trim:true},
  about:{ type: String, required: [true, 'Please enter a valid Description'],trim:true },
  season:{ type: String, trim:true },
  difficulty:{ type: String,trim:true },
  advisor:{ type: String, required: [true, 'Please enter a valid Advisor Name'],trim:true },
  catagory:{type:String, trim:true},
  tag:{type:String,required:[true, 'Please enter a valid tag name'],default:'normal'}
},{timestamps:true})
module.exports= Db.model('packages',pkg)
