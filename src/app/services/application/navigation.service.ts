import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { NotificationsService } from '../notifications.service';

const NAVIGATION_DRAWER_KEY = 'navigation-drawer-open';
const ASIDE_DRAWER_KEY = 'aside-drawer-open';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly navigationDrawerIsOpen$ = new BehaviorSubject<boolean>(true);
  readonly asideDrawerIsOpen$ = new BehaviorSubject<boolean>(true);

  readonly navigationItems$ = new BehaviorSubject<NavigationItem[]>(
    DEFAULT_NAVIGATION_ITEMS
  );

  public readonly navigationDrawerIsInitiallyOpen;
  public readonly asideDrawerIsInitiallyOpen;

  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService
  ) {
    this.navigationDrawerIsInitiallyOpen = this.localStorageService.get<boolean>(
      NAVIGATION_DRAWER_KEY,
      true
    );
    this.asideDrawerIsInitiallyOpen = this.localStorageService.get<boolean>(
      ASIDE_DRAWER_KEY,
      true
    );

    this.navigationDrawerIsOpen$.next(this.navigationDrawerIsInitiallyOpen);
    this.asideDrawerIsOpen$.next(this.asideDrawerIsInitiallyOpen);

    this.navigationDrawerIsOpen$.subscribe((nextState) => {
      this.localStorageService.set<boolean>(NAVIGATION_DRAWER_KEY, nextState);
    });
    this.asideDrawerIsOpen$.subscribe((nextState) => {
      this.localStorageService.set<boolean>(ASIDE_DRAWER_KEY, nextState);
    });
  }

  toggleNavigationDrawer(): void {
    const currentState = this.navigationDrawerIsOpen$.getValue();
    this.navigationDrawerIsOpen$.next(!currentState);
  }

  toggleAsideDrawer(): void {
    const currentState = this.asideDrawerIsOpen$.getValue();
    this.asideDrawerIsOpen$.next(!currentState);
  }

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
    caption: 'Support',
    icon: 'support',
    iconType: 'material',
    action: () => alert('Not implemented'),
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
