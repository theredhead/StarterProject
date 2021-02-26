import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ApplicationHeaderComponent } from './components/application-header/application-header.component';
import { MaterialComponentsModule } from './modules/material-components.module';
import { ApplicationFooterComponent } from './components/application-footer/application-footer.component';
import { LayoutsModule } from './modules/layouts/layouts.module';
import { ApplicationNavigationComponent } from './components/application-navigation/application-navigation.component';
import { NotificationsService } from './services/notifications.service';
import { NotificationsToolButtonComponent } from './components/notifications-tool-button/notifications-tool-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundPageComponent,
    AboutPageComponent,
    ApplicationHeaderComponent,
    ApplicationFooterComponent,
    ApplicationNavigationComponent,
    NotificationsToolButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    LayoutsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(readonly notificationsService: NotificationsService) {
    this.notificationsService.overwriteAlertFunction();
  }
}
