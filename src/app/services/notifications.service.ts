import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageRepository } from './data/localstorage-repository';
import {
  AddEntityAction,
  ModifyEntityAction,
} from './data/localstorage-repository.actions';
import { Repository } from './data/repository';
import { RepositoryAction } from './data/repository-action';

const NOTIFICATIONS_STORAGE_KEY = 'notifications';
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
  readonly notifications$: Observable<NotificationLogEntry[]>;

  private originalAlertFunction!: (message: string) => void;
  private storage = new NotificationsRepository();

  constructor(private snackbar: MatSnackBar) {
    this.notifications$ = this.storage.entities$.asObservable();
    this.undismissed$ = this.notifications$.pipe(
      map((all) => all.filter((single) => !single.dismissed))
    );
  }

  dismiss(item: NotificationLogEntry): void {
    item.dismissed = true;
    this.storage.performAction(
      new ModifyEntityAction(item, (a, b) => Object.is(a, b))
    );
  }

  dismissAll(): void {
    this.storage.performAction(new DissmissAllNotificationAction());
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

    this.storage.performAction(
      new AddEntityAction(new NotificationLogEntry(notification))
    );
  }
}

export class NotificationLogEntry {
  readonly logDate: Date = new Date();
  dismissed = false;

  constructor(readonly notification: Notification) {}
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
class NotificationsRepository extends LocalStorageRepository<NotificationLogEntry> {
  readonly localStorageKey = NOTIFICATIONS_STORAGE_KEY;
}

class DissmissNotificationAction extends RepositoryAction<NotificationLogEntry> {
  type = '[Dismiss a notification]';
  constructor(private payload: NotificationLogEntry) {
    super();
  }
  run(
    data: NotificationLogEntry[],
    repository: Repository<NotificationLogEntry>
  ): NotificationLogEntry[] {
    const updated = [...data];
    const index = updated.findIndex((o) => Object.is(o, this.payload));
    updated[index].dismissed = true;
    return updated;
  }
}
class DissmissAllNotificationAction extends RepositoryAction<NotificationLogEntry> {
  type = '[Dismiss all notifications]';
  run(
    data: NotificationLogEntry[],
    repository: Repository<NotificationLogEntry>
  ): NotificationLogEntry[] {
    return data.map((o) => Object.assign({}, o, { dismissed: true }));
  }
}
