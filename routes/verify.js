const express = require('express')
const app = express()
const User = require('../model/user')

app.post('/',(req,res,next)=>{

    User.findOne(req.body,(err,user)=>{

        if(err) return res.status(500).json({result:err, success:false, message: 'Internal server error'})
        if(user==null) return res.status(200).json({available:true,message:'Not present'})
        if(user) return res.status(200).json({available:false,message:'Already Present'})})
    
    })

module.exports = app