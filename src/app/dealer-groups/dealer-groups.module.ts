import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerGroupsRoutingModule } from './dealer-groups-routing.module';
import { DealerGroupsListComponent } from './pages/dealer-groups-list/dealer-groups-list.component';
import { PrimeNgModule } from '../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { DealerGroupFormComponent } from './pages/dealer-group-form/dealer-group-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DealerGroupsListComponent, DealerGroupFormComponent],
  imports: [
    CommonModule,
    DealerGroupsRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DealerGroupsModule {}
