import { jwtTokens , encryptPassword, comparePassword} from "../utils/utils.js";
import pool from '../models/db.js'
import {registerInsertUser, registerSelectUser, loginSelectUser, deleteUser} from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) =>{
    const {username, email, password} = req.body;
    if (!username || !email || !password) return res.status(400).json({err: "All fields are required."});
    try{
        const userExists = await pool.query(registerSelectUser, [username, email]);
        if (userExists.rows.length > 0) return res.status(409).json({err: "User already exists."});
        const hashPassword = await encryptPassword(password);
        const addedUser = await pool.query(registerInsertUser, [username, email, hashPassword]);
        const {accessToken, refreshToken} = await jwtTokens({username : username})
        res.cookie('refreshToken', refreshToken);
        res.status(200).json({accessToken : accessToken, refreshToken : refreshToken});
    }catch(err){
        console.log('ERR: ' + err.message);
        return res.status(400).json({err : err.message})
    }
}

export const loginUser = async (req, res) =>{
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({err: "All fields are required."});
    try{
        const userExists = await pool.query(loginSelectUser, [username]);
        if (userExists.rows.length === 0) return res.status(404).json({err: "User does not exist."});
        const passwordMatch = comparePassword(password, userExists.rows[0].password);
        if(!passwordMatch) return res.status(401).json({err: "Password does not match."});
        const {accessToken, refreshToken} = await jwtTokens({username : username})
        res.cookie('refreshToken', refreshToken, {httpOnly : true});
        res.status(200).json({accessToken : accessToken, refreshToken : refreshToken});
    }catch(err){
        return res.status(400).json({err : err.message})
    }
}

export const refreshAccessToken = async (req,res) =>{
    const token = req.cookies.refreshToken;

    if (!token)  return res.status(404).json({err: "Session Expired."});
    try{
        await jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
            if (err) return res.status(400).json({err : err.message});
            const {exp, iat, ...userData} = user;
            let tokens = await jwtTokens(userData);
            res.cookie('refreshToken', tokens.refreshToken, {httpOnly : true});
            res.status(200).json({tokens});
        })
    }catch(err){
        return res.status(400).json({err : err.message})
    }
}

export const logout = async (req, res) =>{
    res.clearCookie('refreshToken', {httpOnly : true});
    res.status(200).json({msg : 'Cookie deleted'});
}

export const removeUser = async (req, res) =>{
    const {username} = req.user;

    if (!username) return res.status(404).json({err : 'Username not provided.'});

    try{
        const userDeleted = await pool.query(deleteUser, [username]);
    
        if (userDeleted.rows.length === 0) return res.status(404).json({err : 'No user found.'});
    
        const user = userDeleted.rows[0].username;
        res.clearCookie('refreshToken', {httpOnly : true});
        return res.status(200).json({ msg: `User ${user} deleted.` });
    }catch(err){
        return res.status(400).json({err : err.message});
    }

}