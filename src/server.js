import express from 'express';
import cookieParser from 'cookie-parser';
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import authRouter from './routes/auth.routes.js';
import movieRouter from './routes/movie.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = fileURLToPath(dirname(import.meta.url));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));
// Router
app.use('/auth', authRouter);
app.use('/movie', movieRouter)


app.get('/{*any}', (req, res) => {
    res.sendFile(join(__dirname, '../public/login.html'));
})

app.listen(PORT, () => console.log('Listening at ' + PORT))