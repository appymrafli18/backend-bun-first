import Barang from '../models/BarangModel.js';
import Users from '../models/UsersModel.js';
import fs from 'fs';

export const getBarang = async (req, res) => {
  if (req.role == 'admin' || req.role == 'penjual' || req.role == 'Customer') {
    try {
      const response = await Barang.findAll({
        attributes: {
          exclude: ['id', 'userId'],
        },
        include: {
          model: Users,
          as: 'pemilik',
          attributes: ['nama', 'telepon'],
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

export const getSpesifikasiBarang = async (req, res) => {
  if (req.role == 'admin' || req.role == 'penjual' || req.role == 'Customer') {
    try {
      const response = await Barang.findOne({
        attributes: {
          exclude: ['id', 'userId'],
        },
        where: {
          uuid: req.params.id,
        },
        include: {
          model: Users,
          as: 'pemilik',
          attributes: ['nama', 'telepon'],
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

export const createBarang = async (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'Invalid', msg: 'Wajib menyertakan gambar' });
  if (req.file.size >= 5_000_000) return res.status(400).json({ status: 'Invalid', msg: 'Gambar tidak boleh lebih dari 5mb' });
  const { nama, harga, deskripsi, quantity } = req.body;
  const url = `${req.protocol}://${req.get('host')}/barang/${req.file.filename}`;

  const payloadToQuery = {
    nama_barang: nama,
    harga_barang: harga,
    deskripsi_barang: deskripsi,
    quantity,
    nama_image_barang: req.file.filename,
    url_barang: url,
    userId: req.userId,
  };

  try {
    await Barang.create(payloadToQuery);
    res.status(200).json({ status: 'Success', msg: 'Berhasil membuat barang' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const updateBarang = async (req, res) => {
  const search = await Barang.findOne({ where: { uuid: req.params.id } });
  if (!search) return res.status(404).json({ status: 'Invalid', msg: 'Barang tidak di temukan' });
  const { nama, harga, deskripsi, quantity } = req.body;
  let url, images;

  if (!req.file) {
    images = search.nama_image_barang;
    url = search.url_barang;
  } else {
    if (req.file.size >= 5_000_000) return res.status(400).json({ status: 'Invalid', msg: 'Gambar tidak boleh lebih dari 5mb' });
    fs.unlinkSync(`./public/barang/${search.nama_image_barang}`);
    url = `${req.protocol}://${req.get('host')}/barang/${req.file.filename}`;
    images = req.file.filename;
  }

  const payloadToQuery = {
    nama_barang: nama || search.nama_barang,
    harga_barang: harga || search.harga_barang,
    deskripsi_barang: deskripsi || search.deskripsi_barang,
    quantity: quantity || search.quantity,
    nama_image_barang: images,
    url_barang: url,
  };

  try {
    await Barang.update(payloadToQuery, { where: { id: search.id } });
    res.status(200).json({ status: 'Success', msg: 'Berhasil memperbarui barang' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    const response = await Barang.findOne({ where: { uuid: req.params.id } });
    if (!response) res.status(404).json({ status: 'Invalid', msg: 'Barang tidak di temukan' });
    await Barang.destroy({ where: { id: response.id } });
    fs.unlinkSync(`./public/barang/${response.nama_image_barang}`);
    res.status(200).json({ status: 'Success', msg: 'Berhasil menghapus barang' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
