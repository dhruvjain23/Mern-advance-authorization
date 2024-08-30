import jwt from 'jsonwebtoken'

export const verifyToken= (req,res,next)=>{
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({success:false,message:"Unauthorized : NoToken Provided"})
    }
    try {
     const decoded  = jwt.verify(token, `${process.env.JWT_SECRET_KEY}` || 'mySecretkey');
     if(!decoded){
        return res.status(401).json({success:false,message:"Unauthorized : Invalid token Provided"})
     }
     req.userId = decoded.userId;   
    next();
    } catch (error) {
        console.log("Error in verifying the token",error)
       return res.status(401).json({success:false,message:"Server Error"});
    }
}

