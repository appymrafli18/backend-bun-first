import { Sequelize } from 'sequelize';

const db = new Sequelize(Bun.env.DB_NAME, Bun.env.DB_USERNAME, Bun.env.DB_PASSWORD, {
  host: Bun.env.DB_HOST,
  dialect: 'mysql',
});

export default db;
