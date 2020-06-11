var app = require('express')()
var User = require('../model/user')

app.get('/',(req,res,next)=>{

    User.findById(req.user._id,(err,user)=>{
        if(err) return res.json(500,{result:err, success:false, message: 'Internal server error'})
        
        res.json(200,{result:{email,username}, success:true, message:"user data successfully fetched from server"})
    })

})