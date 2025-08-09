import { registerUser, loginUser, refreshAccessToken, logout, removeUser} from "../controllers/auth.controller.js";
import express from 'express';
import verifyToken from "../middleware/auth.middleware.js";
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = fileURLToPath(dirname(import.meta.url));


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.delete('/delete',verifyToken ,removeUser);
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ msg: 'Access granted', user: req.user });
    // res.sendFile(join(__dirname, '../../public/dashboard.html'));
});



export default router;