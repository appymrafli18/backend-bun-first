import express from 'express';
import { createTransaksi, deleteTransaksi, getSpesifikTransaksi, getTransaksi, updateTransaksi } from '../controllers/TransaksiControllers.js';
import { customerOnly, verifyUser } from '../middleware/Auth.js';

const router = express.Router();

router.get('/transaksi', verifyUser, getTransaksi);
router.get('/transaksi/:id', verifyUser, getSpesifikTransaksi); // testing nanti
router.post('/transaksi', verifyUser, customerOnly, createTransaksi);
router.patch('/transaksi/:id', verifyUser, updateTransaksi); // testing
router.delete('/transaksi/:id', verifyUser, customerOnly, deleteTransaksi); // testing

export default router;
