require('dotenv').config()
const express= require('express');
const path = require('path')
const app=express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



app.set('view engine', 'ejs');
app.use('/src', express.static(path.join(__dirname, '/src')))

const cleint_routes=require('./routes/client');
const admin_routes=require('./routes/admin');


app.use('/', cleint_routes);
app.use('/admin',admin_routes)





const port=3000;
app.listen(`${port}`,()=>{
    console.log(`server is running on port ${port}`)
})