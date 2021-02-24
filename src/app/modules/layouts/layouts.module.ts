import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarDrawersComponent } from './components/sidebar-drawers/sidebar-drawers.component';
import { MaterialComponentsModule } from '../material-components.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SidebarDrawersComponent],
  imports: [CommonModule, RouterModule, MaterialComponentsModule],
  exports: [SidebarDrawersComponent],
})
export class LayoutsModule {}
