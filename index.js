import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRoute from './routes/UsersRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import BarangRoute from './routes/BarangRoute.js';
import KurirRoute from './routes/KurirRoute.js';
import JenisRoute from './routes/JenisRoute.js';
import TransaksiRoute from './routes/TransaksiRoute.js';

const app = express();
const port = Bun.env.SERVER_PORT;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);
app.use(cookieParser());
app.use(express.static('public'));
app.use(usersRoute);
app.use(AuthRoute);
app.use(BarangRoute);
app.use(KurirRoute);
app.use(JenisRoute);
app.use(TransaksiRoute);
app.get('*', (_, res) => {
  res.status(404).send('404 PAGE NOT FOUND');
});

app.listen(port, () => console.log('Running...' + port));
