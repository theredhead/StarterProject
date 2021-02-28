import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { LocalStorageService } from 'src/app/services/local-storage.service';

const NAVIGATION_DRAWER_KEY = 'navigation-drawer-open';
const ASIDE_DRAWER_KEY = 'aside-drawer-open';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'layout-sidebar-drawers',
  templateUrl: './sidebar-drawers.component.html',
  styleUrls: ['./sidebar-drawers.component.scss'],
})
export class SidebarDrawersComponent {
  @ViewChild('primaryDrawer') primaryDrawer!: MatDrawer;
  @ViewChild('secondaryDrawer') secondaryDrawer!: MatDrawer;

  @Input() hasBackdrop = false;
  @Input() primaryDrawerPosition: DrawerPosition = 'start';
  @Input() secondaryDrawerPosition: DrawerPosition = 'end';
  @Input() primaryDrawerMode: DrawerMode = 'side';
  @Input() secondaryDrawerMode: DrawerMode = 'side';

  primaryDrawerInitiallyOpen = false;
  secondaryDrawerInitiallyOpen = false;

  constructor(
    readonly elementRef: ElementRef<HTMLElement>,
    private localstorageService: LocalStorageService
  ) {
    this.elementRef.nativeElement.classList.add('layout');
    this.primaryDrawerInitiallyOpen = this.localstorageService.get(
      NAVIGATION_DRAWER_KEY,
      this.primaryDrawerInitiallyOpen
    );
    this.secondaryDrawerInitiallyOpen = this.localstorageService.get(
      ASIDE_DRAWER_KEY,
      this.secondaryDrawerInitiallyOpen
    );
  }
  togglePrimaryDrawer() {
    if (this.localstorageService.get(NAVIGATION_DRAWER_KEY, true)) {
      this.closePrimaryDrawer();
    } else {
      this.openPrimaryDrawer();
    }
  }
  toggleSecondaryDrawer() {
    if (this.localstorageService.get(ASIDE_DRAWER_KEY, true)) {
      this.closeSecondaryDrawer();
    } else {
      this.openSecondaryDrawer();
    }
  }
  openPrimaryDrawer(): void {
    this.localstorageService.set(NAVIGATION_DRAWER_KEY, true);
    this.primaryDrawer.open();
  }
  closePrimaryDrawer(): void {
    this.localstorageService.set(NAVIGATION_DRAWER_KEY, false);
    this.primaryDrawer.close();
  }

  openSecondaryDrawer(): void {
    this.localstorageService.set(ASIDE_DRAWER_KEY, true);
    this.secondaryDrawer.open();
  }
  closeSecondaryDrawer(): void {
    this.localstorageService.set(ASIDE_DRAWER_KEY, false);
    this.secondaryDrawer.close();
  }
}

declare type DrawerPosition = 'start' | 'end';
declare type DrawerMode = 'push' | 'side';
