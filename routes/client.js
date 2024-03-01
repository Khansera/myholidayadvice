const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/multer')
const { body, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const mongoose=require('mongoose');
const pkg = require('../db/models/package')
const booking = require('../db/models/bookings');
const blog=require('../db/models/blog');
const reveiw=require('../db/models/reveiw')
const gallery=require('../db/models/gallery');
const {sendEmail}=require('../utils/nodemailer');
const { v4: uuidv4 } = require('uuid');
const bookings = require('../db/models/bookings');

//....................Special Functions...............///
function generateId(){
    const uuid = uuidv4();
       return uuid
}


// router.get('/error',(req,res)=>{
//     throw new Error('wrong')
// })
//............Home page...............//
router.get(['/', '/home'], async (req, res) => {
    try {
        const packages = await pkg.find({ tag: 'popular' }).lean();
        const blogs= await blog.find({}).lean();
        const reveiws= await reveiw.find().populate('source').exec();
        const filteredData = reveiws.map((item) => {
            const { stars, description, source: { Name }, authorAdmin } = item._doc;
          
            return { stars, description, Name, authorAdmin };
          });
          
        return res.render('index',{packages,blogs,reveiws:filteredData});
    } catch (error) {
        return res.json({ error: true, message: 'Error loading data' })
    }

})
router.get('/refund-policy',(req,res)=>{
    res.render('refund')
})
router.get('/privacy-policy',(req,res)=>{
    res.render('privacy')
})
//.............get packages....................//
router.get('/packages/:pkg_type', xss(), async (req, res) => {
    if(req.params.pkg_type.length>100){
        return res.json({error:true, message:'Invalid paramater'})
    }   
     const pkg_type = mongoSanitize.sanitize(req.params.pkg_type);
    try {
        if(pkg_type==='all'){
            const packages = await pkg.find().lean();
            return res.render('packages', { packages,type:pkg_type  })
        }else{
        const packages = await pkg.find({ pkgType: pkg_type }).lean()
        if (packages.length > 0) {
            return res.render('packages', { packages,type:pkg_type })
        } else {
            return res.json({ error: true, message: 'no package found' })
        }
    }
    } catch (error) {
        console.error(error)
        res.json({ error: true, message: error })
    }
})
//..................Get blog details...............//
router.get('/blog/details/:blog_id', xss(), async (req, res) => {
    if(req.params.blog_id.length>100){
        return res.json({error:true, message:'Invalid paramater'})
    } 
    const blog_id = mongoSanitize.sanitize(req.params.blog_id);
    try {
        const blogs = await blog.findOne({ _id: blog_id }).lean();
            return res.render('blog-details', { blogs })
    } catch (error) {
        console.error(error)
        res.json({ error: true, message: error })
    }
})
//............Get package details.............//
router.get('/packages/details/:pkg_id', xss(), async (req, res) => {
    if(req.params.pkg_id.length>100){
        return res.json({error:true, message:'Invalid paramater'})
    } 
    const pkg_id = mongoSanitize.sanitize(req.params.pkg_id);
    try {
        const packages = await pkg.findOne({ _id: pkg_id }).lean();

            return res.render('package-details', { packages })

    } catch (error) {
        console.error(error)
        res.json({ error: true, message: error })
    }
})
//.....................Gallery Route...................//
router.get('/gallery',async (req,res)=>{
    try {
        const images=await gallery.find().lean();
        res.render('gallery',{images});
        
    } catch (error) {
        console.error(error)
    }
})
//................team..................//
router.get('/team',async (req,res)=>{
    try {
        res.render('team');
        
    } catch (error) {
        console.error(error)
    }
})
//................About Us...........................//
router.get('/about',async (req,res)=>{
    try {
        res.render('about');
        
    } catch (error) {
        console.error(error)
    }
})
//.................Book Package......................//


const bookingSchema = [
    body('email').isEmail().withMessage('Enter a valid Email').isLength({ min: 10, max: 100 }).withMessage('Email: max 100 characters'),
    body('phone').toInt().isMobilePhone().withMessage('Enter a valid phone number').isLength({ min: 10, max: 30 }).withMessage('Phone: Enter Min 10 and Max 30'),
    body('personCount').isLength({ min: 1, max: 3 }).withMessage('PersonCount: Enter Min 1 and Max 3'),
    body('adults').isLength({ min: 0, max: 3 }).withMessage('Adults: Enter Min 0 and Max 3'),
    body('childrens').isLength({ min: 0, max: 3 }).withMessage('Childrens: Enter Min 0 and Max 3'),
    body('date').isDate().isLength({ max: 50 }).withMessage('Enter valid Date'),
    body('selectedPackage').isLength({ max: 50 }),
]
router.post('/packages/book', upload.none(), bookingSchema, xss(), mongoSanitize(), async (req, res) => {
    const { name, email, phone, personCount, adults, childrens, date, selectedPackage } = req.body;

    const emailTemplate= {content:`
<div>
    <h2>Hi, Mushtaq Hussain we have a new registration</h2>
    <ul>
        <li><label>Name:</label>${name}</li>
        <li><label>Email:</label>${email}</li>
        <li><label>Phone:</label>${phone}</li>
        <li><label>Person Count:</label>${personCount}</li>
        <li><label>Adults:</label>${adults}</li>
        <li><label>Childrens:</label>${childrens}</li>
        <li><label>Tour-Date:</label>${date}</li>
        <li><label>Selected Package:</label>Visit Admin Panel</li>
    </ul>
</div>
<br>
Click <a href="https://myholidayadvice.onrender.com/admin/dashboard">Go to Admin pannel for details</a>.
`,subject:'Escorted Holiday Registration'}

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ schemaError: true, message: errors.array(), title: 'error' });
    }
    try {
            const createBooking = new booking({
                Name: name,
                Email: email,
                Phone: phone,
                personCount: personCount,
                Adults: adults,
                Childrens: childrens,
                Date: date,
                selectedPackage: selectedPackage,
                uniqueId:generateId()
            })
            await createBooking.save();
            await sendEmail('escortedholidays110@gmail.com',emailTemplate);
            return res.json({ error: false, message: 'Booking Successfull', title: 'success' })
    } catch (error) {

        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = error.message;
            return res.json({error:true, message:errorMessage, title:'error'})  
        }else{
            if(error.code===11000){
               return res.json({ error: true, message:"Already registered please contact us" })
            }else{
                return res.json({ error: true, message:"An error occured please contact us" ,title:'error' })
            }
        }
    }
})
//.................Submit Reveiw.......................//
router.get('/post-reveiw/:uniqueId',async(req,res)=>{

    const id=mongoSanitize.sanitize(req.params.uniqueId);
    try {
        const searchId=await bookings.findOne({uniqueId:id})
        if(!searchId){
            res.json({error:true, message:'invalid Id'})
        }else{
            res.render('reveiw',{user:{name:searchId.Name,id:searchId.uniqueId}})
        }
    } catch (error) {
        console.error(error)
    }

})
router.post('/submit-reveiw/:uniqueId',upload.none(),xss(),mongoSanitize(),async(req,res)=>{
      const {feedback,description}=req.body;
      const id=mongoSanitize.sanitize(req.params.uniqueId)

      try {
        const duplicate=await reveiw.findOne({reveiwId:id}).lean();
        if(!!duplicate){
            res.json({error:true, message:'ALready Submitted'})
        }else{
            const author=await bookings.findOne({uniqueId:id})
            const create_reveiw=new reveiw({
                stars:feedback,
                description:description,
                reveiwId:id,
                source:author._id
            })
            create_reveiw.save();
            res.json({success:true,message:'Submitted successfully'})
        }
      } catch (error) {
        console.error(error)
      }
      


})


module.exports = router;