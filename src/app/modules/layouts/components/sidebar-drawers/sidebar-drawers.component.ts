import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  // tslint:disable-next-line:component-selector
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

  get primaryDrawerHasContent(): boolean {
    return this.primaryDrawerContent?.nativeElement != null;
  }
  get secondaryDrawerHasContent(): boolean {
    return this.secondaryDrawerContent?.nativeElement != null;
  }

  toggle(): void {
    console.log('toggle...');
    this.primaryDrawer.toggle();
    this.secondaryDrawer.toggle();
  }
  constructor(readonly elementRef: ElementRef<HTMLElement>) {
    this.elementRef.nativeElement.classList.add('layout');
  }
}

declare type DrawerPosition = 'start' | 'end';
declare type DrawerMode = 'push' | 'side';
