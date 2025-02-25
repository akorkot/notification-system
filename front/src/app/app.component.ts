import { Component } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, NotificationComponent]
})
export class AppComponent {
  title = 'Webhook WebSocket Demo';
  currentYear = new Date().getFullYear();
}