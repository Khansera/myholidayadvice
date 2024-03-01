const nodemailer = require("nodemailer");

async function sendEmail( to,body){
    console.log(to)
    try{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: 'kali33613@gmail.com',
            pass: process.env.NMP
        }
    });

    const mailOptions = {
        to: to,
        subject: body.subject,
        html:body.content,
    }
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error)
        } else {
            console.log(info)
        }
    });
}catch(error){
    console.error(error)
}
}
module.exports={sendEmail}