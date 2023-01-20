import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { PrimeNgModule } from '../prime-ng.module';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { CodeComponent } from './code/code.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    FooterComponent,
    MenuComponent,
    MenuItemComponent,
    CodeComponent,
    TopbarComponent,
    ProfileMenuComponent,
  ],
  imports: [CommonModule, PrimeNgModule],
  exports: [
    BreadcrumbComponent,
    FooterComponent,
    MenuComponent,
    TopbarComponent,
  ],
})
export class TemplateModule {}
