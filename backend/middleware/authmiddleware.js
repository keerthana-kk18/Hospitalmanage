import jwt from 'jsonwebtoken'

export const verifytoken=(req,res,next)=>{
    const authheader=req.headers.authorization
    if(!authheader){
        return res.status(401).json({message:'Access Denied: No token provided'})
    }
    let token=''
    if(authheader.startsWith('Bearer ')){
        token=authheader.slice(7,authheader.length).trim()
    }else{
        token=authheader.trim()
    }
    if(token.startsWith('"')&& token.endsWith('"')){
        token=token.slice(1,-1)
    }
    try{
        const verifieddata=jwt.verify(token, process.env.JWT_SECRET)
        req.user=verifieddata
        next();
    }catch(error){
        console.log("BACKEND JWT VERIFICATION ERROR:", error.message);
        res.status(403).json({message:'Invalid or expired token'})
    }
}