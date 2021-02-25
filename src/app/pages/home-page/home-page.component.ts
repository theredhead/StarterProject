import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SidebarDrawersComponent } from 'src/app/modules/layouts/components/sidebar-drawers/sidebar-drawers.component';
import { NavigationService } from 'src/app/services/application/navigation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  @ViewChild(SidebarDrawersComponent) layout!: SidebarDrawersComponent;

  environment = environment;
  navigationDrawerIsOpen$: Observable<boolean>;
  navigationDrawerIsInitiallyOpen: boolean;

  toggleNavigationDrawer(): void {
    this.navigationService.toggleNavigationDrawer();
  }
  constructor(private navigationService: NavigationService) {
    this.navigationDrawerIsInitiallyOpen =
      navigationService.navigationDrawerIsInitiallyOpen;
    this.navigationDrawerIsOpen$ = this.navigationService.navigationDrawerIsOpen$.asObservable();
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.navigationDrawerIsOpen$.subscribe((open) => {
      open
        ? this.layout.primaryDrawer.open()
        : this.layout.primaryDrawer.close();
    });
  }
}
