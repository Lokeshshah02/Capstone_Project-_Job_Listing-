const asyncHandler = require('../middleware/asyncHandler')
const jwt = require('jsonwebtoken')
require('dotenv').config();


const validateTokenHandler = asyncHandler(async(req,res,next)=>{
   const accessToken = req.headers.authorization || req.headers.Authorization
   console.log(accessToken)
   console.log("requesting body", req.body)
    
   if(accessToken && accessToken.startsWith("Bearer")){
    const token = accessToken.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          res.status(400);
          throw new Error("User is not authorized");
        }
        req.body.user = decoded.user;
        next();
      });
      
   }else{
       res.status(400)
       throw new Error("Token is missing")
   }
   
})


module.exports = validateTokenHandler;