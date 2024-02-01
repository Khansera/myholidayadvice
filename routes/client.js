const express = require('express');
const router = express.Router();
const {upload}=require('../middlewares/multer')

const pkg = require('../db/models/package')
const booking = require('../db/models/bookings')

//............Home page...............//
router.get(['/', '/home'], async (req, res) => {
    res.render('index');
})

//.............get packages....................//
router.get('/packages/:pkg_type', async (req, res) => {
    const pkg_type = req.params.pkg_type;
    try {
        const packages = await pkg.find({ pkgType: pkg_type }).lean()
        if (packages.length > 0) {
            //  res.json({message:"fetched successfully"})
            res.render('packages', { packages })
        } else {
            res.json({ error: true, message: 'no package found' })
        }
        // const package = new pkg({
        //     ImageUrl: '/wedwun',
        //     Name: 'Golden Traingle with Kashmir',
        //     Destinations: ['dehli','agra','srinagar','gulmarg','pahalgam'],
        //     Duration: '6 nights / 7 days',
        //     pkgType: pkg_type,
        // })
        // await package.save()
    } catch (error) {
        res.json({ error: true, message: error })
    }
})
//............Get package details.............//
router.get('/packages/details/:pkg_id', async (req, res) => {
    const pkg_id = req.params.pkg_id;
    try {
        const packages = await pkg.findOne({ _id: pkg_id }).lean()
        const pkgs_arr = [packages]
        if (pkgs_arr.length === 1)
            // res.json({ message: "fetched successfully" })
            res.render('package-details', { packagesDetails: pkgs_arr })
        else
            res.json({ error: true, message: 'no package found / wrong request' })


    } catch (error) {
        res.json({ error: true, message: error })
    }
})

//.................Book Package......................//

router.post('/packages/book',upload.none(), async (req, res) => {
    const{name, email, phone,personCount,adults,childrens,date,selectedPackage }=req.body;
    try {
        const findDuplicate = await booking.findOne({
            $or: [
              { Phone: phone },
              { Email: email },
            ],
          }).lean();        if(findDuplicate){
            res.json({duplicate:true, message:'Already Registered Please Contact Us'})
        }else{
            const createBooking = new booking({
                Name: name,
                Email: email,
                Phone: phone,
                personCount: personCount,
                Adults: adults,
                Childrens: childrens,
                Date: date,
                selectedPackage: selectedPackage
            })
            await createBooking.save();
            res.json({success:true, message:'Booking Successfull'})
        }
    } catch (error) {
    console.log(error)
    res.json({error:true, message:'An Error Occured'})
    }
})












module.exports = router;