import { DataTypes } from 'sequelize';
import db from '../config/Database';
import Users from './UsersModel';

const Barang = db.define(
  'barang',
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama_barang: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nama tidak boleh kosong',
        },
        notEmpty: {
          msg: 'Nama wajib di isi',
        },
        min: {
          args: 5,
          msg: 'Nama minimal 5 huruf',
        },
      },
    },
    harga_barang: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    deskripsi_barang: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    nama_image_barang: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    url_barang: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Barang);
Barang.belongsTo(Users, { foreignKey: 'userId', as: 'pemilik', targetKey: 'id' });

export default Barang;
(async () => await db.sync())();
