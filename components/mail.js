'use strict';
const nodemailer = require('nodemailer');

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
    function sendMail(moreMailOptions) {

        mailOptions.to      = moreMailOptions.to;
        mailOptions.subject = moreMailOptions.subject;
        mailOptions.text    = moreMailOptions.text;
        mailOptions.html    = moreMailOptions.html;

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