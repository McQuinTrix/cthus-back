'use strict';
const nodemailer = require('nodemailer'),
    confirmEmailTemplate = require('./mail-templates/confirmEmail');

function mailObject(emailPassword){
    // setup email data with unicode symbols
    var mailOptions = {
        from: '"Cryptonthus Support" <support@cryptonthus.com>' // sender address
    };

    // Reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'support@cryptonthus.com',
            pass: emailPassword
        }
    });

    //Send Mail function
    function sendMail(argumentOptions) {

        mailOptions.to      = argumentOptions.to;
        mailOptions.from    = argumentOptions.from;
        mailOptions.subject = argumentOptions.subject;
        mailOptions.text    = argumentOptions.text;
        mailOptions.html    = argumentOptions.html;

        if(argumentOptions.type === "confirmEmail"){
            mailOptions.html = confirmEmailTemplate(argumentOptions.link);
        }

        /* 
            to: 'harshal.carpenter@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
         */

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);

            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    }
    return {
        sendMail : sendMail
    }
}

module.exports = mailObject;