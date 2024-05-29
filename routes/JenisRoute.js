import express from 'express';
import { KurirOnly, verifyUser } from '../middleware/Auth.js';
import { createJenis, deleteJenis, getJenis, getSpesifikJenis, updateJenis } from '../controllers/JenisPengirimanControllers.js';
const router = express.Router();

router.get('/jenis', verifyUser, getJenis);
router.get('/jenis/:id', verifyUser, getSpesifikJenis);
router.post('/jenis', verifyUser, KurirOnly, createJenis);
router.patch('/jenis/:id', verifyUser, KurirOnly, updateJenis);
router.delete('/jenis/:id', verifyUser, KurirOnly, deleteJenis);

export default router;
