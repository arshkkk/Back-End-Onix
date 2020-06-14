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

exports.getTokenForEmaiVerification = ({_id})=>{
    return jwt.sign({_id:_id},config.secretKey,{expiresIn:config.expiresIn_For_Email_Verification})
}

exports.verifyTokenForEmailVerification = (token,next,callback) =>{
    
    jwt.verify(token,config.secretKey,(err,payload)=>{
        if(err){
            return next(new Error("Link has been Expired"))
        }
        return callback(payload)
    })
}




//Verifies User using Token provided by user In Cookies and Moves the request forward
// There are multiple methods to store the JWT token but I've stored it inside cookies
// After verifying user it populates user object on reqest object which contains _id reference to user in Mongodb database
exports.verifyUser = (req,res,next)=>{

    console.log(req.headers)
    if(req.headers.authorization)
    var token = getJwtTokenFromRequest(req)
    else res.json(401,{success:false,message:"Not logged In"})
  
    console.log(token)

    jwt.verify(token,config.secretKey,(err,payload)=>{

        if(err) {
            return res.json(401,{success:false, message: 'Token Expired or Invalid, Please login again'})
         }
        req.user = {_id:payload._id}
        next()

    })
}


