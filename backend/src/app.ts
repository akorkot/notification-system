import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import webhookRoutes from './controllers/webhookController';

// Initialisation de l'application Express
const app = express();
const server = http.createServer(app);

// Configuration du serveur WebSocket
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Partage de l'instance io avec les routes
app.set('io', io);

// Définition des routes
app.use('/api/webhook', webhookRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Webhook et WebSocket POC API' });
});

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log(`Nouvelle connexion WebSocket: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Déconnexion WebSocket: ${socket.id}`);
  });
});

export { app, server };

