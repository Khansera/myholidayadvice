require('dotenv').config()
const express= require('express');
const path = require('path')
const app=express();
const{ipFilterMiddleware}=require('./middlewares/ipfilter');
const{checkMaintenanceMode}=require('./middlewares/checksiteStatus')


app.set('view engine', 'ejs');
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/images', express.static(path.join(__dirname, '/images')));
// function errorHandler(err, req, res, next) {
//     console.log(err.stack); 
//     console.log(req)
  
//     res.status(500); 
//     res.send('<h1>error</h1>'); 
//   }
  

require('./middlewares/passport-config')(app);

const cleint_routes=require('./routes/client');
const admin_routes=require('./routes/admin');



app.use('/admin',ipFilterMiddleware,admin_routes);
app.use('/',checkMaintenanceMode, cleint_routes);


// app.use(errorHandler);



const port= process.env.PORT || 8000;
app.listen(`${port}`,()=>{
    console.log(`server is running on port ${port}`)
})