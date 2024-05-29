import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import JenisPengiriman from './JenisModel.js';
import Users from './UsersModel.js';
import Barang from './BarangModel.js';
import { generateTransaksiNumber } from '../controllers/AuthControllers.js';
import Kurir from './KurirModel.js';

const Transaksi = db.define(
  'transaksi',
  {
    no_transaksi: {
      type: DataTypes.STRING,
      defaultValue: generateTransaksiNumber(),
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    status_pembayaran: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Lakukan Pembayaran',
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    status_pengiriman: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Dalam Pengiriman',
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jenis_pengiriman_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    barangId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kurirId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

// define assosiate
Transaksi.belongsTo(JenisPengiriman, { foreignKey: 'jenis_pengiriman_id', as: 'Jenis Pengiriman' });
Transaksi.belongsTo(Users, { foreignKey: 'userId', as: 'User' });
Transaksi.belongsTo(Barang, { foreignKey: 'barangId', as: 'Barang' });
Transaksi.belongsTo(Kurir, { foreignKey: 'kurirId', as: 'Kurir' });

// RELATION
JenisPengiriman.hasMany(Transaksi, { foreignKey: 'jenis_pengiriman_id' });
Users.hasMany(Transaksi, { foreignKey: 'userId' });
Barang.hasMany(Transaksi, { foreignKey: 'barangId' });
Kurir.hasMany(Transaksi, { foreignKey: 'kurirId' });

export default Transaksi;
(async () => await db.sync())();
