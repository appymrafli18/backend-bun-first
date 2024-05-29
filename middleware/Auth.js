import jwt from 'jsonwebtoken';
import Users from '../models/UsersModel';

export const verifyUser = (req, res, next) => {
  const authHead = req.headers.authorization;
  if (!authHead) return res.status(400).json({ status: 'Invalid', msg: 'Silahkan Login Dahulu' });
  const splitToken = authHead.split(' ')[1];

  jwt.verify(splitToken, Bun.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ status: 'Invalid', msg: 'Akses telah Kadaluarsa' });

    const { id, uuid, role } = decoded;

    req.userId = id;
    req.role = role;
    req.userUUID = uuid;

    next();
  });
};

export const adminOnly = async (req, res, next) => {
  const response = await Users.findOne({
    where: {
      id: req.userId,
    },
  });

  if (!response) return res.status(400).json({ status: 'Invalid', msg: 'Akun tidak di temukan' });
  if (response.role !== 'admin') return res.status(403).json({ status: 'Invalid', msg: 'Tidak Memiliki Akses' });
  next();
};

export const penjualOnly = async (req, res, next) => {
  const response = await Users.findOne({
    where: {
      id: req.userId,
    },
  });

  if (!response) return res.status(400).json({ status: 'Invalid', msg: 'Akun tidak di temukan' });
  if (response.role !== 'penjual') return res.status(403).json({ status: 'Invalid', msg: 'Tidak Memiliki Akses' });
  next();
};

export const KurirOnly = async (req, res, next) => {
  const response = await Users.findOne({
    where: {
      id: req.userId,
    },
  });

  if (!response) return res.status(400).json({ status: 'Invalid', msg: 'Akun tidak di temukan' });
  if (response.role !== 'kurir') return res.status(403).json({ status: 'Invalid', msg: 'Tidak Memiliki Akses' });
  next();
};

export const customerOnly = async (req, res, next) => {
  const response = await Users.findOne({
    where: {
      id: req.userId,
    },
  });

  if (!response) return res.status(400).json({ status: 'Invalid', msg: 'Akun tidak di temukan' });
  if (response.role !== 'Customer') return res.status(403).json({ status: 'Invalid', msg: 'Tidak Memiliki Akses' });
  next();
};
