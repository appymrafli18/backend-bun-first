import express from 'express';
import multer from 'multer';
import { createBarang, deleteBarang, getBarang, getSpesifikasiBarang, updateBarang } from '../controllers/BarangControllers.js';
import md5 from 'blueimp-md5';
import path from 'node:path';
import { penjualOnly, verifyUser } from '../middleware/Auth.js';

const router = express.Router();

// storage image
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/barang');
  },

  filename: (req, file, cb) => {
    const uniqueFile = new Date().getTime();
    const hashPath = path.parse(file.originalname);
    const { name, ext } = hashPath;
    const nameMd5 = md5(name);
    cb(null, `${uniqueFile}-${nameMd5}${ext}`);
  },
});

// Filterisasi File Images
const filterFile = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: filterFile });

router.get('/barang', verifyUser, getBarang);
router.get('/barang/:id', verifyUser, getSpesifikasiBarang);
router.post('/barang', verifyUser, penjualOnly, upload.single('picture'), createBarang);
router.patch('/barang/:id', verifyUser, penjualOnly, upload.single('picture'), updateBarang);
router.delete('/barang/:id', verifyUser, penjualOnly, deleteBarang);

export default router;
