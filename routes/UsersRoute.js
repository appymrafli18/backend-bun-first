import express from 'express';
import { deleteUsers, getUsers, getUsersById, postUsers, updateUsers } from '../controllers/UsersControllers.js';
import { adminOnly, verifyUser } from '../middleware/Auth.js';

const router = express.Router();

router.get('/users', verifyUser, getUsers);
router.get('/users/:id', verifyUser, getUsersById);
router.post('/users', verifyUser, adminOnly, postUsers);
router.patch('/users/:id', verifyUser, adminOnly, updateUsers);
router.delete('/users/:id', verifyUser, adminOnly, deleteUsers);

export default router;
