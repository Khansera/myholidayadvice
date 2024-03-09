const mongoose=require('mongoose');
const {Db} = require('../connection');
const bookings=new mongoose.Schema({
  Name:{ type: String, required: [true, 'Please enter a valid Name'],trim:true},
  Email:{type:String, unique:true},
  Phone:{ type: Number, required: [true, 'Please enter a valid Phone Number'],unique:true,trim:true },
  personCount:{ type: Number, required: [true, 'Please enter a valid Person Count'],trim:true },
  Adults:Number,
  Childrens:Number,
  Date:{ type: String, required: [true, 'Please enter a valid Date'],trim:true },
  selectedPackage:{ type: mongoose.Schema.Types.ObjectId, ref:'packages', required: [true, 'Please provide a valid id'] },
  uniqueId: { type: String, required: [true, 'Please enter a valid Date'],trim:true }
},{timestamps:true})
module.exports= Db.model('bookings',bookings);
