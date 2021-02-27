import { Component, ViewChild } from '@angular/core';
import { SidebarDrawersComponent } from 'src/app/modules/layouts/components/sidebar-drawers/sidebar-drawers.component';
import { NotificationsService } from 'src/app/services/notifications.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  @ViewChild(SidebarDrawersComponent) layout!: SidebarDrawersComponent;

  environment = environment;
  notifications$;

  constructor(private notificationsService: NotificationsService) {
    this.notifications$ = this.notificationsService.notifications$;
  }

  toggleNavigationDrawer(): void {
    this.layout.togglePrimaryDrawer();
  }
  toggleAsideDrawer(): void {
    this.layout.toggleSecondaryDrawer();
  }
}
