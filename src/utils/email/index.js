 import nodemailer from "nodemailer";
 export const sendEmail=async({to,subject,html})=>{
    const transporter= nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:"mavyaiman2@gmail.com",
            pass:"lyra yipq kxen eepm",
        }
    });

     await transporter.sendMail({
        from:" Sarah app <mavyaiman2@gmail.com>",
        to,
        subject,
        html,
    })
    .then(()=>console.log("Email sent successfully"))
    .catch((err)=>console.log(err))
}
