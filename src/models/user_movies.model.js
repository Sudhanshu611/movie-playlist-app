
export const insertUserMovie = 'INSERT INTO user_movies(user_id, movie_id, status, personal_rating) VALUES($1,$2,$3,$4) RETURNING *';
export const selectMovieId= 'SELECT * FROM user_movies WHERE user_id = $1 AND movie_id = $2';
export const deleteMovie= 'DELETE FROM user_movies WHERE movie_id = $1 AND user_id = $2 RETURNING *';
export const updateUserMovies = 'UPDATE user_movies SET status = $1, personal_rating = $2 WHERE user_id = $3 AND movie_id = $4 RETURNING *';