import Users from '../models/UsersModel.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const Login = async (req, res) => {
  const { email, password } = req.body;

  const response = await Users.findOne({
    where: {
      email,
    },
  });

  if (!response) return res.status(403).json({ status: 'Invalid', msg: 'Email Tidak Terdaftar' });

  const verifyPassword = await argon2.verify(response.password, password);
  if (!verifyPassword) return res.status(403).json({ status: 'Invalid', msg: 'Password anda salah' });

  try {
    const payload = {
      id: response.id,
      role: response.role,
      uuid: response.uuid,
    };

    const accessToken = jwt.sign(payload, Bun.env.ACCESS_TOKEN, {
      expiresIn: '5m',
    });

    const refreshToken = jwt.sign(payload, Bun.env.REFRESH_TOKEN, {
      expiresIn: '1d',
    });

    await Users.update({ token: refreshToken }, { where: { id: payload.id } });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 /* 1day */,
    });

    res.status(200).json({
      status: 'Success',
      msg: 'Selamat anda telah login',
      accessToken,
    });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(404).json({ status: 'Invalid', msg: 'Anda belum login!' });

    const response = await Users.findOne({
      attributes: {
        exclude: ['id', 'password', 'token'],
      },
      where: { token },
    });

    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Login terlebih dahulu' });

    res.status(200).json({
      status: 'Success',
      data: response,
    });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const Logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(404).json({ status: 'Invalid', msg: 'Anda belum login!' });

  try {
    await Users.update({ token }, { where: { token } });
    res.clearCookie('refreshToken');
    res.status(200).json({
      status: 'Success',
      msg: 'Anda telah logout',
    });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(404).json({ status: 'Invalid', msg: 'Tidak memiliki token' });

  jwt.verify(token, Bun.env.REFRESH_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ status: 'Invalid', msg: 'Silahkan Login terlebih dahulu' });

    const payload = {
      id: decoded.id,
      role: decoded.role,
      uuid: decoded.uuid,
    };

    const newToken = jwt.sign(payload, Bun.env.ACCESS_TOKEN, { expiresIn: '5m' });

    res.status(200).json({
      status: 'Success',
      msg: 'Berhasil mendapatkan new Token',
      token: newToken,
    });
  });
};

export const generateTransaksiNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // tambahkan leading zero jika bulan kurang dari 10
  const day = date.getDate().toString().padStart(2, '0'); // tambahkan leading zero jika tanggal kurang dari 10
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  // Contoh format nomor transaksi: T-20220514-153001-123
  return `T-${day}${month}${year}-${milliseconds}${seconds}${minutes}-${hours}`;
};
