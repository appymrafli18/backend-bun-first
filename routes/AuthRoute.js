import express from 'express';
import { Login, Logout, getMe, refreshToken } from '../controllers/AuthControllers.js';

const router = express.Router();

router.post('/login', Login);
router.get('/me', getMe);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
