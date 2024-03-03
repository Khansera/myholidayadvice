const nodemailer = require("nodemailer");

async function sendEmail( to,body){
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
        from:'"Escorted Holidays"<info@myholidayadvice.com>',
        to: to,
        subject: body.subject,
        html:body.content,
    }

    const result=await transporter.sendMail(mailOptions)  
    return result.response;
}catch(error){
    console.error(error)
}
}
module.exports={sendEmail}