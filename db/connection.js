const mongoose = require('mongoose');

  const Db=mongoose.createConnection(`${process.env.MONGOURL}`, {
  });
  Db.on('connected', () => {
    console.log('Connected to the database successfully');
  });
  
  Db.on('error', (err) => {
    console.error('Error connecting to the database:', err);
  });
  module.exports={Db};