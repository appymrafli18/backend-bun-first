import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Kurir from './KurirModel.js';

const JenisPengiriman = db.define(
  'jenis_pengiriman',
  {
    nama_jenis: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
      validate: {
        notNull: [true, 'Nama Jenis Pengiriman wajib di isi'],
        notEmpty: [true, 'Nama Jenis Pengiriman tidak boleh kosong'],
      },
    },
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deskripsi: {
      type: DataTypes.TEXT,
      defaultValue: '',
      allowNull: true,
    },
    harga: {
      type: DataTypes.INTEGER,
      defaultValue: 10000,
      allowNull: false,
      validate: {
        notNull: [true, 'Harga Jenis Pengiriman wajib di isi'],
        notEmpty: [true, 'Harga Jenis Pengiriman tidak boleh kosong'],
      },
    },
    type_pengiriman: {
      type: DataTypes.STRING,
      defaultValue: 'Regular',
      allowNull: false,
      validate: {
        notNull: [true, 'Type Jenis Pengiriman wajib di isi'],
        notEmpty: [true, 'Type Jenis Pengiriman tidak boleh kosong'],
      },
    },
    kurirId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Kurir.hasMany(JenisPengiriman, { foreignKey: 'kurirId', sourceKey: 'id' });
JenisPengiriman.belongsTo(Kurir, { foreignKey: 'kurirId', targetKey: 'id' });

export default JenisPengiriman;
(async () => {
  await db.sync();
})();
