import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// eslint-disable-next-line no-shadow
export enum NotificationKind {
  info,
  success,
  warning,
  error,
}

export interface Notification {
  kind: NotificationKind;
  message: string;
  origin?: any;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public snackbarDuration = 3000;

  readonly undismissed$: Observable<NotificationLogEntry[]>;
  readonly notifications$ = new BehaviorSubject<NotificationLogEntry[]>([]);

  private originalAlertFunction!: (message: string) => void;

  constructor(private snackbar: MatSnackBar) {
    this.undismissed$ = this.notifications$.pipe(
      map((all) => all.filter((single) => !single.dismissed))
    );
  }

  dismiss(item: NotificationLogEntry): void {
    item.dismissed = true;
    this.notifications$.next([...this.notifications$.getValue()]);
  }
  dismissAll(): void {
    this.notifications$.getValue().forEach((o) => (o.dismissed = true));
    this.notifications$.next([...this.notifications$.getValue()]);
  }

  error(message: string, origin?: any): void {
    this.notify({
      kind: NotificationKind.error,
      message,
      origin,
    });
  }
  warn(message: string, origin?: any): void {
    this.notify({
      kind: NotificationKind.warning,
      message,
      origin,
    });
  }
  success(message: string, origin?: any): void {
    this.notify({
      kind: NotificationKind.success,
      message,
      origin,
    });
  }
  info(message: string, origin?: any): void {
    this.notify({
      kind: NotificationKind.info,
      message,
      origin,
    });
  }

  overwriteAlertFunction(): void {
    this.originalAlertFunction = window.alert;
    window.alert = (message: string) => this.warn(message);
  }
  restoreAlertFunction(): void {
    window.alert = this.originalAlertFunction;
  }

  private notify(notification: Notification): void {
    const ref = this.snackbar.open(notification.message, undefined, {
      duration: this.snackbarDuration,
      panelClass: [
        'snackbar-panel',
        cssClassForNotificationKind(notification.kind),
      ],
    });
    this.notifications$.next([
      ...this.notifications$.getValue(),
      new NotificationLogEntry(notification, ref),
    ]);
  }
}

export class NotificationLogEntry {
  readonly logDate: Date = new Date();
  dismissed = false;

  constructor(
    readonly notification: Notification,
    readonly snackbarReference: MatSnackBarRef<TextOnlySnackBar>
  ) {}
}

const cssClassForNotificationKind = (kind: NotificationKind): string => {
  switch (kind) {
    case NotificationKind.error:
      return 'error';
    case NotificationKind.warning:
      return 'warning';
    case NotificationKind.success:
      return 'success';
    case NotificationKind.info:
      return 'info';
    default:
      return 'unknown';
  }
};
