import { Op } from 'sequelize';
import Users from '../models/UsersModel.js';
import argon2 from 'argon2';

export const getUsers = async (req, res) => {
  if (req.role == 'admin' || req.role == 'penjual') {
    if (req.role == 'penjual') {
      try {
        const response = await Users.findAll({
          attributes: {
            exclude: ['id', 'password', 'token'],
          },
          where: {
            role: 'Customer',
          },
        });

        res.status(200).json({ status: 'Success', data: response });
      } catch (error) {
        res.status(404).json({
          status: 'invalid',
          msg: error.message,
        });
      }
    }

    try {
      const response = await Users.findAll({
        attributes: {
          exclude: ['id', 'password', 'token'],
        },
      });

      res.status(200).json({ status: 'Success', data: response });
    } catch (error) {
      res.status(404).json({
        status: 'invalid',
        msg: error.message,
      });
    }
  } else {
    res.status(403).json({ status: 'Invalid', msg: 'Tidak memiliki Hak Akses' });
  }
};

export const getUsersById = async (req, res) => {
  if (req.role == 'admin' || req.role == 'penjual') {
    if (req.role == 'penjual') {
      try {
        const response = await Users.findOne({
          attributes: {
            exclude: ['id', 'password', 'token'],
          },
          where: {
            [Op.and]: [{ uuid: req.params.id }, { role: 'Customer' }],
          },
        });

        res.status(200).json({ status: 'Success', data: response });
      } catch (error) {
        res.status(404).json({
          status: 'invalid',
          msg: error.message,
        });
      }
    }

    try {
      const response = await Users.findOne({
        attributes: {
          exclude: ['id', 'password', 'token'],
        },
        where: {
          uuid: req.params.id,
        },
      });

      res.status(200).json({ status: 'Success', data: response });
    } catch (error) {
      res.status(404).json({
        status: 'invalid',
        msg: error.message,
      });
    }
  } else {
    res.status(403).json({ status: 'Invalid', msg: 'Tidak memiliki Hak Akses' });
  }
};

export const postUsers = async (req, res) => {
  const { nama, email, password, confirmPassword, telepon, alamat } = req.body;

  if (password !== confirmPassword) return res.status(403).json({ status: 'Invalid', msg: 'Password diwajibkan untuk sama!' });

  try {
    const hashPassword = await argon2.hash(password);
    await Users.create({ nama, email, password: hashPassword, telepon, alamat });
    res.status(201).json({ status: 'Success', msg: 'Akun telah di daftarkan' });
  } catch (error) {
    res.status(400).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const updateUsers = async (req, res) => {
  const { nama, email, password, telepon, alamat, role, nama_kurir } = req.body;

  const search = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!search) return res.status(400).json({ status: 'Invalid', msg: 'Akun tidak di temukan' });
  let hashPassword;

  if (password == '' || password == null || password == undefined) {
    hashPassword = search.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  const queryUpdate = {
    nama: nama || search.nama,
    email: email || search.email,
    password: hashPassword,
    telepon: telepon || search.telepon,
    alamat: alamat || search.alamat,
    role: role || search.role,
    nama_kurir: nama_kurir || search.nama_kurir,
  };

  try {
    await Users.update(queryUpdate, { where: { id: search.id } });
    res.status(200).json({ status: 'Success', msg: 'Akun telah di perbarui' });
  } catch (error) {
    res.status(400).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const deleteUsers = async (req, res) => {
  const searchUsers = await Users.findOne({ where: { uuid: req.params.id } });
  if (!searchUsers) return res.status(400).json({ status: 'Invalid', msg: 'Akun tidak di temukan' });

  try {
    await Users.destroy({ where: { id: searchUsers.id } });
    res.status(200).json({ status: 'Success', msg: 'Akun telah di hapus secara permanent' });
  } catch (error) {
    res.status(400).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
