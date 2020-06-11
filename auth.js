var jwt = require('jsonwebtoken')
var config = require('./config')

const getJwtTokenFromRequest= (req)=>{

    const token = req.headers.authorization.split(' ')[1]
    return token
    
}

// Takes Payload Object and gets _id and creates and signs a token using secret key in config.js and returns it to /user/login 
    // In routes/user.js
exports.getToken = ({_id})=>{
    return jwt.sign({_id:_id},config.secretKey,{expiresIn:config.expiresIn_JWT})
}


//Verifies User using Token provided by user In Cookies and Moves the request forward
// There are multiple methods to store the JWT token but I've stored it inside cookies
// After verifying user it populates user object on reqest object which contains _id reference to user in Mongodb database
exports.verifyUser = (req,res,next)=>{

    if(req.headers.authorization)
    var token = getJwtTokenFromRequest(req)
    else if(req.signedCookies.token)
    var token = req.signedCookies.token
    else
    return res.json({success:false, result:null, message:'You  are not logged In'})

    console.log(token)

    jwt.verify(token,config.secretKey,(err,payload)=>{

        
        if(err) {
            res.clearCookie('token')
            return res.json({success:false, result: err, message: 'Token Expired or Invalid, Please login again'})

         }

        req.user._id = payload._id
        next()

    })
}

