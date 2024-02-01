const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/multer');
const sharp = require('sharp');
const path = require('path')

const bookings = require('../db/models/bookings');
const package = require('../db/models/package');


router.get('/login', (req, res) => {
    res.json({ message: 'logged in successfully' })
})

router.get('/dashboard',async (req, res) => {
    try {
        const package_count=await package.countDocuments();
        const registration_count=await bookings.countDocuments();
        res.render('admin-dashboard',{pkg_count:package_count,regis_count:registration_count})

    } catch (error) {
        
    }
})
router.get('/registrations', async (req, res) => {
    try {
        const registrations = await bookings.find().populate('selectedPackage').exec();
        console.log(registrations)
        res.render('admin-registrations', { booking_details: registrations })

    } catch (error) {
        console.log(error)
        throw error
    }
})
router.get('/packages', async (req, res) => {
    try {
        const get_packages = await package.find().lean();
        res.render('admin-packages', { packages: get_packages })
    } catch (error) {
        console.log(error)
        throw error
    }
})
router.get('/upload-packages',async(req,res)=>{
    try {
        res.render('admin-upload')
    } catch (error) {
        console.log(error)
    }
})
router.post('/upload-package', upload.single('picture'), async (req, res) => {
    const { packageName, Destinations, duration, pkgType, advisor, tourInfo, importantInfo } = req.body;
    try {
        if (req.file && req.body) {
            const create_package = new package({
                ImageUrl: '/src/images/' + path.parse(req.file.originalname).name + '.webp',
                Name: packageName,
                Destinations: JSON.parse(Destinations).map((object) => object.value),
                Duration: duration,
                pkgType: pkgType,
                tourInfo: JSON.parse(tourInfo),
                importantInfo: JSON.parse(importantInfo),
                advisor: advisor
            })
            await create_package.save();
            await sharp(req.file.buffer)
                .resize({ width: 300, height: 300 })
                .webp({ quality: 50 })
                .toFile('src/images/' + path.parse(req.file.originalname).name + '.webp');
            res.json({ success: true, message: 'Upload Successfull' })            
                      }
 
        res.json({ success: false, message: "Incompelete Details Provided" })

    } catch (error) {
        console.log(error)
        res.json({ error: true, message: 'An Error Occured' })

    }
})
router.delete('/delete-package/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await package.deleteOne({ _id: id })
        console.log(result)
        res.json({error:false, message:"Deleted Successfully"})
    } catch (error) {
        console.log(error)
        throw error
    }
})

module.exports = router;