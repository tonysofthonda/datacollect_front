import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../prime-ng.module';
import { TitleComponent } from './title/title.component';
import { SearchComponent } from './search/search.component';
import { ServiceTypeInputComponent } from './service-type-input/service-type-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountInputDirective } from './directives/account-input.directive';

@NgModule({
  declarations: [SearchComponent, TitleComponent, ServiceTypeInputComponent, AccountInputDirective],
  imports: [CommonModule, PrimeNgModule, ReactiveFormsModule],
  exports: [SearchComponent, TitleComponent, ServiceTypeInputComponent, AccountInputDirective],
})
export class SharedModule {}
