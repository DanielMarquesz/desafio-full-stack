import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { rabbitmq } from './rabbitmq';
import notificacaoRoutes from './routes/notification';
import { initializeSocket } from './socket';

const app = express();
const httpServer = createServer(app);
const PORT = 3000;


initializeSocket(httpServer);

app.use(cors());
app.use(express.json());
app.use('/api', notificacaoRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor está funcionando' });
});


import './consumer';

httpServer.listen(PORT, async () => {
  console.log(`Servidor HTTP e Socket.IO rodando na porta ${PORT}`);
  await rabbitmq.connect();
});