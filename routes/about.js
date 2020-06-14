var app = require('express')()
var User = require('../model/user')
var auth = require('../auth')

app.get('/',auth.verifyUser,(req,res,next)=>{
    console.log(req.user)
    User.findById(req.user._id,(err,user)=>{
        if(err) return res.json(500,{result:err, success:false, message: 'Internal server error'})
        if(!user) return res.json(401,{result:null,success:false,message:'user not present'})
        res.json(200,{result:{email:user.email,full_name:user.full_name,username:user.username}, success:true, message:"user data successfully fetched from server"})
    })

})

module.exports = app