import { DataTypes } from 'sequelize';
import db from '../config/Database';

const Users = db.define(
  'users',
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama: {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email sudah terdaftar',
      },
      validate: {
        notNull: {
          msg: 'Email tidak boleh kosong',
        },
        notEmpty: {
          msg: 'Email wajib di isi',
        },
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password tidak boleh kosong',
        },
        notEmpty: {
          msg: 'Password wajib di isi',
        },
      },
    },
    telepon: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'No Handphone tidak boleh kosong',
        },
        notEmpty: {
          msg: 'No Handphone wajib di isi',
        },
      },
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Customer',
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    nama_kurir: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Bukan Kurir',
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;

(async () => await db.sync())();
