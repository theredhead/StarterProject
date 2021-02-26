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
  asideDrawerIsOpen$: Observable<boolean>;

  navigationDrawerIsInitiallyOpen: boolean;
  asideDrawerIsInitiallyOpen: boolean;

  constructor(private navigationService: NavigationService) {
    this.navigationDrawerIsInitiallyOpen =
      navigationService.navigationDrawerIsInitiallyOpen;
    this.asideDrawerIsInitiallyOpen =
      navigationService.asideDrawerIsInitiallyOpen;

    this.navigationDrawerIsOpen$ = this.navigationService.navigationDrawerIsOpen$.asObservable();
    this.asideDrawerIsOpen$ = this.navigationService.asideDrawerIsOpen$.asObservable();
  }

  toggleNavigationDrawer(): void {
    this.navigationService.toggleNavigationDrawer();
  }
  toggleAsideDrawer(): void {
    this.navigationService.toggleAsideDrawer();
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    const iif = (bool: boolean, yes: () => void, no: () => void) => {
      if (bool) {
        yes();
      } else {
        no();
      }
    };

    this.navigationDrawerIsOpen$.subscribe((open) => {
      iif(open, this.layout.openPrimaryDrawer, this.layout.closePrimaryDrawer);
    });
    this.asideDrawerIsOpen$.subscribe((open) => {
      iif(
        open,
        this.layout.openSecondaryDrawer,
        this.layout.closeSecondaryDrawer
      );
    });
  }
}
