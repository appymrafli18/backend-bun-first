import express from 'express';
import { createKurir, deleteKurir, getKurir, getSpesifikKurir, updateKurir } from '../controllers/KurirControllers.js';
import md5 from 'blueimp-md5';
import path from 'node:path';
import multer from 'multer';
import { adminOnly, verifyUser } from '../middleware/Auth.js';

const router = express.Router();

// storage image
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/kurir');
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

router.get('/kurir', verifyUser, getKurir);
router.get('/kurir/:id', verifyUser, getSpesifikKurir);
router.post('/kurir', verifyUser, adminOnly, upload.single('picture'), createKurir);
router.patch('/kurir/:id', verifyUser, adminOnly, upload.single('picture'), updateKurir);
router.delete('/kurir/:id', verifyUser, adminOnly, deleteKurir);

export default router;
