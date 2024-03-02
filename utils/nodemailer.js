const nodemailer = require("nodemailer");

async function sendEmail( to,body){
    console.log(to)
    try{
    const transporter = nodemailer.createTransport({
        host: `${process.env.HOST}`,
        port: 465,
        auth: {
            user: 'info@myholidayadvice.com',
            pass: `${process.env.CDP}`
        }
    });

    const mailOptions = {
        from:'info@myholidayadvice.com',
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