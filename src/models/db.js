import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host : 'localhost',
    port : 5432,
    password : process.env.DB_PASS,
    user : 'postgres',
    database : 'movie-database-app'
})

export default pool;