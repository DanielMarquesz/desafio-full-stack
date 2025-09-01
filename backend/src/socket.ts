import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import statusService from './services/statusService';
import { NotificationStatus } from './types';

let io: Server;

function initializeSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);


    const allStatuses = statusService.getAllStatuses();
    socket.emit('status-inicial', allStatuses);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
}

function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io não inicializado');
  }
  return io;
}

export { initializeSocket, getIO };