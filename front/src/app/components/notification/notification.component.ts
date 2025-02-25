import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService, Notification } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  isConnected = false;
  private subscription: Subscription = new Subscription();

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {

    setTimeout(() => {
    if (!this.isConnected) {
        console.log('Délai de connexion dépassé - affichage de l\'interface quand même');
    }
    }, 3000);
    
    // Vérifier l'état de la connexion
    this.isConnected = this.websocketService.isConnected();
    
    // S'abonner aux notifications
    this.subscription.add(
      this.websocketService.notifications$.subscribe(
        (notifications) => {
          this.notifications = notifications;
        }
      )
    );
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    this.subscription.unsubscribe();
  }

  // Méthode pour tester le webhook
  testWebhook(): void {
    this.websocketService.testWebhook().subscribe(
      (response) => {
        console.log('Test webhook response:', response);
      },
      (error) => {
        console.error('Test webhook error:', error);
      }
    );
  }

  // Formater la date pour l'affichage
  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  // Supprimer une notification
  removeNotification(index: number): void {
    const currentNotifications = [...this.notifications];
    currentNotifications.splice(index, 1);
    this.notifications = currentNotifications;
  }
}


