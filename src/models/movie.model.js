// selectUser insertUser deleteUser
export const selectMovies = 'SELECT * FROM movies WHERE id = $1';
export const insertMovies = 'INSERT INTO movies (id, title, year, rated, released, runtime, genre, director,writer, actors, plot, language, country, awards, poster,imdb_rating, imdb_votes, box_office) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *';
export const deleteMovie = 'DELETE FROM movies WHERE id  = $1 RETRUNING *';
