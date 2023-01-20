import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealersRoutingModule } from './dealers-routing.module';
import { DealersListComponent } from './pages/dealers-list/dealers-list.component';
import { PrimeNgModule } from '../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DealersFormComponent } from './pages/dealers-form/dealers-form.component';
import { CityInputComponent } from './components/inputs/city-input/city-input.component';
import { DealerGroupInputComponent } from './components/inputs/dealer-group-input/dealer-group-input.component';
import { WorkshopInputComponent } from './components/inputs/workshop-input/workshop-input.component';
import { TerchiefInputComponent } from './components/inputs/terchief-input/terchief-input.component';
import { DealerFacilitiesComponent } from './components/dealer-facilities/dealer-facilities/dealer-facilities.component';
import { DealerFacilitiesListComponent } from './components/dealer-facilities/dealer-facilities-list/dealer-facilities-list.component';
import { DealerFacilitiesFormComponent } from './components/dealer-facilities/dealer-facilities-form/dealer-facilities-form.component';
import { FacilityInputComponent } from './components/inputs/facility-input/facility-input.component';
import { DealerContactComponent } from './components/dealer-contacts/dealer-contact/dealer-contact.component';
import { DealerContactsFormComponent } from './components/dealer-contacts/dealer-contacts-form/dealer-contacts-form.component';
import { DealerContactsListComponent } from './components/dealer-contacts/dealer-contacts-list/dealer-contacts-list.component';
import { PositionInputComponent } from './components/inputs/position-input/position-input.component';
import { NotificationInputComponent } from './components/inputs/notification-input/notification-input.component';

@NgModule({
  declarations: [DealersListComponent, DealersFormComponent, CityInputComponent, DealerGroupInputComponent, WorkshopInputComponent, TerchiefInputComponent, DealerFacilitiesComponent, DealerFacilitiesListComponent, DealerFacilitiesFormComponent, FacilityInputComponent, DealerContactComponent, DealerContactsFormComponent, DealerContactsListComponent, PositionInputComponent, NotificationInputComponent],
  imports: [
    CommonModule,
    DealersRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DealersModule {}
