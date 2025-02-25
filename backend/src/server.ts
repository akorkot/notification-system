// src/server.ts
import { app, server } from './app';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`WebSocket prêt à recevoir des connexions`);
});