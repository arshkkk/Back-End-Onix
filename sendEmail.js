var nodemailer = require('nodemailer')
var config = require('./config')
var auth = require('./auth')

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'arshmobilem2@gmail.com',
        pass:process.env.pass
    }   
})

var mailOptions = {
    from:'arshmobilem2@gmail.com',
    to:'',
    subject:'Onix Advisors : Verify Your Email',
  
}



exports.sendMailForVerification = ({req,email,_id})=>{
    mailOptions.to = email
    mailOptions.html=`<h1>Verify Your Email</h1> 
                      <a href=http://${req.host}/confirm-email/${auth.getTokenForEmaiVerification({_id:_id})}>Click Here</a>`

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) return console.log(err)
        console.log('Email Sent: '+ info.response)
    })
}