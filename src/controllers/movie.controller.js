import pool from '../models/db.js'
import {insertMovies, selectMovies} from '../models/movie.model.js';
import { loginSelectUser } from '../models/user.model.js';
import { insertUserMovie , selectMovieId, deleteMovie, updateUserMovies} from '../models/user_movies.model.js';



export async function insertMovie(req, res) {
    const {movie, status, personalRating} = req.body;
    const {username} = req.user;
    console.log('Received user:', username); // Debug logging
    console.log('Received movie:', movie); // Debug logging
    console.log('movie: ' + movie);
    console.log('user: ' + username);
    console.log('status: ' + status);
    console.log('rating: ' + personalRating);
    if (!movie || !username || !status || personalRating === undefined || personalRating === null) {
        return res.status(404).json({err : 'All fields are required.'})
        }
        const movieData = [
            movie.imdbID,
            movie.Title,
            movie.Year,
            movie.Rated,
            movie.Released,
            movie.Runtime,
            movie.Genre,
            movie.Director,
            movie.Writer,
            movie.Actors,
            movie.Plot,
            movie.Language,
            movie.Country,
            movie.Awards,
            movie.Poster,
            movie.imdbRating,
            movie.imdbVotes,
            movie.BoxOffice
        ]
        
        try{
        const userData = await pool.query('SELECT id FROM users WHERE username =$1', [username]);
        const userId = userData.rows[0].id;

        const movieMatch = await pool.query(selectMovies, [movie.imdbID]);
        
        if (movieMatch.rows.length === 0) {
            const insertIntoMovies = await pool.query(insertMovies, movieData);
        }
        
        const userMovieMatch = await pool.query(selectMovieId, [userId, movie.imdbID]);

        if (userMovieMatch.rows.length > 0) return res.status(409).json({err : 'Movie already exists for the user.'});

        const insertIntoUserMovies = await pool.query(insertUserMovie, [userId, movie.imdbID, status, personalRating]);

        res.status(200).json({msg : {userMovies : insertIntoUserMovies.rows[0]}});
        
    }catch(err){
        console.log(err.message)
        res.status(500).json({err : err.message});
        return;
    }

}

export async function deleteMovies(req, res){
    const {id} = req.params;
    const {username} = req.user;
    if (!id || !username) return res.status(404).json({err : 'All fields are required.'})
    try{
        const userData = await pool.query('SELECT id FROM users WHERE username =$1', [username]);
        if (userData.rows.length === 0) return res.status(404).json({ err: 'User not found.' });

        const userId = userData.rows[0].id;

        const deleteUserMovie = await pool.query(deleteMovie, [id, userId]);

        if (deleteUserMovie.rows.length === 0) return res.status(404).json({ err: 'Movie not found for this user.' });

        res.status(200).json({msg : 'Success', deletdMovie : deleteUserMovie.rows[0]})
        
    }catch(err){
        res.status(500).json({err : err.message});
        return;
    }
}

export async function selectUserMovies(req, res) {
    const { username } = req.user;
    if (!username) return res.status(404).json({ err: 'Username not found.' });

    try {
        // Get the user ID
        const userData = await pool.query(loginSelectUser, [username]);
        if (userData.rows.length === 0)
            return res.status(404).json({ err: 'User does not exist.' });

        const userId = userData.rows[0].id;

        // Get all movies for the user in one query
        // This assumes selectMoviesForUser is a JOIN between the user-movie link table and the movies table
        const moviesData = await pool.query(
            `
            SELECT m.* 
            FROM movies m
            INNER JOIN user_movies um ON um.movie_id = m.id
            WHERE um.user_id = $1
            `,
            [userId]
        );

        if (moviesData.rows.length === 0)
            return res.status(404).json({ err: 'No movie found for the user.' });

        res.status(200).json({ movies: moviesData.rows });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ err: err.message });
    }
}

export async function selectMovieInfo(req, res){
    const {id} = req.params;
    const { username } = req.user;
    if (!id || !username) return res.status(404).json({err : 'ID/Username not found.'});
    
    try{
        const movieInfo = await pool.query(selectMovies, [id]);
        if (movieInfo.rows.length === 0) return res.status(404).json({err : 'Cannot find this movie.'});

        const userData = await pool.query(loginSelectUser, [username]);
        if (userData.rows.length === 0)
            return res.status(404).json({ err: 'User does not exist.' });

        const userId = userData.rows[0].id;

        const userMovieData = await pool.query('SELECT status, personal_rating FROM user_movies WHERE user_id = $1 AND movie_id = $2',[userId, id]);

        res.status(200).json({movieInfo : movieInfo.rows[0], userInfo : userMovieData.rows[0]});
        return;

    }catch(err){
        console.log(err.message);
        return res.status(500).json({err : err.message});
    }

}

export async function updateUserMovie(req, res){
    const { id } = req.params;
    const { username } = req.user;
    const {status, personalRating} = req.body;

    if (!id || !username) return res.status(404).json({err : 'ID/Username not found.'});

    try{
        const userData = await pool.query(loginSelectUser, [username]);
        if (userData.rows.length === 0)
            return res.status(404).json({ err: 'User does not exist.' });

        const userId = userData.rows[0].id;
        const updateData = await  pool.query(updateUserMovies, [status, personalRating, userId, id]);

        

        return res.status(200).json({updatedData : updateData.rows[0]});
    }catch(err){
        console.log(err.message);
        return res.status(500).json({err : err.message});
    }
}