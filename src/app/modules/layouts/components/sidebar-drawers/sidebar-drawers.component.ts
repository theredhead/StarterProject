import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'layout-sidebar-drawers',
  templateUrl: './sidebar-drawers.component.html',
  styleUrls: ['./sidebar-drawers.component.scss'],
})
export class SidebarDrawersComponent {
  @ViewChild('primaryDrawer') primaryDrawer!: MatDrawer;
  @ViewChild('secondaryDrawer') secondaryDrawer!: MatDrawer;

  @ContentChild('primary')
  primaryDrawerContent: ElementRef<any> | null = null;
  @ContentChild('secondary')
  secondaryDrawerContent: ElementRef<any> | null = null;

  @Input() hasBackdrop = false;
  @Input() primaryDrawerPosition: DrawerPosition = 'start';
  @Input() secondaryDrawerPosition: DrawerPosition = 'end';
  @Input() primaryDrawerMode: DrawerMode = 'side';
  @Input() secondaryDrawerMode: DrawerMode = 'side';
  @Input() primaryDrawerInitiallyOpen = false;
  @Input() secondaryDrawerInitiallyOpen = false;

  constructor(readonly elementRef: ElementRef<HTMLElement>) {
    this.elementRef.nativeElement.classList.add('layout');
  }

  openPrimaryDrawer(): void {
    this.primaryDrawer.open();
  }
  closePrimaryDrawer(): void {
    this.primaryDrawer.close();
  }

  openSecondaryDrawer(): void {
    this.secondaryDrawer.open();
  }
  closeSecondaryDrawer(): void {
    this.secondaryDrawer.close();
  }
}

declare type DrawerPosition = 'start' | 'end';
declare type DrawerMode = 'push' | 'side';
