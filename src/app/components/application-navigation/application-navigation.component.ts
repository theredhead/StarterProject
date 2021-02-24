import { Component, OnInit } from '@angular/core';
import {
  NavigationItem,
  NavigationService,
} from 'src/app/services/application/navigation.service';

@Component({
  selector: 'app-application-navigation',
  templateUrl: './application-navigation.component.html',
  styleUrls: ['./application-navigation.component.scss'],
})
export class ApplicationNavigationComponent implements OnInit {
  items: NavigationItem[] = [];

  constructor(private navigationService: NavigationService) {}
  iconType(item: NavigationItem): string {
    return item?.iconType ?? 'material';
  }
  activate(item: NavigationItem): void {
    this.navigationService.activate(item);
  }
  ngOnInit(): void {
    this.navigationService.navigationItems.subscribe(
      (items) => (this.items = items)
    );
  }
}
