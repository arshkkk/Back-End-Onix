var express = require('express')
var app = express()
var User= require('../model/user')
var passport = require('passport')
var jwtToken = require('../auth')
var sendEmail = require('../sendEmail')

const emailConfirmed = (req,res,next)=>{
    User.findById(req.user._id,(err,user)=>{
        if(err) {
            res.statusCode = 500
            return next(err)
        }
        if(user.verified===false)
        return res.status(401).send("Email_Not_Verified")

        next()
    })
}

app.post('/login',passport.authenticate('local',{session:false}),emailConfirmed,(req,res,next)=>{

    const token = jwtToken.getToken({_id:req.user._id})

    res.json({result:{token:token }, message:'Logged In Successfull', success:true})
    
})

app.post('/register',(req,res,next)=>{

    console.log('inside register')

    User.findOne({email:req.body.email},(err,user)=>{
     
        console.log(err) 
        console.log(user)
        if(err) return res.status(500).json({result:err, success:false, message: 'Internal server error'})
        if(user) return res.status(401).json({result:null,success:false,message:"Email Id already Attached with another account"})

        User.register(new User({username:req.body.username,email:req.body.email,full_name:req.body.full_name}), req.body.password, (err,user)=>{

            console.log(err) 
            console.log(user)
            
            if(err) return res.json(200,{result:null, success:false, message: 'Username already registered'})
            
            sendEmail.sendMailForVerification({req,email:req.body.email,_id:user._id})
            res.json(200,{result:user,success:true,message:"Registration Successfull"})

        })

    })
   

})

app.get('/logout',(req,res,next)=>{

    res.clearCookie('token')
    req.session.destroy()

    res.json({result:null, success:true, message:'Logged Out Successfully'})

})

module.exports = app