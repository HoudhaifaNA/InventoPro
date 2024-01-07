import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { productsRoutes, shipmentsRoutes, salesRoutes, usersRoutes, statsRoutes } from './routes';
import { confirmAction, protect } from './controllers/authController';
import errorController from './controllers/errorController';
import attachmentsController from './controllers/attachmentsController';

const app = express();

app.use(cors({ credentials: true, origin: '*' }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

app.use('/api/users', usersRoutes);

// app.use(protect);
app.delete('/api/*', confirmAction);
app.use('/api/products', productsRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stats', statsRoutes);
app.get('/api/attachments/:filename', attachmentsController);

app.all('*', (_req, res) => {
  res.status(404).json({ status: 'error', message: "Le serveur n'a pas pu trouver la route API demandée." });
});

app.use(errorController);

export default app;
