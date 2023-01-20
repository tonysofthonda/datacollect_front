import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerchiefsRoutingModule } from './terchiefs-routing.module';
import { TerchiefsListComponent } from './pages/terchiefs-list/terchiefs-list.component';
import { TerchiefFormComponent } from './pages/terchief-form/terchief-form.component';
import { PrimeNgModule } from '../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TerchiefContactsComponent } from './components/terchief-contacts/terchief-contacts.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

@NgModule({
  declarations: [
    TerchiefsListComponent,
    TerchiefFormComponent,
    TerchiefContactsComponent,
    ContactListComponent,
    ContactFormComponent
  ],
  imports: [
    CommonModule,
    TerchiefsRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class TerchiefsModule {}
