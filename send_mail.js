const nodemailer = require("nodemailer");


module.exports = (data) => {
    const {name, email, contact, message} = data

    let transporter;
    let from;
    const to = "JMallet@surflinegh.com";

    if (process.env.NODE_ENV === "development") {
        transporter = nodemailer.createTransport({
            host: "webmail.surflinegh.com",
            secureConnection: true,

            auth: {
                user: 'egh00047',
                pass: 'Egy@poli123'
            },
            connectionTimeout: 5000

        });
        from = "spolley@surflinegh.com";


    } else {
        transporter = nodemailer.createTransport({
            host: "172.25.36.10",
            port: 825,
            secure: false,
            tls: {

                rejectUnauthorized: false
            },
            connectionTimeout: 5000
        });

        from = "servicedesk@surflinegh.com";

    }

    const messageBody = `
<p style="font-size: 16px">Dear<strong> Call Centre,</strong></p>
<p style="font-size: 16px">Please find below the details of the user requesting for a call back.</p>
<p style="font-size: 16px"><strong>Name:</strong>&nbsp;&nbsp; <i>${name} </i></p>
<p style="font-size: 16px"><strong> Email:</strong> &nbsp;&nbsp;<i>${email}</i> </p>
<p style="font-size: 16px"><strong>Phone Contact:</strong>&nbsp;&nbsp; <i>${contact}</i></p>
 <p style="font-size: 16px"><strong>Message:</strong>&nbsp;&nbsp;<i>${message}</i></p>
<br>
<br>
 <p style="font-size: 16px"><i>Your Surfline IT Team</i> </p>
`;

    const mailOptions = {
        from: from,
        to: to,
        subject: 'Coverage Checker Web - Customer Request',
        html: messageBody
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error)
        return res.json({status: "success"})

    });


}



