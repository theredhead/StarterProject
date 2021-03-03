import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NotificationsService } from '../notifications.service';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly navigationItems$ = new BehaviorSubject<NavigationItem[]>(
    DEFAULT_NAVIGATION_ITEMS
  );

  constructor(
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  activate(item: NavigationItem): void {
    this.notificationsService.info(`Navigating for "${item.caption}".`);

    if (item?.action) {
      item.action();
    } else if (item?.routerLink) {
      this.router.navigate(item.routerLink);
    } else {
      this.notificationsService.error(
        `Invalid NavigationItem, unable to activate: ${item.caption}`
      );
    }
  }
}

export interface NavigationItem {
  caption: string;
  icon?: string;
  iconType?: NavigationItemIconType;
  routerLink?: any[];
  action?: () => void;
}

export type NavigationItemIconType = 'material' | 'url';

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    caption: 'Home',
    icon: 'home_outline',
    iconType: 'material',
    routerLink: ['/'],
  },
  {
    caption: 'About',
    icon: 'info_outline',
    iconType: 'material',
    routerLink: ['/about'],
  },
  {
    caption: 'Data Access',
    icon: 'schema',
    iconType: 'material',
    routerLink: ['/table'],
  },
  {
    caption: 'Contact',
    icon: 'mail_outline',
    iconType: 'material',
    action: () => alert('Not implemented'),
  },
  {
    caption: 'Help',
    icon: 'help_outline',
    iconType: 'material',
    action: () => alert('Not implemented'),
  },
];
