var express = require('express')
var app = express()
var User= require('../model/user')
var passport = require('passport')
var jwtToken = require('../jwt-token')



app.post('/login',passport.authenticate('local'),(req,res,next)=>{

    const token = jwtToken.getToken({_id:req.user._id})
    res.cookie('token',token,{signed:true})

    res.json({result:{token:token }, message:'Logged In Successfull', success:true})
    
})

app.post('/signup',(req,res,next)=>{

    User.find({email:req.body.emaii},(err,user)=>{

        if(err) return res.json(500,{result:err, success:false, message: 'Internal server error'})
        if(user) return res.json(402,{result:null,success:false,message:"Email Id already Attached with another account"})

        User.register(new User({username:req.body.username,email:req.body.email}), req.body.password, (err,user)=>{

            if(err) return res.json(500,{result:err, success:false, message: 'Internal server error'})
            
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