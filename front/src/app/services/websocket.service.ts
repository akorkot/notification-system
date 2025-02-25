import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

export interface Notification {
  type: string;
  data?: any;
  message?: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  constructor() {
    this.socket = io(environment.websocketUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // Écoute des notifications
    this.socket.on('notification', (notification: Notification) => {
      console.log('Nouvelle notification reçue:', notification);
      
      // Ajouter la notification à notre liste
      const currentNotifications = this.notifications.getValue();
      this.notifications.next([notification, ...currentNotifications]);
    });

    // Écoute des erreurs de connexion
    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion WebSocket:', error);
    });

    // Écoute des reconnexions
    this.socket.on('reconnect', (attempt) => {
      console.log(`Reconnecté au serveur WebSocket après ${attempt} tentatives`);
    });
  }

  // Méthode pour tester le webhook depuis le frontend
  public testWebhook(): Observable<any> {
    return new Observable(observer => {
      fetch(`${environment.apiUrl}/webhook/test`)
        .then(response => response.json())
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Méthode pour vérifier si le socket est connecté
  public isConnected(): boolean {
    return this.socket && this.socket.connected;
  }

  // Méthode pour se déconnecter proprement
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
