import { Component, OnInit } from '@angular/core';
import {
  Notification,
  NotificationKind,
  NotificationsService,
} from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications-tool-button',
  templateUrl: './notifications-tool-button.component.html',
  styleUrls: ['./notifications-tool-button.component.scss'],
})
export class NotificationsToolButtonComponent implements OnInit {
  constructor(readonly notifications: NotificationsService) {}

  ngOnInit(): void {}

  notificationIcon(notification: Notification): string {
    switch (notification.kind) {
      case NotificationKind.error:
        return 'error';
      case NotificationKind.info:
        return 'info';
      case NotificationKind.success:
        return 'thumb_up_off_alt';
      case NotificationKind.warning:
        return 'warning';
      default:
        return 'circle_outline';
    }
  }
}
