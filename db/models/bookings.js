const mongoose=require('mongoose');
const {Db} = require('../connection');
const bookings=new mongoose.Schema({
  Name:{ type: String, required: true },
  Email:String,
  Phone:{ type: Number, required: true },
  personCount:{ type: Number, required: true },
  Adults:Number,
  Childrens:Number,
  Date:{ type: String, required: true },
  selectedPackage:{ type: mongoose.Schema.Types.ObjectId, ref:'packages' }
},{timestamps:true})
module.exports= Db.model('bookings',bookings);
