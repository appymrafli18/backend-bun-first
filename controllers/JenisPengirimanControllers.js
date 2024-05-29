import { Op } from 'sequelize';
import JenisPengiriman from '../models/JenisModel.js';
import Kurir from '../models/KurirModel.js';
import Users from '../models/UsersModel.js';

export const getJenis = async (req, res) => {
  let response;
  if (req.role == 'admin' || req.role == 'Customer' || req.role == 'penjual') {
    response = await JenisPengiriman.findAll({
      attributes: {
        exclude: ['id', 'kurirId', 'createdAt', 'updatedAt'],
      },
    });
  } else {
    const searchUsers = await Users.findOne({
      where: {
        [Op.and]: [{ id: req.userId }, { role: req.role }],
      },
    });
    const searchKurir = await Kurir.findOne({ where: { nama_kurir: searchUsers.nama_kurir } });
    if (!searchUsers || !searchKurir) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

    response = await JenisPengiriman.findAll({
      attributes: {
        exclude: ['id', 'kurirId', 'createdAt', 'updatedAt'],
      },

      where: {
        kurirId: searchKurir.id,
      },
      include: [{
        model: Kurir,
      }]
    });
  }

  try {
    res.status(200).json({ status: 'Success', data: response });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const getSpesifikJenis = async (req, res) => {
  let response;
  if (req.role == 'admin' || req.role == 'Customer' || req.role == 'penjual') {
    response = await JenisPengiriman.findOne({
      attributes: {
        exclude: ['id', 'kurirId', 'createdAt', 'updatedAt'],
      },
      where: {
        uuid: req.params.id,
      },
    });
  } else {
    const searchUsers = await Users.findOne({
      where: {
        [Op.and]: [{ id: req.userId }, { role: req.role }],
      },
    });

    const searchKurir = await Kurir.findOne({ where: { nama_kurir: searchUsers.nama_kurir } });
    if (!searchUsers || !searchKurir) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

    response = await JenisPengiriman.findOne({
      attributes: {
        exclude: ['id', 'kurirId', 'createdAt', 'updatedAt'],
      },
      where: {
        [Op.and]: [{ uuid: req.params.id }, { kurirId: searchKurir.id }],
      },
    });
  }

  try {
    res.status(200).json({ status: 'Success', data: response });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const createJenis = async (req, res) => {
  const searchUsers = await Users.findOne({
    where: {
      [Op.and]: [{ id: req.userId }, { role: req.role }],
    },
  });
  const searchKurir = await Kurir.findOne({ where: { nama_kurir: searchUsers.nama_kurir } });
  if (!searchUsers || !searchKurir) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

  const { nama, deskripsi, harga, type } = req.body;

  const payload = {
    nama_jenis: nama,
    type_pengiriman: type,
    deskripsi,
    harga,
    kurirId: searchKurir.id,
  };

  try {
    await JenisPengiriman.create(payload);
    res.status(200).json({ status: 'Success', msg: 'Berhasil membuat jenis pengiriman' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const updateJenis = async (req, res) => {
  const searchUsers = await Users.findOne({
    where: {
      [Op.and]: [{ id: req.userId }, { role: req.role }],
    },
  });
  const searchKurir = await Kurir.findOne({ where: { nama_kurir: searchUsers.nama_kurir } });
  if (!searchUsers || !searchKurir) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

  const { nama, deskripsi, harga, type } = req.body;

  const payload = {
    nama_jenis: nama || searchKurir.nama_jenis,
    type_pengiriman: type || searchKurir.type_pengiriman,
    deskripsi: deskripsi || searchKurir.deskripsi,
    harga: harga || searchKurir.harga,
  };

  try {
    await JenisPengiriman.update(payload, { where: { uuid: req.params.id } });
    res.status(200).json({ status: 'Success', msg: 'Berhasil merubah data jenis pengiriman' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
export const deleteJenis = async (req, res) => {
  const searchUsers = await Users.findOne({
    where: {
      [Op.and]: [{ id: req.userId }, { role: req.role }],
    },
  });
  const searchKurir = await Kurir.findOne({ where: { nama_kurir: searchUsers.nama_kurir } });
  if (!searchUsers || !searchKurir) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak di temukan' });

  try {
    await JenisPengiriman.destroy({
      where: {
        [Op.and]: [
          {
            uuid: req.params.id,
          },
          {
            uuid: req.params.id,
          },
        ],
      },
    });

    res.status(200).json({ status: 'Success', msg: 'Berhasil menghapus data jenis pengiriman' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
