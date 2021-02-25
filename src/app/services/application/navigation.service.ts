import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

const NAV_DRAWER_STATE_KEY = 'navigation-open';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.navigationDrawerIsInitiallyOpen = this.localStorageService.get<boolean>(
      NAV_DRAWER_STATE_KEY,
      true
    );

    this.navigationDrawerIsOpen$.next(
      this.localStorageService.get<boolean>(
        NAV_DRAWER_STATE_KEY,
        this.navigationDrawerIsInitiallyOpen
      )
    );

    this.navigationDrawerIsOpen$.subscribe((nextState) =>
      this.localStorageService.set<boolean>(NAV_DRAWER_STATE_KEY, nextState)
    );
  }
  readonly navigationDrawerIsOpen$ = new BehaviorSubject<boolean>(true);
  readonly navigationItems$ = new BehaviorSubject<NavigationItem[]>(
    DEFAULT_NAVIGATION_ITEMS
  );

  public readonly navigationDrawerIsInitiallyOpen;

  toggleNavigationDrawer(): void {
    const currentState = this.navigationDrawerIsOpen$.getValue();
    this.navigationDrawerIsOpen$.next(!currentState);
  }

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
