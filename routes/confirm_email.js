const express = require('express')
const app = express()
const auth = require('../auth')
const config = require('../config')
const User = require('../model/user')

app.get('/:token',(req,res,next)=>{
    console.log(req.params)
    auth.verifyTokenForEmailVerification(req.params.token,next,payload=>{

        User.findByIdAndUpdate(payload._id,{verified:true},(err,user)=>{
            if(err) {
                res.statusCode = 500
                return next(new Error('Internal Server Error'))
            }
            if(!user) return next(new Error('User not Exists'))
            
            res.redirect(`https://${process.env.frontEndUrl}`)
        })
    })
})

module.exports = app