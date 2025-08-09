import brcypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function encryptPassword(password){
    const hashPassword = brcypt.hash(password, 10);
    return hashPassword;
}
export function comparePassword(password, hashedPassword){
    const result = brcypt.compare(password, hashedPassword);
    return result;
}

export async function jwtTokens(user) {
    const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '30m'});   
    const refreshToken = await jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: '1h'});
    return {accessToken, refreshToken};   
}