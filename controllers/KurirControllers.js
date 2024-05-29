import argon2 from 'argon2';
import fs from 'fs';
import Kurir from '../models/KurirModel.js';
import Users from '../models/UsersModel.js';

export const getKurir = async (req, res) => {
  if (req.role == 'admin' || req.role == 'penjual' || req.role == 'Customer') {
    try {
      const response = await Kurir.findAll({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt'],
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
export const getSpesifikKurir = async (req, res) => {
  if (req.role == 'admin' || req.role == 'penjual' || req.role == 'Customer') {
    try {
      const response = await Kurir.findOne({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt'],
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

export const createKurir = async (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'Invalid', msg: 'Wajib menyertakan gambar' });
  const { nama, email, password, confirmPassword, telepon, alamat, plat } = req.body;

  const search = await Users.findOne({ where: { email }, attributes: ['email'] });
  if (search && search.email == email.toLowerCase()) {
    fs.unlinkSync(`./public/kurir/${req.file.filename}`);
    return res.status(400).json({ status: 'Invalid', msg: 'Email telah terdaftar' });
  }

  if (password !== confirmPassword) return res.status(403).json({ status: 'Invalid', msg: 'Password diwajibkan untuk sama!' });
  if (req.file.size >= 5_000_000) return res.status(400).json({ status: 'Invalid', msg: 'Gambar tidak boleh lebih dari 5mb' });

  const url = `${req.protocol}://${req.get('host')}/kurir/${req.file.filename}`;

  try {
    const hashPassword = await argon2.hash(password);
    await Users.create({ nama, email, password: hashPassword, telepon, alamat, role: 'kurir', nama_kurir: nama });
    await Kurir.create({ nama_kurir: nama, plat_kurir: plat, nama_photo: req.file.filename, url_photo: url });
    res.status(201).json({ status: 'Success', msg: 'Akun kurir mu telah di daftarkan' });
  } catch (error) {
    res.status(400).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const updateKurir = async (req, res) => {
  const searchKurir = await Kurir.findOne({ where: { uuid: req.params.id } });
  const search = await Users.findOne({
    where: {
      nama_kurir: searchKurir.nama_kurir,
    },
  });
  if (!searchKurir || !search) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

  const { nama, email, password, telepon, alamat, plat } = req.body;
  let url, images, hashPassword;

  if (!req.file) {
    images = searchKurir.nama_photo;
    url = searchKurir.url_photo;
  } else {
    if (req.file.size >= 5_000_000) return res.status(400).json({ status: 'Invalid', msg: 'Gambar tidak boleh lebih dari 5mb' });
    fs.unlinkSync(`./public/kurir/${searchKurir.nama_photo}`);
    images = req.file.filename;
    url = `${req.protocol}://${req.get('host')}/kurir/${req.file.filename}`;
  }

  if (password == '' || password == null || password == undefined) {
    hashPassword = search.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  const payloadQueryUsers = {
    nama: nama || search.nama,
    email: email || search.email,
    password: hashPassword,
    telepon: telepon || search.telepon,
    alamat: alamat || search.alamat,
    nama_kurir: nama || search.nama,
  };

  const payloadQueryKurir = {
    nama_kurir: nama || searchKurir.nama_kurir,
    plat_kurir: plat || searchKurir.plat_kurir,
    nama_photo: images,
    url_photo: url,
  };

  try {
    await Users.update(payloadQueryUsers, { where: { id: search.id } });
    await Kurir.update(payloadQueryKurir, { where: { id: searchKurir.id } });
    await res.status(200).json({ status: 'Success', msg: 'Berhasil memperbarui Kurir' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
export const deleteKurir = async (req, res) => {
  const searchKurir = await Kurir.findOne({ where: { uuid: req.params.id } });
  const searchUsers = await Users.findOne({ where: { nama_kurir: searchKurir.nama_kurir } });

  if (!searchKurir || !searchUsers) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

  try {
    await Kurir.destroy({ where: { id: searchKurir.id } });
    await Users.destroy({ where: { id: searchUsers.id } });
    fs.unlinkSync(`./public/kurir/${searchKurir.nama_photo}`);
    await res.status(200).json({ status: 'Success', msg: 'Berhasil menghapus Kurir' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
