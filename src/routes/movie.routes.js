import {insertMovie, deleteMovies,selectUserMovies, selectMovieInfo, updateUserMovie} from '../controllers/movie.controller.js';

import verifyToken from '../middleware/auth.middleware.js';

import express from 'express';

const router = express.Router();

router.post('/insert',verifyToken, insertMovie);
router.get('/userMovies',verifyToken, selectUserMovies);
router.delete('/delete/:id', verifyToken, deleteMovies);
router.get('/details/:id', verifyToken, selectMovieInfo);
router.put('/update/:id', verifyToken, updateUserMovie);

export default router;