import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationNavigationComponent } from './components/application-navigation/application-navigation.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { BackendTestPageComponent } from './pages/backend-test-page/backend-test-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [{ path: 'about', component: AboutPageComponent }],
  },
  { path: 'table', component: BackendTestPageComponent },
  { path: 'table/:table', component: BackendTestPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
