const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/multer');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const passport = require('passport');

const bookings = require('../db/models/bookings');
const package = require('../db/models/package');
const blog = require('../db/models/blog');
const image = require('../db/models/gallery');
const Admin = require('../db/models/admin');
const reveiw = require('../db/models/reveiw');
const { v4: uuidv4 } = require('uuid');
const {sendEmail}=require('../utils/nodemailer');
const other=require('../db/models/other');



function generateId(){
    const uuid = uuidv4();
       return uuid
}




router.post("/register",upload.none(), function (req, res) { 
    console.log(req.body)
    Admin.register(new Admin({ email: req.body.email, username: req.body.username, secret:generateId() }), req.body.password, function (err, user) { 
        if (err) { 
            res.json({ success: false, message: "Your account could not be saved. Error: " + err }); 
        } 
        else { 
            req.login(user, (er)=>{ 
                if (er) { 
                    res.json({ success: false, message:er }); 
                    console.log(err)
                } 
                else { 
                    res.json({ success: true, message: "Your account has been saved" }); 
                } 
            }); 
        } 
    }); 
  });
router.post("/login", upload.none(), function (req, res) {
    if (!req.body.username) {
        res.json({ success: false, message: "Username was not given" })
    }
    else if (!req.body.password) {
        res.json({ success: false, message: "Password was not given" })
    }
    else {
        passport.authenticate("local", function (err, user, info) {
            if (err) {
                res.json({ success: false, message: err });
            }
            else {
                if (!user) {
                    res.json({ success: false, message: "username or password incorrect" });
                }
                else {

                    req.login(user, async (err) => {
                        if (err) {
                            return res.json({ message: 'Error during logging in', error: true });
                        } else {
                            return res.json({ message: 'Login Successfull', login: true });
                        }
                    })
                }
            }
        })(req, res);
    }
});
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

router.get('/login',async (req, res) => {
   try{
  res.render('admin-login')
}catch(error){
    console.log(error)
}
})
//.......................................................................//
function processString(input) {
    input = input.replace(/\/n/g, '<br>').replace(/\/hr/g, '<hr>');
    return input;
}
//..............................................................................................///
router.get('/dashboard', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const package_count = await package.countDocuments();
            const registration_count = await bookings.countDocuments();
            const blog_count = await blog.countDocuments()
            const reveiw_count = await reveiw.countDocuments()
            const image_count=await image.countDocuments();
            let site_status=await other.find({ ['status']: true });
            if(site_status.length>0){
                site_status=true;
            }else{
                site_status=false;
            }
            res.render('admin-dashboard', { pkg_count: package_count, regis_count: registration_count, blog: blog_count, reveiws: reveiw_count,images:image_count,status:site_status, username: req.user.username })

        } catch (error) {

        }
    } else {
        res.redirect("/admin/login")    }
})


router.get('/registrations', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const registrations = await bookings.find().populate('selectedPackage').exec();
            res.render('admin-registrations', { booking_details: registrations })

        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        res.redirect("/admin/login")    }

})
router.get('/packages', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const get_packages = await package.find().lean();
            res.render('admin-packages', { packages: get_packages })
        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        res.redirect("/admin/login")    }
})
router.get('/blogs', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const get_blogs = await blog.find().lean();
            console.log(get_blogs)
            res.render('admin-blogs', { blogs: get_blogs })
        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        res.redirect("/admin/login")    }
})
router.get('/reveiws', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const get_reveiws = await reveiw.find().populate('source').exec();
            res.render('admin-reveiws', { reveiws: get_reveiws })
        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        res.redirect("/admin/login")    }
})
router.get('/gallery', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const get_images = await image.find().lean()
            res.render('admin-gallery', { images: get_images })
        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        res.redirect("/admin/login")    }
})

router.get('/upload-images', async (req, res) => {
    if (req.isAuthenticated()) {

        try {

            res.render('image-upload')
        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        res.redirect("/admin/login")    }
})
router.get('/upload-packages', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            res.render('admin-upload')
        } catch (error) {
            console.log(error)
        }
    } else {
        res.redirect("/admin/login")    }
})
router.post('/upload-package', upload.single('picture'), mongoSanitize(), xss(), async (req, res) => {
    if (req.isAuthenticated()) {

        const { packageName, Destinations, duration, pkgType, pkgCategory, advisor, tourInfo, aboutPlace, importantInfo, season, difficulty } = req.body;
        console.log(req.file)
        try {
            if (req.file && req.body) {
                const create_package = new package({
                    ImageUrl: '/images/packages/' + path.parse(req.file.originalname).name + '.webp',
                    Name: packageName,
                    Destinations: JSON.parse(Destinations).map((object) => object.value),
                    Duration: duration,
                    pkgType: pkgType,
                    catagory: pkgCategory,
                    tourInfo: JSON.parse(tourInfo),
                    importantInfo: JSON.parse(importantInfo),
                    season: season,
                    difficulty: difficulty,
                    about: processString(aboutPlace),
                    advisor: advisor
                })
                await sharp(req.file.buffer)
                    .webp({ quality: 50 })
                    .toFile('images/packages/' + path.parse(req.file.originalname).name + '.webp');
                await create_package.save();
                return res.json({ success: true, message: 'Upload Successfull' })


            }

        } catch (error) {
            console.log(error)
            if (error instanceof mongoose.Error.ValidationError) {
                const errorMessage = error.message;
                return res.json({ error: true, message: errorMessage })
            } else {

                if (error.code === 11000) {
                    return res.json({ error: true, message: "Duplicate Image Url Found" })
                } else {
                    return res.json({ error: true, message: "An error occured please contact us" })
                }
            }

        }
    } else {
        res.redirect("/admin/login")    }
})
router.post('/update-package', upload.none(), mongoSanitize(), xss(), async (req, res) => {
    if (req.isAuthenticated()) {

        const { id, field, value } = req.body;
        try {
            const updatePackage = await package.updateOne({ _id: id }, { $set: { [field]: value } });
            console.log(updatePackage)
            return res.json({ error: false, message: 'Update Successfull' })
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Update Failed' })
        }

    } else {
        res.redirect("/admin/login")    }
})
router.get('/upload-blogs', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            res.render('blog-upload')
        } catch (error) {
            console.log(error)
        }
    } else {
        res.redirect("/admin/login")    }
})
router.get('/upload-reveiw', async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            res.render('reveiw-upload')
        } catch (error) {
            console.log(error)
        }
    } else {
        res.redirect("/admin/login")    }
})

router.post('/upload-reveiw', upload.none(), mongoSanitize(), xss(), async (req, res) => {
    if (req.isAuthenticated()) {
        const { feedback, description, author } = req.body;
        try {
            if (req.body) {
                const ObjectId = mongoose.Types.ObjectId;
                const create_reveiw = new reveiw({
                    stars: feedback,
                    description: description,
                    source: new ObjectId('65d1c426204d38751727fb8e'),
                    authorAdmin: author,
                })
                await create_reveiw.save();
                res.json({ success: true, message: 'Upload Successfull' })
            }

        } catch (error) {
            console.log(error)

        }
    } else {
        res.redirect("/admin/login")    }
})


router.post('/upload-blog', upload.single('picture'), mongoSanitize(), xss(), async (req, res) => {
    if (req.isAuthenticated()) {

        const { blogName, Description, author, category, authorInfo } = req.body;

        try {
            if (req.file && req.body) {
                const create_blog = new blog({
                    ImageUrl: '/images/blogs/' + path.parse(req.file.originalname).name + '.webp',
                    blogHeading: blogName,
                    author: author,
                    authorInfo: authorInfo,
                    category: category,
                    blogDescription: processString(Description)
                })
                await sharp(req.file.buffer)
                    .webp({ lossless: true })
                    .toFile('images/blogs/' + path.parse(req.file.originalname).name + '.webp');
                await create_blog.save();
                res.json({ success: true, message: 'Upload Successfull' })



            }

        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                const errorMessage = error.message;
                res.json({ error: true, message: errorMessage })
            } else {
                if (error.code === 11000) {
                    res.json({ error: true, message: "Duplicate Image Url Found" })
                } else {
                    res.json({ error: true, message: "An error occured please contact us" })
                }
            }

        }
    } else {
        res.redirect("/admin/login")    }
});

router.post('/upload-image', upload.single('picture'), mongoSanitize(), xss(), async (req, res) => {
    if (req.isAuthenticated()) {
        const { Heading } = req.body;

        try {
            if (req.file && req.body) {
                await sharp(req.file.buffer)
                    .webp({ lossless: true })
                    .toFile('images/gallery/' + req.file.originalname);
                const new_image = new image({
                    ImageUrl: '/images/gallery/' + req.file.originalname,
                    ImageHeading: Heading,
                })

                await new_image.save();
                res.json({ success: true, message: 'Upload Successfull' })
            }

        } catch (error) {
            console.log(error)
            if (error instanceof mongoose.Error.ValidationError) {
                const errorMessage = error.message;
                res.json({ error: true, message: errorMessage })
            } else {
                if (error.code === 11000) {
                    res.json({ error: true, message: "Duplicate Image Url Found" })
                } else {
                    res.json({ error: true, message: "An error occured please contact us" })
                }
            }

        }
    } else {
        res.redirect("/admin/login")    }
})


router.delete('/delete/:id', upload.none(), mongoSanitize(), xss(), async (req, res) => {
    const { collectionName } = req.body;
    if (req.isAuthenticated()) {
        const id = req.params.id;
        if (id.length > 25) {
            res.json({ error: true, message: "Invalid Parameter" });
            return;
        }

        try {
            let Model;
            switch (collectionName) {
                case 'blog':
                    Model = blog;
                    break;
                case 'package':
                    Model = package;
                    break;
                case 'gallery':
                    Model = image;
                    break;
                case 'reveiw':
                    Model = reveiw;
                    break;

                    default:
                    throw new Error('Invalid collection name');
            }
            const imagedata = await Model.findOne({ _id: id });

            const result = await Model.deleteOne({ _id: id });

             const imageUrl=imagedata.ImageUrl;
                    if (imageUrl !=='') {
                        const rootFolder = path.resolve('.');
                        const imagePath = path.join(rootFolder + imageUrl);
                        await fs.unlink(imagePath);
                    }
                    console.log(result)
                    res.json({ error: false, message: "Deleted Successfully" });
        
        }catch (error) {
                console.log(error);
                res.status(500).json({ error: true, message: "Internal Server Error" });
            }
        } else {
            res.redirect("/admin/login")        }
    });
  router.post('/send-feedback-mail',upload.none(),mongoSanitize(),xss(), async(req,res)=>{
    console.log(req.body)
    const {email,id,name}=req.body;

    try {
        const template = {
            content: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Feedback</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        h3 {
                            color: #555;
                            text-align: center;
                        }
                        p{
                            text-align: center;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .feedback-link {
                            display: block;
                            width: fit-content;
                            margin: 20px auto;
                            padding: 10px 20px;
                            background-color: #ff8d1d;
                            color: #fff!important;
                            text-decoration: none;
                            text-align: center;
                            border-radius: 4px;
                        }
                        .feedback-link:hover {
                            background-color: #f87c00;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Hi, ${name} Welcome to Escorted holidays</h1>
                        <h3>We'd love to hear your feedback.</h3>
                        <p>Click the link below to provide your feedback:</p>
                        <a href="https://myholidayadvice.onrender.com/post-reveiw/${id}" class="feedback-link">Provide Feedback</a>
                    </div>
                </body>
                </html>
            `,subject:'Feedback Escorted Holidays'
        };
        await sendEmail(email,template)
        res.json({error:false, message:"Email sent Successfully"})
        
    } catch (error) {
        console.log(error)
        res.json({error:true, message:"Failed to send Email"})
    }

  })

  router.post('/maintenance',upload.none(),async (req, res) => {
    console.log(req.body.timeline)
    console.log(req.body.status)
    try{
        const result= await other.find({});
        if(result.length===0){
    const status=new other({
        timeline:req.body.timeline,
        status:req.body.status
    })
     const saved=await status.save();
     if(saved.status){
        res.json({ ON:true,message: 'Maintanence Mode turned ON'})
    }else{
        res.json({ON:false,message: 'Maintanence Mode turned OFF'})
    }

}else{
        const timeandstatus=await other.findOneAndUpdate({ _id: result[0]._id }, { status: req.body.status ,timeline:req.body.timeline},{new:true})
        if(timeandstatus.status){
            res.json({ ON:true,message: 'Maintanence Mode turned ON'})
        }else{
            res.json({ON:false,message: 'Maintanence Mode turned OFF'})
        }
}

    }catch(error)   {
console.log(error)
    }
  
  });

module.exports = router;