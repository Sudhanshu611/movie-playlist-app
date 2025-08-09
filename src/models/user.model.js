// register
export const registerSelectUser = 'SELECT * FROM users WHERE username = $1 OR email = $2';
export const registerInsertUser = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
// login
export const loginSelectUser = 'SELECT * FROM users WHERE username = $1';

// Delete user
export const deleteUser = 'DELETE FROM users WHERE username  = $1 RETURNING *';