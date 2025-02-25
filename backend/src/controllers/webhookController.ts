import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';

const router = Router();

// Route pour recevoir les webhooks
router.post('/', (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    console.log('Webhook reçu:', webhookData);

    // Récupération de l'instance io depuis l'application Express
    const io = req.app.get('io') as SocketIOServer;
    
    // Envoi de la notification à tous les clients connectés via WebSocket
    io.emit('notification', {
      type: 'webhook_received',
      data: webhookData,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Webhook reçu et notification envoyée'
    });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement du webhook'
    });
  }
});

// Route pour tester le webhook (facultatif)
router.get('/test', (req: Request, res: Response) => {
  try {
    // Récupération de l'instance io depuis l'application Express
    const io = req.app.get('io') as SocketIOServer;
    
    // Envoi d'une notification de test à tous les clients connectés
    io.emit('notification', {
      type: 'test',
      message: 'Ceci est une notification de test',
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Notification de test envoyée'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de test:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la notification de test'
    });
  }
});

export default router;