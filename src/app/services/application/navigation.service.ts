import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navigationItems = new BehaviorSubject<NavigationItem[]>(
    DEFAULT_NAVIGATION_ITEMS
  );
  constructor(private router: Router) {}

  activate(item: NavigationItem): void {
    if (item?.action) {
      item.action();
    } else if (item?.routerLink) {
      this.router.navigate(item.routerLink);
    } else {
      console.error('Invalid NavigationItem, unable to activate: ', item);
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
    caption: 'Support',
    icon: 'support',
    iconType: 'material',
    routerLink: ['/support'],
  },
  {
    caption: 'Contact',
    icon: 'mail_outline',
    iconType: 'material',
    routerLink: ['/contact'],
  },
  {
    caption: 'Help',
    icon: 'help_outline',
    iconType: 'material',
    routerLink: ['/help'],
  },
];
