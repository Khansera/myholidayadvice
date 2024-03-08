require('dotenv').config()
const express= require('express');
const path = require('path')
const app=express();
const{checkMaintenanceMode}=require('./middlewares/checksiteStatus')
const navLinks=require('./db/models/navLinks')

app.set('view engine', 'ejs');
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/images', express.static(path.join(__dirname, '/images')));

async function fetchNavbarData(req, res, next) {
    try {
        const navbarData = await navLinks.find().exec(); 
        res.locals.navbarData = navbarData; 
        next();
    } catch (error) {
        next(error);
    }
}

require('./middlewares/passport-config')(app);

const cleint_routes=require('./routes/client');
const admin_routes=require('./routes/admin');



app.use('/admin',admin_routes);
app.use('/',checkMaintenanceMode,fetchNavbarData,cleint_routes);


// app.use(errorHandler);



const port= process.env.PORT || 8000;
app.listen(`${port}`,()=>{
    console.log(`server is running on port ${port}`)
})