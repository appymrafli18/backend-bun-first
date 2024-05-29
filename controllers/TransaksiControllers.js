import { Op } from 'sequelize';
import Barang from '../models/BarangModel.js';
import JenisPengiriman from '../models/JenisModel.js';
import Kurir from '../models/KurirModel.js';
import Transaksi from '../models/TransaksiModel.js';
import Users from '../models/UsersModel.js';

export const getTransaksi = async (req, res) => {
  let response;
  if (req.role == 'admin') {
    response = await Transaksi.findAll({
      include: [
        {
          model: Barang,
          as: 'Barang',
          attributes: {
            exclude: ['id'],
          },
        },
        {
          model: Users,
          as: 'User',
          attributes: {
            exclude: ['password', 'id', 'nama_kurir', 'token'],
          },
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: {
            exclude: ['id', 'kurirId'],
          },
          include: [
            {
              model: Kurir,
              attributes: {
                exclude: ['id'],
              },
            },
          ],
        },
      ],
    });
  } else if (req.role == 'penjual') {
    response = await Transaksi.findAll({
      attributes: ['no_transaksi', 'status_pembayaran', 'status_pengiriman', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          as: 'User',
          attributes: ['uuid', 'nama', 'telepon', 'alamat'],
        },
        {
          model: Barang,
          as: 'Barang',
          where: { userId: req.userId },
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['nama_jenis', 'uuid', 'harga', 'type_pengiriman'],
          include: [
            {
              model: Kurir,
              attributes: ['uuid', 'nama_kurir', 'plat_kurir', 'url_photo'],
            },
          ],
        },
      ],
    });
    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Barang tidak di temukan' });
  } else if (req.role == 'kurir') {
    const searchUsers = await Users.findOne({
      where: {
        uuid: req.userUUID,
      },
      attributes: ['nama_kurir'],
    });

    const searchKurir = await Kurir.findOne({
      where: {
        nama_kurir: searchUsers.nama_kurir,
      },
      attributes: ['id'],
    });

    if (!searchUsers) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak memiliki akses ke transaksi ini' });

    response = await Transaksi.findAll({
      where: { kurirId: searchKurir.id },
      attributes: ['no_transaksi', 'status_pembayaran', 'status_pengiriman', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          as: 'User',
          attributes: ['uuid', 'nama', 'telepon', 'alamat'],
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['nama_jenis', 'uuid', 'harga', 'type_pengiriman'],
        },
      ],
    });
  } else {
    response = await Transaksi.findAll({
      where: {
        userId: req.userId,
      },
      attributes: {
        exclude: ['jenis_pengiriman_id', 'userId', 'barangId', 'id'],
      },
      include: [
        {
          model: Barang,
          as: 'Barang',
          attributes: ['nama_barang', 'harga_barang', 'quantity', 'url_barang'],
        },
        {
          model: Users,
          as: 'User',
          attributes: ['uuid', 'nama', 'email', 'telepon', 'alamat'],
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['nama_jenis', 'uuid', 'harga', 'type_pengiriman'],
          include: [
            {
              model: Kurir,
              attributes: ['uuid', 'nama_kurir', 'plat_kurir', 'url_photo'],
            },
          ],
        },
      ],
    });

    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });
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
export const getSpesifikTransaksi = async (req, res) => {
  let response;
  if (req.role == 'admin') {
    response = await Transaksi.findOne({
      where: {
        no_transaksi: req.params.id,
      },
      include: [
        {
          model: Barang,
          as: 'Barang',
          attributes: {
            exclude: ['id'],
          },
        },
        {
          model: Users,
          as: 'User',
          attributes: {
            exclude: ['password', 'id', 'nama_kurir', 'token'],
          },
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: {
            exclude: ['id', 'kurirId'],
          },
          include: [
            {
              model: Kurir,
              attributes: {
                exclude: ['id'],
              },
            },
          ],
        },
      ],
    });

    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Barang tidak di temukan' });
  } else if (req.role == 'penjual') {
    response = await Transaksi.findOne({
      where: {
        no_transaksi: req.params.id,
      },
      attributes: ['no_transaksi', 'status_pembayaran', 'status_pengiriman', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          as: 'User',
          attributes: ['uuid', 'nama', 'telepon', 'alamat'],
        },
        {
          model: Barang,
          as: 'Barang',
          where: { userId: req.userId },
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['nama_jenis', 'uuid', 'harga', 'type_pengiriman'],
          include: [
            {
              model: Kurir,
              attributes: ['uuid', 'nama_kurir', 'plat_kurir', 'url_photo'],
            },
          ],
        },
      ],
    });
    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });
  } else if (req.role == 'kurir') {
    // KURIR
    const searchUsers = await Users.findOne({
      where: {
        uuid: req.userUUID,
      },
      attributes: ['nama_kurir'],
    });

    const searchKurir = await Kurir.findOne({
      where: {
        nama_kurir: searchUsers.nama_kurir,
      },
      attributes: ['id'],
    });

    if (!searchUsers) return res.status(404).json({ status: 'Invalid', msg: 'Kurir tidak memiliki akses ke transaksi ini' });

    response = await Transaksi.findOne({
      where: {
        [Op.and]: [
          {
            kurirId: searchKurir.id,
          },
          {
            no_transaksi: req.params.id,
          },
        ],
      },
      attributes: ['no_transaksi', 'status_pembayaran', 'status_pengiriman', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          as: 'User',
          attributes: ['uuid', 'nama', 'telepon', 'alamat'],
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['nama_jenis', 'uuid', 'harga', 'type_pengiriman'],
        },
      ],
    });

    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });
    // KURIR
  } else {
    response = await Transaksi.findOne({
      where: {
        [Op.and]: [
          {
            no_transaksi: req.params.id,
          },
          {
            userId: req.userId,
          },
        ],
      },
      attributes: {
        exclude: ['jenis_pengiriman_id', 'userId', 'barangId', 'id'],
      },
      include: [
        {
          model: Barang,
          as: 'Barang',
          attributes: ['nama_barang', 'harga_barang', 'quantity', 'url_barang'],
        },
        {
          model: Users,
          as: 'User',
          attributes: ['uuid', 'nama', 'email', 'telepon', 'alamat'],
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['nama_jenis', 'uuid', 'harga', 'type_pengiriman'],
          include: [
            {
              model: Kurir,
              attributes: ['uuid', 'nama_kurir', 'plat_kurir', 'url_photo'],
            },
          ],
        },
      ],
    });

    if (!response) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });
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

export const createTransaksi = async (req, res) => {
  const { barang, selectedPengiriman } = req.query;
  // http://localhost:5000/transaksi/barang?=uuid&selectedPengiriman?=uuid

  const searchBarang = await Barang.findOne({
    where: {
      uuid: barang,
    },
    attributes: ['id', 'harga_barang'],
  });

  if (!searchBarang) return res.status(404).json({ status: 'Invalid', msg: 'Barang tidak di temukan' });

  const searchPengiriman = await JenisPengiriman.findOne({
    where: {
      uuid: selectedPengiriman,
    },
    attributes: ['id', 'harga'],
    include: [
      {
        model: Kurir,
        attributes: ['id'],
      },
    ],
  });

  if (!searchPengiriman) return res.status(404).json({ status: 'Invalid', msg: 'Jenis Pengiriman tidak di temukan' });

  const total = searchBarang.harga_barang + searchPengiriman.harga;

  const payloadQueryTransaksi = {
    total,
    userId: req.userId,
    barangId: searchBarang.id,
    jenis_pengiriman_id: searchPengiriman.id,
    kurirId: searchPengiriman.kurir.id,
  };

  try {
    await Transaksi.create(payloadQueryTransaksi);
    res.status(200).json({ status: 'Success', msg: 'Berhasil membuat Transaksi' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};

export const updateTransaksi = async (req, res) => {
  const searchTransaksi = await Transaksi.findOne({
    where: {
      no_transaksi: req.params.id,
    },
    include: [
      {
        model: Barang,
        as: 'Barang',
      },
    ],
  });

  // const { pembayaran, pengiriman } = req.body;

  if (!searchTransaksi) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });

  if (req.role == 'penjual') {
    if (searchTransaksi.Barang.userId !== req.userId) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });
    if (req.body.pembayaran === null || req.body.pembayaran === '' || req.body.pembayaran === undefined) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi gagal di update karena terdapat kesalahan' });
    await Transaksi.update(
      {
        status_pembayaran: req.body.pembayaran || searchTransaksi.status_pembayaran,
      },
      { where: { id: searchTransaksi.id } }
    );
  } else if (req.role == 'kurir') {
    const searchName = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    const searchKurir = await Kurir.findOne({
      where: {
        nama_kurir: searchName.nama_kurir,
      },
    });

    if (searchTransaksi.kurirId !== searchKurir.id) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });
    if (req.body.pengiriman === null || req.body.pengiriman === '' || req.body.pengiriman === undefined) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi gagal di update karena terdapat kesalahan' });
    await Transaksi.update(
      {
        status_pengiriman: req.body.pengiriman || searchTransaksi.status_pengiriman,
      },
      { where: { id: searchTransaksi.id } }
    );
  } else if (req.role == 'Customer') {
    const { barang, selectedPengiriman } = req.query;

    const searchTransaksi = await Transaksi.findOne({
      where: {
        [Op.and]: [
          {
            userId: req.userId,
          },
          {
            no_transaksi: req.params.id,
          },
        ],
      },
      include: [
        {
          model: Barang,
          as: 'Barang',
          attributes: ['id', 'harga_barang', 'userId'],
        },
        {
          model: JenisPengiriman,
          as: 'Jenis Pengiriman',
          attributes: ['id', 'harga'],
          include: [
            {
              model: Kurir,
              attributes: ['id'],
            },
          ],
        },
      ],
    });

    if (!searchTransaksi) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });

    const searchBarang = await Barang.findOne({
      where: {
        [Op.and]: [
          {
            uuid: barang || '',
          },
        ],
      },
    });

    let barangId, pengirimanId, total;

    if (!searchBarang) {
      barangId = searchTransaksi.barangId;
      total = searchTransaksi.total;
    } else {
      barangId = searchBarang.id;
      total = searchBarang.harga_barang;
    }

    const searchPengiriman = await JenisPengiriman.findOne({
      where: {
        uuid: selectedPengiriman || '',
      },
    });

    if (!searchPengiriman) {
      pengirimanId = searchTransaksi.jenis_pengiriman_id;
      total = searchTransaksi.total;
    } else {
      pengirimanId = searchPengiriman.id;
      total += searchPengiriman.harga;
    }

    const payload = {
      total,
      barangId,
      jenis_pengiriman_id: pengirimanId,
    };

    await Transaksi.update(payload, { where: { id: searchTransaksi.id } });
  } else {
    return res.status(404).json({ status: 'Invalid', msg: 'Tidak memiliki akses untuk merubah transaksi' });
  }

  try {
    res.status(200).json({ status: 'Success', msg: 'Berhasil merubah Transaksi' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
export const deleteTransaksi = async (req, res) => {
  const searchTransaksi = await Transaksi.findOne({
    where: {
      [Op.and]: [
        {
          no_transaksi: req.params.id,
        },
        {
          userId: req.userId,
        },
      ],
    },
  });

  if (!searchTransaksi) return res.status(404).json({ status: 'Invalid', msg: 'Transaksi tidak di temukan' });

  try {
    await Transaksi.destroy({
      where: {
        id: searchTransaksi.id,
      },
    });
    res.status(200).json({ status: 'Success', msg: 'Berhasil menghapus Transaksi' });
  } catch (error) {
    res.status(404).json({
      status: 'invalid',
      msg: error.message,
    });
  }
};
