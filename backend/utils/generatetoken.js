import jwt from 'jsonwebtoken';

const generatetoken=(userid,role)=>{
    return jwt.sign(
        {
            id:userid,role:role},
        process.env.JWT_SECRET,
    {expiresIn:'24h'}
    )
}
export default generatetoken;