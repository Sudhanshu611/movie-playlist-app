import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = async (req, res, next)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        await jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) return res.status(400).json({err : err.message});
            console.log(user);
            req.user = user;
            next();
        }) 
    }catch(err){
        console.log(err.message)
        return res.status(400).json({err : err.message});
    }
}

export default verifyToken;