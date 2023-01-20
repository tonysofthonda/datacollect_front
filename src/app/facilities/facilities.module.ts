import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilitiesRoutingModule } from './facilities-routing.module';
import { FacilitiesListComponent } from './pages/facilities-list/facilities-list.component';
import { PrimeNgModule } from '../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FacilityFormComponent } from './pages/facility-form/facility-form.component';

@NgModule({
  declarations: [FacilitiesListComponent, FacilityFormComponent],
  imports: [
    CommonModule,
    FacilitiesRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FacilitiesModule {}
